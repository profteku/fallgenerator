<script setup>
defineProps({
  fall: {
    type: Object,
    required: true,
  },
  // Ein optionales Label, das wir für die Startseite brauchen
  label: String,
});
</script>

<template>
  <router-link :to="`/fall/${fall.nr}`" class="case-card">
    <img :src="fall.cover_url" :alt="'Cover von ' + fall.name" class="card-cover">
    
    <div class="overlay"></div>

    <div class="card-content">
      <h3 class="card-title">{{ fall.name }}</h3>
    </div>
    
    <div v-if="label" class="card-label">{{ label }}</div>
  </router-link>
</template>

<style scoped>
.case-card {
  position: relative; /* Wichtig für die Positionierung der Overlays */
  display: block;
  text-decoration: none;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
  transition: transform 0.2s ease-in-out;
  aspect-ratio: 1 / 1; /* Sorgt dafür, dass die Karte immer quadratisch ist */
}

.case-card:hover {
  transform: scale(1.05);
}

.card-cover {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Stellt sicher, dass das Bild die Karte ausfüllt */
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  z-index: 1;
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  z-index: 2;
}

.card-title {
  color: rgba(255, 87, 51);
  font-weight: bold;
  margin: 0;
  font-size: 1rem;
}

.card-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--secondary-color);
  color: white;
  text-align: center;
  padding: 0.5rem;
  font-weight: bold;
  z-index: 3; /* Liegt über dem Titel, wenn beides da ist */
}
</style>