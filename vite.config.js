import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
      {
        name: 'custom-spotify-api',
        configureServer(server) {
          // Route für "Fall der Woche" (bleibt unverändert)
          server.middlewares.use('/api/fall-der-woche', async (req, res, next) => {
            const CLIENT_ID = env.VITE_SPOTIFY_CLIENT_ID;
            const CLIENT_SECRET = env.VITE_SPOTIFY_CLIENT_SECRET;
            const PLAYLIST_ID = '0FB4kFr4ZwjtloY5NFfKS9'; // ID für Fall der Woche
            // ... (restlicher Code für diese Route bleibt gleich)
            try {
              const authResponse = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}` });
              const authData = await authResponse.json();
              if (!authResponse.ok) { throw new Error(`Spotify Error: ${authData.error_description || 'Auth-Fehler'}`); }
              const accessToken = authData.access_token;
              const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, { headers: { 'Authorization': `Bearer ${accessToken}` } });
              const playlistData = await playlistResponse.json();
              const latestAlbum = playlistData.items[2].track.album;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ spotifyId: latestAlbum.id, name: latestAlbum.name }));
            } catch (error) {
              console.error('Fehler in der Spotify API Route (Woche):', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to fetch from Spotify API', details: error.message }));
            }
          });

          // --- NEUE ROUTE FÜR "GEHEIMER FALL" ---
          server.middlewares.use('/api/geheimer-fall', async (req, res, next) => {
            const CLIENT_ID = env.VITE_SPOTIFY_CLIENT_ID;
            const CLIENT_SECRET = env.VITE_SPOTIFY_CLIENT_SECRET;
            const PLAYLIST_ID = '5wj03uVWfWl9Qs0EsMEUu9'; // <-- NEUE PLAYLIST ID
            try {
              const authResponse = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}` });
              const authData = await authResponse.json();
              if (!authResponse.ok) { throw new Error(`Spotify Error: ${authData.error_description || 'Auth-Fehler'}`); }
              const accessToken = authData.access_token;
              const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, { headers: { 'Authorization': `Bearer ${accessToken}` } });
              const playlistData = await playlistResponse.json();
              const latestAlbum = playlistData.items[2].track.album;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ spotifyId: latestAlbum.id, name: latestAlbum.name }));
            } catch (error) {
              console.error('Fehler in der Spotify API Route (Geheim):', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to fetch from Spotify API', details: error.message }));
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})