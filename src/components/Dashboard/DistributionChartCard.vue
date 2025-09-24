<template>
  <BaseCard :title="title">
    <div class="chart-container">
      <Doughnut v-if="chartData.labels.length" :data="chartConfig" :options="chartOptions" />
      <p v-else>Keine Daten verfügbar.</p>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import BaseCard from '@/components/Dashboard/BaseCard.vue';

// Chart.js Komponenten registrieren
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const props = defineProps({
  title: { type: String, required: true },
  chartData: { type: Object, required: true }
});

// Bereitet die Konfiguration für das Chart vor
const chartConfig = computed(() => ({
  labels: props.chartData.labels,
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#FFA500'], // Beispiel-Farben
      data: props.chartData.data
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
};
</script>

<style scoped>
.chart-container {
  height: 300px; /* Feste Höhe für einheitliches Aussehen */
}
</style>