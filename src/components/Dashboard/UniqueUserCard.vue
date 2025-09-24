<template>
  <BaseCard title="Individuelle Nutzer*innen">
    <div class="stat-container">
      <span class="stat-number">{{ count }}</span>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue';
defineProps({
  count: { type: Number, required: true }
});
</script>

<style scoped>
.stat-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}
.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
}
</style>