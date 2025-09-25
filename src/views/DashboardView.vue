<template>
  <div class="admin-layout">
    <header>
      <h1>Overview</h1>
    </header>
    
    <main>
      <div v-if="!logStore.isLoading && !caseStore.isLoading && !logStore.error" class="overview-container">

        <div class="kpi-wrapper">
          <BaseCard title="Gesamte Logeinträge">
            <div class="stat-container">
              <span class="stat-number">{{ logStore.totalEvents }}</span>
            </div>
          </BaseCard>

          <router-link to="/users" style="text-decoration: none;">
            <BaseCard title="Individuelle Nutzer*innen">
              <div class="stat-container">
                <span class="stat-number">{{ logStore.uniqueUserCount }}</span>
              </div>          
            </BaseCard>
          </router-link>
        </div>

        <EventsOverTimeChart :chartData="logStore.eventsOverTime" />
        
        <MostPopularCase 
          :caseData="logStore.mostPopularCase" 
          :coverUrl="fullCaseData?.cover_url" 
        />

      </div>
      
      <div v-if="logStore.isLoading || caseStore.isLoading">Lade Daten...</div>
      <div v-if="logStore.error" class="error-state">{{ logStore.error }}</div>
      <div v-if="caseStore.error" class="error-state">{{ caseStore.error }}</div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'; // Stelle sicher, dass 'computed' importiert wird
import { useLogStore } from '@/stores/logStore';
import { useCaseStore } from '@/stores/caseStore';

// Komponenten
import BaseCard from '@/components/Dashboard/BaseCard.vue';
import MostPopularCase from '@/components/Dashboard/MostPopularCase.vue';
import EventsOverTimeChart from '@/components/Dashboard/EventsOverTimeChart.vue';

const logStore = useLogStore();
const caseStore = useCaseStore();

const mostPopularCaseFromLogs = computed(() => logStore.mostPopularCase);

const fullCaseData = computed(() => {
  const popularCase = mostPopularCaseFromLogs.value;
  if (popularCase && popularCase.case_nr) {
    return caseStore.getCaseByNr(popularCase.case_nr);
  }
  return null;
});
/* Beobachte die Werte und gib sie in der Konsole aus
watch(mostPopularCaseFromLogs, (newValue) => {
  console.log('1. Beliebtester Fall aus logStore:', newValue);
});

watch(fullCaseData, (newValue) => {
  console.log('2. Vollständige Falldaten aus caseStore (.value):', newValue);
});
*/
onMounted(() => {
  console.log('DashboardView wird geladen, starte Daten-Fetch...');
  if (logStore.logEntries.length === 0) logStore.fetchLogs();
  if (caseStore.allCases.length === 0) caseStore.fetchCases();
});
</script>

<style scoped>
/* Dein CSS bleibt unverändert */
.admin-layout {
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}
header {
  margin-bottom: 2rem;
}
.overview-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.kpi-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.stat-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}
.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
}
.error-state {
  color: red;
}
</style>