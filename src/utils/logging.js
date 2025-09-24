// NEU: Importiere die Bibliothek am Anfang der Datei
import { UAParser } from 'ua-parser-js';

export async function logEvent(eventType, details = {}) {
  // --- NEU: Zusätzliche Metriken erfassen ---

  // 1. User-Agent analysieren
  const parser = new UAParser();
  const uaResult = parser.getResult();
  
  const clientInfo = {
    // Gibt z.B. 'mobile', 'tablet' oder undefined zurück. Wir setzen 'desktop' als Standard.
    device_type: uaResult.device.type || 'desktop', 
    os: {
      name: uaResult.os.name,
      version: uaResult.os.version,
    },
    browser: {
      name: uaResult.browser.name,
      version: uaResult.browser.version,
    },
  };

  // 2. Bildschirm- und Fensterauflösung abfragen
  const screenInfo = {
    screen_resolution: `${window.screen.width}x${window.screen.height}`, // Die Auflösung des physischen Monitors
    viewport_size: `${window.innerWidth}x${window.innerHeight}`, // Die Größe des Browserfensters
  };

  // ---------------------------------------------
  
  await fetch('/api/log', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_type: eventType,
      page_path: window.location.pathname,
      details: details,
      // NEU: Füge die neu erfassten Daten dem Sende-Payload hinzu
      client: clientInfo,
      screen: screenInfo,
    }),
  });
}