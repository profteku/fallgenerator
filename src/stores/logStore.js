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
    // --- BESTEHENDE GETTER ---
    totalEvents: (state) => state.logEntries.length,
    
    mostPopularCase: (state) => {
      if (state.logEntries.length === 0) {
        return { case_nr: null, count: 0, name: 'Keine Daten' };
      }
      const caseData = state.logEntries.reduce((acc, log) => {
        const caseNr = log.details?.case_nr;
        const caseName = log.details?.name;
        if (caseNr) {
          if (!acc[caseNr]) {
            acc[caseNr] = { count: 0, name: caseName || `Fall #${caseNr}` };
          }
          acc[caseNr].count++;
        }
        return acc;
      }, {});
      const popularEntry = Object.entries(caseData).sort((a, b) => b[1].count - a[1].count)[0];
      if (!popularEntry) {
        return { case_nr: null, count: 0, name: 'Keine Fall-Daten' };
      }
      return {
        case_nr: popularEntry[0],
        count: popularEntry[1].count,
        name: popularEntry[1].name
      };
    },

    uniqueUserCount: (state) => {
      if (state.logEntries.length === 0) return 0;
      const uniqueIPs = new Set(state.logEntries.map(log => log.hashed_ip));
      return uniqueIPs.size;
    },

    eventsOverTime: (state) => {
      if (state.logEntries.length === 0) {
        return { labels: [], data: [] };
      }
      const countsPerDay = state.logEntries.reduce((acc, log) => {
        const day = log.timestamp.split('T')[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});
      const sortedDays = Object.keys(countsPerDay).sort();
      const labels = sortedDays;
      const data = sortedDays.map(day => countsPerDay[day]);
      return { labels, data };
    },

    _countOccurrences: (state) => (getProperty) => {
      if (state.logEntries.length === 0) return {};
      return state.logEntries.reduce((acc, log) => {
        const value = getProperty(log);
        if (value) {
          acc[value] = (acc[value] || 0) + 1;
        }
        return acc;
      }, {});
    },
    
    _prepareChartData: (state) => (counts) => {
      const labels = Object.keys(counts);
      const data = Object.values(counts);
      return { labels, data };
    },
    
    deviceTypeDistribution: (state) => {
      const counts = state._countOccurrences(log => log.client?.device_type);
      return state._prepareChartData(counts);
    },

    osDistribution: (state) => {
      const counts = state._countOccurrences(log => log.client?.os?.name);
      return state._prepareChartData(counts);
    },

    browserDistribution: (state) => {
      const counts = state._countOccurrences(log => log.client?.browser?.name);
      return state._prepareChartData(counts);
    },

    // --- NEUE GETTER FÜR DIE USERSVIEW ---

    /**
     * Berechnet die Anzahl der einzigartigen Nutzer pro Tag für den Graphen.
     */
    uniqueUsersOverTime: (state) => {
      if (state.logEntries.length === 0) return { labels: [], data: [] };
      const logsByDay = state.logEntries.reduce((acc, log) => {
        const day = log.timestamp.split('T')[0];
        if (!acc[day]) acc[day] = [];
        acc[day].push(log.hashed_ip);
        return acc;
      }, {});
      const uniqueUsersPerDay = Object.entries(logsByDay).reduce((acc, [day, ips]) => {
        acc[day] = new Set(ips).size;
        return acc;
      }, {});
      const sortedDays = Object.keys(uniqueUsersPerDay).sort();
      const labels = sortedDays;
      const data = sortedDays.map(day => uniqueUsersPerDay[day]);
      return { labels, data };
    },

    /**
     * Berechnet detaillierte Statistiken für jeden einzelnen Nutzer.
     */
    detailedUserStats: (state) => {
      if (state.logEntries.length === 0) return [];
      const statsByIp = state.logEntries.reduce((acc, log) => {
        const ip = log.hashed_ip;
        if (!acc[ip]) {
          acc[ip] = { logs: [] };
        }
        acc[ip].logs.push(log);
        return acc;
      }, {});
      return Object.entries(statsByIp)
        .map(([ip, data]) => {
          data.logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          const lastAccess = data.logs[0].timestamp;
          const caseCounts = data.logs.reduce((acc, log) => {
            const caseNr = log.details?.case_nr;
            if (caseNr) {
              if (!acc[caseNr]) acc[caseNr] = { count: 0, name: log.details.name };
              acc[caseNr].count++;
            }
            return acc;
          }, {});
          const favoriteCaseEntry = Object.entries(caseCounts).sort((a, b) => b[1].count - a[1].count)[0];
          const favoriteCase = favoriteCaseEntry
            ? { case_nr: favoriteCaseEntry[0], ...favoriteCaseEntry[1] }
            : { case_nr: 'N/A', name: 'Keine Fall-Interaktion', count: 0 };
          return {
            hashed_ip: ip,
            lastAccess,
            favoriteCase
          };
        })
        .sort((a, b) => new Date(b.lastAccess) - new Date(a.lastAccess));
    },
  },

  // actions sind Methoden, die den State verändern (z.B. Daten laden)
  actions: {
    async fetchLogs() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch('/access_log.json');
        if (!response.ok) {
          throw new Error('Netzwerk-Antwort war nicht in Ordnung.');
        }
        this.logEntries = await response.json();
      } catch (err) {
        this.error = 'Fehler beim Laden der Log-Datei: ' + err.message;
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});