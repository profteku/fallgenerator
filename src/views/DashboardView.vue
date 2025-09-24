<template>
  <div class="admin-layout">
    <header>
      <h1>Dashboard</h1>
    </header>
    
    <main>
      <div v-if="logStore.isLoading" class="loading-state">
        <p>Lade Log-Daten... 🔄</p>
      </div>
      
      <div v-if="logStore.error" class="error-state">
        <p>Fehler: {{ logStore.error }}</p>
      </div>

      <div v-if="!logStore.isLoading && !logStore.error" class="dashboard-grid">
        <BaseCard title="Gesamte Logeinträge">
          <span class="stat-number">{{ logStore.totalEvents }}</span>
        </BaseCard>
        <MostPopularCase :caseData="logStore.mostPopularCase" />

        <UniqueUserCard :count="logStore.uniqueUserCount" />

        </div>
        <EventsOverTimeChart :chartData="logStore.eventsOverTime" />
      
      <LogViewer 
        v-if="!logStore.isLoading && !logStore.error" 
        :logs="logStore.logEntries" 
      />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useLogStore } from '@/stores/logStore';

//Komponents
import LogViewer from '@/components/Dashboard/LogViewer.vue';
import BaseCard from '@/components/Dashboard/BaseCard.vue';
import MostPopularCase from '@/components/Dashboard/MostPopularCase.vue';
import UniqueUserCard from '@/components/Dashboard/UniqueUserCard.vue';
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
  /* margin-top: -60px; wurde entfernt, da es oft zu Layout-Problemen führt */
}
.dashboard-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
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
</style>