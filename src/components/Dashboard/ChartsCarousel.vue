<template>
  <div class="carousel-container">
    <Carousel :items-to-show="1.1" :wrap-around="true">
      <Slide v-for="(chart, index) in charts" :key="index">
        <div class="carousel-slide">
          <DistributionChartCard :title="chart.title" :chartData="chart.data" />
        </div>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<script setup>
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import DistributionChartCard from './DistributionChartCard.vue';

defineProps({
  charts: { type: Array, required: true }
});
</script>

<style scoped>
.carousel-container {
  padding: 0 1rem;
}
.carousel-slide {
  width: 100%;
  padding: 0 10px;
}
</style>