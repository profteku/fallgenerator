<script setup>
defineProps({
  spotifyId: String,
});

const emit = defineEmits(['suggest-another-case']);
</script>

<template>
  <div class="actions">
    <a :href="'https://open.spotify.com/episode/' + spotifyId" target="_blank" class="action-button spotify">
      SPOTIFY
    </a>
    <button @click="console.log('Nochmal Button in CaseActions geklickt!'); emit('suggest-another-case')" class="action-button nochmal">
      NOCHMAL
    </button>
  </div>
</template>


<style scoped>
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.action-button {
  display: flex;
  justify-content: center; /* Zentriert horizontal */
  align-items: center;   /* Zentriert vertikal */
  padding: 1.5rem 2rem;
  font-size: 1.4rem;
  text-align: center; /* Zusätzliche Sicherheit für a-Tags */
  font-weight: bold;
  color: #E0E0E0;
  background-color: transparent;
  border: 3px solid;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
}

.action-button.spotify { border-color: #1DB954; }
.action-button.spotify:hover { background-color: #1DB954; color: #121212; }
.action-button.nochmal { border-color: #FF5733; }
.action-button.nochmal:hover { background-color: #FF5733; color: #121212; }
</style>