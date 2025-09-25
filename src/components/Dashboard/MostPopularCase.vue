<template>
  <BaseCard title="Beliebtester Fall">
    <router-link
      v-if="caseData && caseData.case_nr"
      :to="`/fall/${caseData.case_nr}`"
      class="popular-case-link"
    >
      <img v-if="coverUrl" :src="coverUrl" alt="Cover" class="case-cover" />
      <div v-else class="case-cover-placeholder"></div>

      <div class="case-info">
        <span class="case-name">{{ caseData.name }}</span>
        <div class="case-details">
          <span>Fall {{ caseData.case_nr }}</span>
          <span class="separator">|</span>
          <span>{{ caseData.count }} Klicks</span>
        </div>
      </div>
    </router-link>
    <div v-else class="no-data">
      <p>Keine Daten vorhanden.</p>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue';

// Diese Komponente akzeptiert 'caseData' und 'coverUrl' und hat keine eigene Logik.
defineProps({
  caseData: {
    type: Object,
    required: true,
  },
  coverUrl: {
    type: String,
    default: '',
  }
});
</script>

<style scoped>
.popular-case-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
.popular-case-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
.case-cover, .case-cover-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.case-cover-placeholder {
  background-color: #30364c;
}
.case-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.case-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
}
.case-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #aaa;
}
.separator {
  color: #555;
}
.no-data {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>