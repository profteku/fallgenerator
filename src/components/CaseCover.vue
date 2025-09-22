<script setup>
defineProps({
  coverUrl: String,
  altText: String,
});
</script>

<template>
  <div class="cover-container">
    <img :src="coverUrl" :alt="altText" class="cover-image"/>
  </div>
</template>

<style scoped>
.cover-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.cover-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}
</style>