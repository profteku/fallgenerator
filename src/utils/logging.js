export async function logEvent(eventType, details = {}) {
  // Diese Funktion ruft die "Telefonnummer" /api/log auf dem Server an.
  await fetch('/api/log', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_type: eventType,
      page_path: window.location.pathname,
      details: details,
    }),
  });
}