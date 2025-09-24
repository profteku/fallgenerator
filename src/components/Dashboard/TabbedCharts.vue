<template>
  <BaseCard>
    <div class="tabs-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.key" 
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.title }}
      </button>
    </div>

    <div class="tab-content">
      <DistributionChartCard 
        :title="currentChart.title"
        :chartData="currentChart.data"
        :key="activeTab" 
      />
    </div>
  </BaseCard>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseCard from '@/components/Dashboard/BaseCard.vue';
import DistributionChartCard from './DistributionChartCard.vue';

// Definiere die Props, die die Daten für alle drei Diagramme erhalten
const props = defineProps({
  deviceData: { type: Object, required: true },
  osData: { type: Object, required: true },
  browserData: { type: Object, required: true },
});

// Zustand für den aktiven Tab, startet mit 'device'
const activeTab = ref('device');

// Definition der verfügbaren Tabs
const tabs = [
  { key: 'device', title: 'Gerätetypen' },
  { key: 'os', title: 'Betriebssysteme' },
  { key: 'browser', title: 'Browser' },
];

// Computed Property, die je nach aktivem Tab das richtige Datenset zurückgibt
const currentChart = computed(() => {
  switch (activeTab.value) {
    case 'os':
      return { title: 'Betriebssysteme', data: props.osData };
    case 'browser':
      return { title: 'Browser', data: props.browserData };
    case 'device':
    default:
      return { title: 'Gerätetypen', data: props.deviceData };
  }
});
</script>

<style scoped>
.tabs-nav {
  display: flex;
  border-bottom: 1px solid #444;
  margin-bottom: 1.5rem;
}
.tabs-nav button {
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  color: #aaa;
  cursor: pointer;
  font-size: 1rem;
  position: relative;
  top: 1px; /* Hebt den aktiven Button auf die Border-Linie */
}
.tabs-nav button.active {
  color: white;
  font-weight: bold;
  border-bottom: 2px solid #42b983; /* Grüne Linie für aktiven Tab */
}
.tab-content {
  /* Sorgt dafür, dass die Höhe stabil bleibt, wenn zwischen den Tabs gewechselt wird */
  min-height: 320px;
}
</style>