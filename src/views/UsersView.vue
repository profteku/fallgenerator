<template>
  <div class="users-layout">
    <header>
      <h1>Nutzer-Analyse</h1>
    </header>

    <main v-if="!logStore.isLoading && !logStore.error">
        <div class="users-container">
            <EventsOverTimeChart 
            title="Individuelle Nutzer*innen pro Tag"
            :chartData="logStore.uniqueUsersOverTime" 
            />
        </div>
        <div class="users-container">
            <TabbedCharts 
                :deviceData="logStore.deviceTypeDistribution"
                :osData="logStore.osDistribution"
                :browserData="logStore.browserDistribution"
            />
        </div>
        <div class="users-container">
            <UserStatsTable :users="logStore.detailedUserStats" />
        </div>
    </main>
    
    <div v-else>Lade Daten...</div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useLogStore } from '@/stores/logStore';

// Alle benötigten Komponenten importieren
import EventsOverTimeChart from '@/components/Dashboard/EventsOverTimeChart.vue';
import ChartsCarousel from '@/components/Dashboard/ChartsCarousel.vue';
import UserStatsTable from '@/components/Dashboard/UserStatsTable.vue';
import TabbedCharts from '@/components/Dashboard/TabbedCharts.vue';

const logStore = useLogStore();

// Bereite die Daten für die Karussell-Komponente vor
const chartsForCarousel = computed(() => [
  { title: 'Gerätetypen', data: logStore.deviceTypeDistribution },
  { title: 'Betriebssysteme', data: logStore.osDistribution },
  { title: 'Browser', data: logStore.browserDistribution },
]);

onMounted(() => {
  if (logStore.logEntries.length === 0) {
    logStore.fetchLogs();
  }
});
</script>

<style scoped>
.users-layout {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  row-gap: 2em;
}
.users-container {
    margin-bottom: 2em;
}
</style>