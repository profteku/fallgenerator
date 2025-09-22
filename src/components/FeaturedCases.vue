<script setup>
import { onMounted } from 'vue';
import { useCaseStore } from '@/stores/caseStore';

const caseStore = useCaseStore();

onMounted(() => {
  caseStore.fetchFeaturedCases();
});
</script>

<template>
  <div class="featured-container" v-if="caseStore.featuredCases.week && caseStore.featuredCases.secret">
    <router-link :to="`/fall/${caseStore.featuredCases.week.nr}`" class="case-card">
      <img :src="caseStore.featuredCases.week.cover_url" alt="Cover Fall der Woche" class="card-cover">
      <div class="card-label">
        <p>FALL DER WOCHE</p>
      </div>
    </router-link>

    <router-link :to="`/fall/${caseStore.featuredCases.secret.nr}`" class="case-card">
      <img :src="caseStore.featuredCases.secret.cover_url" alt="Cover Geheimer Fall" class="card-cover">
      <div class="card-label">
        <p>GEHEIMER FALL</p>
      </div>
    </router-link>
  </div>
  <div v-else>
    </div>
</template>

<style scoped>
.featured-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  margin-top: 1rem;
}
.case-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  text-decoration: none; /* Wichtig für router-link */
}
.case-card:hover {
  transform: scale(1.05);
}
.card-cover {
  width: 100%;
  display: block;
}
.case-number {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #1DB954;
  color: #fff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  border: 2px solid #121212;
}
.card-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0), transparent);
  color: rgba(255, 87, 51);
  text-align: center;
  padding: 0.5rem;
  font-weight: bold;
  font-size: 20px;
  height: 75px;
}
.card-label p {
  margin-top: 25px;
}
</style>