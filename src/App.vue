<template>
  <div id="app-container">
    <header>
      <h1>Fallgenerator</h1>
    </header>
    <main>
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
      </main>
  </div>
</template>

<style scoped>
#app-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

header h1 {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #E0E0E0;
}
</style>