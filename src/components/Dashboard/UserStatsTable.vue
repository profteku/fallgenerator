<template>
  <BaseCard title="Nutzer-Aktivitäten">
    <div class="user-list">
      <div v-for="user in users" :key="user.hashed_ip" class="user-row">
        <div class="user-info">
          <span class="user-ip">Nutzer: ...{{ user.hashed_ip.slice(-8) }}</span>
          <span class="user-case">Lieblingsfall: {{ user.favoriteCase.name }} ({{ user.favoriteCase.count }}x)</span>
        </div>
        <div class="user-last-access">
          <span>Letzter Zugriff:</span>
          <span>{{ new Date(user.lastAccess).toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/Dashboard/BaseCard.vue';
defineProps({
  users: { type: Array, required: true }
});
</script>

<style scoped>
.user-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #444;
}
.user-info, .user-last-access {
  display: flex;
  flex-direction: column;
}
.user-ip {
  font-weight: bold;
}
.user-case {
  font-size: 0.9em;
  color: #ccc;
}
.user-last-access {
  text-align: right;
  font-size: 0.8em;
  color: #aaa;
}
</style>