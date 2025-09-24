<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCaseStore } from '@/stores/caseStore.js';

import CaseCover from '@/components/CaseCover.vue';
import CaseDetailsInfo from '@/components/CaseDetailsInfo.vue';
import CaseActions from '@/components/CaseActions.vue';
import CaseInfo from '@/components/CaseInfo.vue';
import CaseSpeakers from '@/components/CaseSpeakers.vue';

const props = defineProps({
  nr: { type: String, required: true },
});

const router = useRouter();
const caseStore = useCaseStore();

// Die computed-Property liest jetzt nur noch die Daten, ohne etwas auszulösen.
const currentCase = computed(() => {
  return caseStore.getCaseByNr(props.nr);
});

const suggestAnotherCase = async () => {
  const randomCase = await caseStore.getRandomCase(currentCase.value.nr);
  if (randomCase && randomCase.nr) {
    router.push({ name: 'CaseDetails', params: { nr: randomCase.nr } });
  }
};

// Hier laden wir die Daten, wenn die Komponente zum ersten Mal geladen wird.
onMounted(() => {
  caseStore.fetchCases();
});
</script>


<template>
  <div v-if="caseStore.isLoading" class="loading">Lade Fall...</div>
  
  <div v-else-if="currentCase" class="case-view">
    
    <CaseCover :cover-url="currentCase.cover_url" :alt-text="'Cover von ' + currentCase.name" />

    <div class="details-card">
      <CaseDetailsInfo 
        :name="currentCase.name" 
        :release-date="currentCase.release_date" 
        :tags="currentCase.tags" 
      />
    </div> 
      <CaseActions 
        :spotify-id="currentCase.spotifyId"
        :casenr="props.nr"
        :name="currentCase.name"
        @suggest-another-case="suggestAnotherCase" 
      />
      
      <CaseInfo :description="currentCase.description" />
      
      <CaseSpeakers :sprechrollen="currentCase.sprechrollen" />
    

  </div>

  <div v-else class="not-found">Fall nicht gefunden.</div>
</template>

<style scoped>
/* Die meisten Stile sind jetzt in den Kinder-Komponenten. Hier bleibt nur das Layout. */
.case-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.details-card {
  background-color: #021728;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>