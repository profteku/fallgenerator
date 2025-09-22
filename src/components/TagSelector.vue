<script setup>
defineProps({
  allTags: Array,
  activeTags: Array,
});

const emit = defineEmits(['toggle-tag']);

// Die Logik für Farben und Großbuchstaben, genau wie in CaseDetailsInfo
const tagColors = { gruselig: '#2E5EAA', hitchcock: 'black', skinny: '#4281A4', raetsel: '#69140E', morton: '#B2AA8E', kunst: '#D5A021', tiere: '#6B654B', sekte: '#B26E63', sport: '#F5A623', unterwegs: '#4D8B31', spezial: '#FF4A1C', girlfriends: '#EE4266', schatz: '#101107' };
const getTagColor = (tagName) => tagColors[tagName] || '#B3B3B3';
const capitalizeFirstLetter = (string) => string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
</script>

<template>
  <div class="tag-selector-card">
    <p>Filtere nach Tags:</p>
    <div class="tags">
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag"
        :class="{ active: activeTags.includes(tag) }"
        :style="{ '--tag-color': getTagColor(tag) }"
        @click="emit('toggle-tag', tag)"
      >
        {{ capitalizeFirstLetter(tag) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.tag-selector-card {
  background-color: #021728;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
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
  content: ''; display: block; width: 8px; height: 8px; border-radius: 50%;
  background-color: var(--tag-color); position: absolute; left: 0.7rem; top: 50%;
  transform: translateY(-50%);
}
.tag.active {
  background-color: white;
  color: black;
}
</style>