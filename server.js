import express from 'express';
import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; // Zum Laden von .env-Variablen im Backend

import sqlite3 from 'sqlite3'; //Für die Bewertungsdatenbank
import { open } from 'sqlite';

// Helfer für __dirname in ES-Modulen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'ratings.db');

let db;

// .env-Variablen laden
dotenv.config();

// Datenbankverbindung asynchron herstellen
async function initializeDb() {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });
    // Tabelle für Bewertungen erstellen, falls sie nicht existiert
    await db.exec(`
        CREATE TABLE IF NOT EXISTS ratings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            folgen_id TEXT NOT NULL,
            rating INTEGER NOT NULL,
            timestamp TEXT NOT NULL
        )
    `);
    console.log('SQLite-Datenbank für Bewertungen initialisiert.');
};

const app = express();
const PORT = process.env.VITE_SERVER_PORT || 3000; // Port aus .env oder Standard 3000

// Middleware für JSON-Body-Parsing
app.use(express.json());

// Log-Datei-Pfad (im Root des Projekts)
const logFilePath = path.join(__dirname, 'access_log.json');

// Funktion zum Hashing einer IP-Adresse
function hashIp(ip) {
  if (!ip) return 'unknown_ip';
  return createHash('sha256').update(ip).digest('hex');
}

// === API-Endpunkt für Spotify-Token (Hilfsfunktion) ===
async function getSpotifyAccessToken() {
  const CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Spotify API keys are not defined in .env');
  }

  const authResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });
  const authData = await authResponse.json();
  if (!authResponse.ok) {
    throw new Error(`Spotify Auth Error: ${authData.error_description || JSON.stringify(authData)}`);
  }
  return authData.access_token;
}

// === Logging API-Endpunkt ===
app.post('/api/log', async (req, res) => {
  try {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const hashedIp = hashIp(clientIp);
    const timestamp = new Date().toISOString();

    const logEntry = {
      timestamp: timestamp,
      hashed_ip: hashedIp,
      ...req.body // Fügt alle Daten vom Frontend hinzu (event_type, case_nr etc.)
    };

    let logs = [];
    try {
      const fileContent = await fs.readFile(logFilePath, 'utf-8');
      logs = JSON.parse(fileContent);
    } catch (readError) {
      if (readError.code !== 'ENOENT') {
        console.warn('Error reading log file, starting new one:', readError);
      }
    }

    logs.push(logEntry);
    await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), 'utf-8');

    console.log(`[LOG] Event: ${logEntry.event_type || 'unknown'} - Path: ${logEntry.page_path || 'N/A'}`);
    res.status(200).json({ message: 'Log entry recorded' });

  } catch (error) {
    console.error('Failed to log event:', error);
    res.status(500).json({ message: 'Failed to record log entry', details: error.message });
  }
});


// === Spotify Proxy für "Fall der Woche" ===
app.get('/api/fall-der-woche', async (req, res) => {
  try {
    const accessToken = await getSpotifyAccessToken();
    const PLAYLIST_ID = '0FB4kFr4ZwjtloY5NFfKS9'; // ID für Fall der Woche
    
    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const playlistData = await playlistResponse.json();
    
    if (!playlistResponse.ok) {
        throw new Error(`Spotify Playlist Error: ${playlistData.error?.message || JSON.stringify(playlistData)}`);
    }

    const latestAlbum = playlistData.items[2].track.album; // Annahme: immer das 3. Element
    res.json({ spotifyId: latestAlbum.id, name: latestAlbum.name });

  } catch (error) {
    console.error('Fehler in der Spotify API Route (Woche):', error);
    res.status(500).json({ error: 'Failed to fetch from Spotify API', details: error.message });
  }
});

// === Spotify Proxy für "Geheimer Fall" ===
app.get('/api/geheimer-fall', async (req, res) => {
  try {
    const accessToken = await getSpotifyAccessToken();
    const PLAYLIST_ID = '5wj03uVWfWl9Qs0EsMEUu9'; // NEUE PLAYLIST ID
    
    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const playlistData = await playlistResponse.json();

    if (!playlistResponse.ok) {
        throw new Error(`Spotify Playlist Error: ${playlistData.error?.message || JSON.stringify(playlistData)}`);
    }

    const latestAlbum = playlistData.items[2].track.album; // Annahme: immer das 3. Element
    res.json({ spotifyId: latestAlbum.id, name: latestAlbum.name });

  } catch (error) {
    console.error('Fehler in der Spotify API Route (Geheim):', error);
    res.status(500).json({ error: 'Failed to fetch from Spotify API', details: error.message });
  }
});

// Endpunkte für AbgegebeneRatings
app.post('/api/ratings', async (req, res) => {
    try {
        const { folgenId, rating } = req.body;
        // Einfache Validierung: Rating muss zwischen 0 und 5 sein
        if (rating === null || typeof rating !== 'number' || rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'Ungültige Bewertung.' });
        }
        
        const timestamp = new Date().toISOString();
        const result = await db.run(
            `INSERT INTO ratings (folgen_id, rating, timestamp) VALUES (?, ?, ?)`,
            [folgenId, rating, timestamp]
        );
        
        res.status(201).json({ 
            message: 'Bewertung erfolgreich gespeichert.', 
            id: result.lastID 
        });
    } catch (error) {
        console.error('Fehler beim Speichern der Bewertung:', error);
        res.status(500).json({ message: 'Interner Serverfehler.', details: error.message });
    }
});

// Endpunkt zum Senden der Ratings
app.get('/api/ratings/:folgenId', async (req, res) => {
    try {
        const { folgenId } = req.params;
        const result = await db.get(
            `SELECT AVG(rating) as averageRating, COUNT(rating) as ratingCount
             FROM ratings WHERE folgen_id = ?`,
            [folgenId]
        );

        if (!result) {
            return res.status(404).json({ message: 'Keine Bewertungen für diese Folge gefunden.' });
        }

        const averageRating = result.averageRating ? parseFloat(result.averageRating.toFixed(1)) : 0;
        
        res.status(200).json({
            averageRating: averageRating,
            ratingCount: result.ratingCount
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Bewertung:', error);
        res.status(500).json({ message: 'Interner Serverfehler.', details: error.message });
    }
});


// Server starten
initializeDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
        console.log(`Logging to: ${logFilePath}`);
    });
}).catch(err => {
    console.error('Fehler bei der Initialisierung der Datenbank:', err);
    process.exit(1);
});