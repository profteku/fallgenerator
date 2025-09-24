import { defineStore } from 'pinia';

// Definiere den Store mit einer eindeutigen ID 'logs'
export const useLogStore = defineStore('logs', {
  // state() definiert die Daten, die der Store verwalten soll
  state: () => ({
    logEntries: [], // Hier werden die geladenen Logs gespeichert
    isLoading: false, // Um einen Ladezustand anzuzeigen
    error: null, // Um eventuelle Fehler zu speichern
  }),

  // getters sind wie berechnete Eigenschaften für Stores (z.B. für Auswertungen)
  getters: {
    totalEvents: (state) => state.logEntries.length,
    mostPopularCase: (state) => {
    if (state.logEntries.length === 0) {
      // Gibt ein Standardobjekt zurück, damit die Komponente nicht bricht
      return { case_nr: null, count: 0, name: 'Keine Daten' };
    }

    // 1. Zähle die Vorkommen und speichere den Namen mit ab
    const caseData = state.logEntries.reduce((acc, log) => {
      const caseNr = log.details?.case_nr;
      const caseName = log.details?.name; // Der neue Name aus den Logs

      // Nur Logs mit einer case_nr berücksichtigen
      if (caseNr) {
        if (!acc[caseNr]) {
          // Wenn der Fall zum ersten Mal auftaucht, initialisiere ihn
          acc[caseNr] = { count: 0, name: caseName || `Fall #${caseNr}` };
        }
        acc[caseNr].count++;
      }
      return acc;
    }, {});
    // Ergebnis: { '184': { count: 5, name: 'Der Spuk im alten Haus' }, ... }

    // 2. Finde den Eintrag mit der höchsten Anzahl
    const popularEntry = Object.entries(caseData)
      .sort((a, b) => b[1].count - a[1].count)[0]; // Sortiere absteigend und nimm den ersten

    if (!popularEntry) {
      return { case_nr: null, count: 0, name: 'Keine Fall-Daten' };
    }

    // 3. Gib ein sauberes Objekt mit allen benötigten Informationen zurück
    return {
      case_nr: popularEntry[0], // z.B. '184'
      count: popularEntry[1].count, // z.B. 5
      name: popularEntry[1].name // z.B. 'Der Spuk im alten Haus'
    };
  },
    uniqueUserCount: (state) => {
    if (state.logEntries.length === 0) return 0;
    // Ein Set speichert automatisch nur einzigartige Werte.
    // Wir erstellen ein Set aus allen hashed_ip's und geben dessen Größe zurück.
    const uniqueIPs = new Set(state.logEntries.map(log => log.hashed_ip));
    return uniqueIPs.size;
  },

  /**
   * Bereitet Daten für ein Zeitverlaufs-Diagramm vor.
   * Gruppiert die Log-Einträge nach Tag.
   */
  eventsOverTime: (state) => {
    if (state.logEntries.length === 0) {
      return { labels: [], data: [] }; // Leere Daten für den Graphen
    }

    // 1. Zähle die Events pro Tag
    const countsPerDay = state.logEntries.reduce((acc, log) => {
      // Extrahiere nur das Datum (JJJJ-MM-TT) aus dem Zeitstempel
      const day = log.timestamp.split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {}); // Ergebnis: { '2025-09-22': 5, '2025-09-23': 12 }

    // 2. Sortiere die Tage chronologisch
    const sortedDays = Object.keys(countsPerDay).sort();

    // 3. Erstelle die Label- und Daten-Arrays für den Graphen
    const labels = sortedDays;
    const data = sortedDays.map(day => countsPerDay[day]);

    return { labels, data };
  },
  },

  // actions sind Methoden, die den State verändern (z.B. Daten laden)
  actions: {
    async fetchLogs() {
      this.isLoading = true; // Ladezustand starten
      this.error = null;
      try {
        // Lade die JSON-Datei aus dem /public Ordner
        const response = await fetch('/access_log.json');
        if (!response.ok) {
          throw new Error('Netzwerk-Antwort war nicht in Ordnung.');
        }
        // Weise die geladenen Daten dem State zu
        this.logEntries = await response.json();
      } catch (err) {
        this.error = 'Fehler beim Laden der Log-Datei: ' + err.message;
        console.error(err);
      } finally {
        this.isLoading = false; // Ladezustand beenden
      }
    },
  },
});