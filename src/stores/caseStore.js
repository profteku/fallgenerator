import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCaseStore = defineStore('cases', () => {
  // === STATE ===
  const allCases = ref([]);
  const isLoading = ref(false);
  const featuredCases = ref({ week: null, secret: null });
  // NEU: Eine Liste, um die letzten 15 Fälle zu speichern.
  const recentlySuggested = ref([]);

  // === GETTERS ===
  const getCaseByNr = computed(() => {
    return (nr) => {
      const caseNr = parseInt(nr, 10);
      return allCases.value.find(c => c.nr === caseNr);
    }
  });

  // === ACTIONS ===
  async function fetchCases() {
    if (allCases.value.length > 0) return;
    isLoading.value = true;
    try {
      const response = await fetch('/ddf.json');
      if (!response.ok) throw new Error('Netzwerk-Antwort war nicht ok.');
      allCases.value = await response.json();
    } catch (error) {
      console.error("Fehler beim Laden der Falldaten:", error);
    } finally {
      isLoading.value = false;
    }
  }

  // --- ÜBERARBEITETE getRandomCase FUNKTION ---
  async function getRandomCase(excludeNr = null) {
    await fetchCases();
    if (allCases.value.length === 0) return null;

    let availableCases = allCases.value;
    if (excludeNr) {
      availableCases = allCases.value.filter(c => c.nr !== excludeNr);
    }

    let randomCase;
    let attempts = 0; // Ein Zähler als Sicherheitsnetz gegen Endlosschleifen

    // Wähle so lange einen neuen Fall, bis er nicht in der "kürzlich gehört"-Liste ist.
    do {
      const randomIndex = Math.floor(Math.random() * availableCases.length);
      randomCase = availableCases[randomIndex];
      attempts++;
    } while (recentlySuggested.value.includes(randomCase.nr) && attempts < 20);

    // Füge die neue Fallnummer zur Liste hinzu.
    recentlySuggested.value.push(randomCase.nr);

    // Wenn die Liste länger als 15 ist, entferne das älteste (erste) Element.
    if (recentlySuggested.value.length > 15) {
      recentlySuggested.value.shift();
    }
    
    // console.log("Zuletzt vorgeschlagen:", recentlySuggested.value); // Zum Testen kannst du diese Zeile aktivieren

    return randomCase;
  }
  
  async function fetchFeaturedCases() {
    // ... (diese Funktion bleibt unverändert)
    await fetchCases();
    try {
      const [weekResponse, secretResponse] = await Promise.all([
        fetch('/api/fall-der-woche'),
        fetch('/api/geheimer-fall')
      ]);
      const weekData = await weekResponse.json();
      const secretData = await secretResponse.json();
      featuredCases.value.week = allCases.value.find(c => c.spotifyId === weekData.spotifyId);
      featuredCases.value.secret = allCases.value.find(c => c.spotifyId === secretData.spotifyId);
    } catch (error) {
      console.error("Fehler beim Laden der Featured Cases:", error);
    }
  }

  return {
    isLoading,
    featuredCases,
    recentlySuggested, // Optional, falls du es mal anzeigen willst
    getCaseByNr,
    getRandomCase,
    fetchFeaturedCases,
    fetchCases
  };
});