<script setup>
import { ref } from 'vue';

defineProps({
  sprechrollen: Array,
});

const isOpen = ref(false);
</script>

<template>
  <div class="accordion">
    <div class="accordion-item" @click="isOpen = !isOpen">
      <span>Sprecher*innen</span>
      <span class="arrow" :class="{ 'down': isOpen }">▼</span>
    </div>
    <div v-if="isOpen" class="accordion-content">
      <ul>
        <li v-for="role in sprechrollen" :key="role.sprecher">
          <strong>{{ role.rolle }}:</strong> {{ role.sprecher }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Stile für alle Accordions */
.accordion-item { 
    background-color: #021728;
    color: #ef4a37;
    font-family: CanvaSans;
    font-weight: bold; 
    padding: 0.8rem 1rem; 
    border-radius: 8px; 
    cursor: pointer; 
    display: flex; 
    justify-content: 
    space-between; 
    align-items: center; }
.arrow { transition: transform 0.3s ease; color: white;}
.arrow.down { transform: rotate(180deg); }
.accordion-content { padding: 1rem; background-color: #021728; font-family: CanvaSans; border-radius: 0 0 8px 8px; border-top: 1px solid #444; }
.accordion-content ul { list-style-type: none; padding: 0; margin: 0; }
.accordion-content li { padding: 0.2rem 0; }
</style>