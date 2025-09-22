<script setup>
defineProps({
  name: String,
  releaseDate: String,
  tags: Array,
});

// Farb-Mapping für die Tags
const tagColors = {
  gruselig: '#2E5EAA', // Blau
  hitchcock: '#000000', // Schwarz
  skinny: '#4281A4', // Hellblau
  rätsel: '#69140E', // Dunkelrot
  morton: '#B2AA8E', // Grau
  kunst: '#D5A021', // Gelb
  tiere: '#6B654B', // Dunkelgrau
  sekte: '#B26E63', // Orange
  sport: '#F5A623', // Orange
  unterwegs: '#4D8B31', // Mintgrün
  spezial: '#FF4A1C', //Orange
  girlfriends: '#EE4266', // Rot
  schatz: '#101107', // Schwarz

};

// Funktion, die die Farbe zurückgibt oder eine Standardfarbe
const getTagColor = (tagName) => {
  return tagColors[tagName] || '#B3B3B3'; // Standard-Grau
};

const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear();
};
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};
</script>

<template>
  <h2>{{ name }}</h2>
  <p class="meta-info">erschienen {{ getYear(releaseDate) }} | 44Min</p>
  <div class="tags">
  <router-link v-for="tag in tags" 
        :key="tag" 
        :to="{ name: 'TagView', query: { filter: tag } }"  
        class="tag" 
        :style="{ '--tag-color': getTagColor(tag) }">
    {{ capitalizeFirstLetter(tag) }}
  </router-link>
</div>
</template>

<style scoped>
h2 {
  font-size: 1.8rem;
  margin: 0;
  text-align: left;
  font-weight: bold;
}

.meta-info {
  text-align: left;
  color: #B3B3B3;
  margin: 0;
  margin-top: -10px;
  margin-bottom: 10px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.5rem;
  text-transform: capitalize;
  font-family: CanvaSans;
  font-weight: bold;
}

.tag {
  position: relative;
  background-color: transparent;
  color: #E0E0E0;
  padding: 0.4rem 0.8rem 0.4rem 1.5rem; /* Platz links für den Punkt */
  border-radius: 10px;
  font-size: 0.8rem;
  border: 1px solid white;
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
}
.tag:hover {
  background-color: #dcdde1;
  color: #2f3640;
  cursor: pointer;
}


.tag::before {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--tag-color);
  position: absolute;
  left: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
}
</style>