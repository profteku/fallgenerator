<template>
  <BaseCard title="Aufrufe über Zeit">
    <Line v-if="chartData.labels.length" :data="chartConfig" :options="chartOptions" />
    <p v-else>Nicht genügend Daten für eine grafische Darstellung.</p>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import BaseCard from '@/components/Dashboard/BaseCard.vue';

// Chart.js Komponenten registrieren, die wir verwenden wollen
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

// Die Komponente erwartet die vorbereiteten Daten als Prop
const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  }
});

const chartConfig = computed(() => ({
  labels: props.chartData.labels,
  datasets: [
    {
      label: 'Seitenaufrufe',
      backgroundColor: '#42b983',
      borderColor: '#42b983',
      data: props.chartData.data,
      tension: 0.1 // Macht die Linie leicht kurvig
    }
  ]
}));

// Konfigurations-Optionen für den Graphen
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { 
      ticks: {
        // Diese Option sorgt dafür, dass nur ganze Zahlen auf der Achse angezeigt werden.
        precision: 0 
      },
      beginAtZero: true // Stellt sicher, dass die Achse bei 0 beginnt
    }
  }
};
</script>