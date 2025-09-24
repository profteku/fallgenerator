<template>
  <div class="admin-layout">
    <header>
      <h1>Overview</h1>
    </header>
    
    <main>
      <div v-if="!logStore.isLoading && !logStore.error">
        <div class="dashboard-grid kpi-grid">
          <BaseCard title="Gesamte Logeinträge">
            <div class="stat-container">
              <span class="stat-number">{{ logStore.totalEvents }}</span>
            </div>
          </BaseCard>
          <router-link :to="`/users/`">
            <BaseCard title="Individuelle Nutzer*innen">
              <div class="stat-container">
                <span class="stat-number">{{ logStore.uniqueUserCount }}</span>
              </div>          
            </BaseCard>
          </router-link>
        </div>
        <div class="events-container">
          <EventsOverTimeChart :chartData="logStore.eventsOverTime" />
        </div>
        <div class="popular-container">
          <MostPopularCase :caseData="logStore.mostPopularCase" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useLogStore } from '@/stores/logStore';

//Komponents
import BaseCard from '@/components/Dashboard/BaseCard.vue';
import MostPopularCase from '@/components/Dashboard/MostPopularCase.vue';
import EventsOverTimeChart from '@/components/Dashboard/EventsOverTimeChart.vue';

// 1. Den Pinia-Store initialisieren
const logStore = useLogStore();

// 2. Die Lade-Aktion auslösen, sobald die Komponente "eingehängt" wird
onMounted(() => {
  // Wir laden die Logs nur, wenn sie noch nicht geladen wurden,
  // um unnötige Anfragen zu vermeiden.
  if (logStore.logEntries.length === 0) {
    logStore.fetchLogs();
  }
});
</script>

<style scoped>
.admin-layout {
  padding: 2rem;
}
header {
  margin-bottom: 2rem;
  margin-top: -60px; 
}
.dashboard-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
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
  color: #42b983; /* Ein Beispiel-Grün */
}
.loading-state, .error-state {
  padding: 2rem;
  text-align: center;
  background-color: #2a2f45; /* Passend zu deinen Karten */
  border-radius: 12px;
  color: white;
}
.error-state {
  background-color: #5e3333;
}
.overview-wrapper {
  width: 100%;
 display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 1em; 
}
.kpi-grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
grid-template-rows: 1fr;
grid-column-gap: 1.5em;

}
.distribution-grid {
  /* Auf größeren Bildschirmen 3 Spalten, sonst eine */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
.events-container {
  margin-bottom: 2em;
}
.popular-container {
  margin-bottom: 2em;
}
</style>