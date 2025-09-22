<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCaseStore } from '@/stores/caseStore';
import TagSelector from '@/components/TagSelector.vue';
import CaseCard from '@/components/CaseCard.vue';

const store = useCaseStore();
const router = useRouter();
const route = useRoute();

const activeTags = ref([]);

// Filtert die Fälle: Ein Fall muss ALLE aktiven Tags besitzen
const filteredCases = computed(() => {
  if (activeTags.value.length === 0) {
    return store.allCases; // Wenn kein Filter, zeige alle
  }
  return store.allCases.filter(c => {
    return activeTags.value.every(tag => c.tags && c.tags.includes(tag));
  });
});

// Funktion zum Umschalten eines Tags
const toggleTag = (tagName) => {
  const index = activeTags.value.indexOf(tagName);
  if (index === -1) {
    activeTags.value.push(tagName);
  } else {
    activeTags.value.splice(index, 1);
  }
};

// Beobachtet die aktiven Tags und aktualisiert die URL
watch(activeTags, (newTags) => {
  router.push({ query: { filter: newTags.join(',') || undefined } });
}, { deep: true });

// Beim Laden der Seite: Setzt die aktiven Tags basierend auf der URL
onMounted(() => {
  store.fetchCases(); // Wichtig: Falldaten laden
  const initialTags = route.query.filter;
  if (initialTags && typeof initialTags === 'string') {
    activeTags.value = initialTags.split(',');
  }
});
</script>

<template>
  <div class="tag-view">
    <TagSelector 
      :all-tags="store.uniqueTags" 
      :active-tags="activeTags" 
      @toggle-tag="toggleTag"
    />

    <h2 class="results-headline">{{ filteredCases.length }} Fälle gefunden</h2>
    <div class="cases-grid">
      <CaseCard v-for="fall in filteredCases" :key="fall.nr" :fall="fall" />
    </div>
  </div>
</template>

<style scoped>
.results-headline {
  margin-bottom: 2rem;
  text-align: center;
}
.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}
</style>