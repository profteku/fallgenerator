import express from 'express';
import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; // Zum Laden von .env-Variablen im Backend

// .env-Variablen laden
dotenv.config();

// Helfer für __dirname in ES-Modulen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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


// Server starten
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Logging to: ${logFilePath}`);
});