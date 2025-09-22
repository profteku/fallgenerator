<script setup>
import { useRouter } from 'vue-router';
import { useCaseStore } from '@/stores/caseStore';
import cassetteUrl from '@/assets/images/Kassette_rotate.svg';
import FeaturedCases from '@/components/FeaturedCases.vue';

const router = useRouter();
const caseStore = useCaseStore();

// Die onMounted-Sektion kann hier entfernt werden, da die FeaturedCases-Komponente
// ihre Daten selbst lädt und der Button das Laden bei Bedarf auslöst.

// Die Funktion wird zu 'async', damit wir 'await' verwenden können.
const suggestCase = async () => {
  // Wir warten hier, bis die Funktion aus dem Store einen Fall zurückgibt.
  const randomCase = await caseStore.getRandomCase();
  
  if (randomCase && randomCase.nr) {
    router.push({ name: 'CaseDetails', params: { nr: randomCase.nr } });
  } else {
    // Dieser Fehler sollte nur noch auftreten, wenn die ddf.json nicht geladen werden kann.
    console.error("Konnte keinen zufälligen Fall finden.");
  }
};
</script>

<template>
  <div class="home-view">
    <img :src="cassetteUrl" alt="Kassette" class="cassette-tape" />
    <div class="intro-text">
      <h2>WELCHEN <span class="highlight">FALL</span> WILLST DU HEUTE HÖREN?</h2>
    </div>
    <button @click="suggestCase" class="suggest-button" :disabled="caseStore.isLoading">
      {{ caseStore.isLoading ? 'Lade Fälle...' : 'Schlag was vor' }}
    </button>
    <FeaturedCases />
  </div>
</template>

<style scoped>
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.cassette-tape {
  max-width: 350px;
  width: 100%;
  align-self: flex-end;
  margin-bottom: -35px;
  margin-top: -30px;
}

.intro-text {
  align-self: flex-start;
  text-align: left;
  margin-top: -4rem;
  position: relative;
  z-index: 10;
}

.intro-text h2 {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.2;
  color: #fff;
  /* font-family: CanvaSans; */ /* Ggf. Schriftart global definieren */
}

.intro-text .highlight {
  color: var(--secondary-color);
}

.suggest-button {
  align-self: flex-start;
  justify-content: center; /* Zentriert horizontal */
  align-items: center;
  padding: 1.5rem 2.5rem;
  font-size: 1.4rem;
  font-weight: bold;
  color: #E0E0E0;
  background-color: transparent;
  border: 3px solid var(--secondary-color);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: -1rem;
  text-decoration: none;

  /* NEU: Zentriert den Text im Button perfekt */
  display: flex;
  align-items: center;
  justify-content: center;
}

.suggest-button:hover:not(:disabled) {
  background-color: var(--secondary-color);
  color: #121212;
}

.suggest-button:disabled {
  border-color: #555;
  color: #555;
  cursor: not-allowed;
}
</style>