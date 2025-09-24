<template>
  <div class="card">
    <h3 class="card-title" v-if="title">{{ title }}</h3>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>

<style scoped>
.card {
  background-color: #021728;
  border-radius: 12px;
  padding: 1rem;
  color: white;
  align-items: center;
  text-align: center
}
.card-title {
  font-family: CanvaSans;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
}
</style>