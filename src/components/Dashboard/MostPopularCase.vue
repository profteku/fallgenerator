<template>
  <BaseCard title="Beliebtester Fall">
    <div v-if="caseData && caseData.case_nr" class="popular-case-content">
        <router-link :to="`/fall/${caseData.case_nr}`">
            <span class="case-name">{{ caseData.name }}</span>
            <span class="case-number">Fall #{{ caseData.case_nr }}</span>
            <span class="case-count">{{ caseData.count }} Klicks</span>
        </router-link>
      
    </div>
    <div v-else>
      <p>Keine Daten vorhanden.</p>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/Dashboard/BaseCard.vue';

// Definiere, dass die Komponente ein 'caseData'-Objekt als Prop erwartet.
defineProps({
  caseData: {
    type: Object,
    required: true,
  }
});
</script>

<style scoped>
.popular-case-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 80px;
  text-decoration: none;
}
.case-number {
  font-size: 2rem;
  font-weight: bold;
}
.case-count {
  font-size: 1rem;
  color: #aaa;
}
</style>