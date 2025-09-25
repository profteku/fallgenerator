<template>
  <div id="app-container">
    <header>
      <router-link :to="`/`" style="text-decoration: none;">
        <h1>Fallgenerator</h1>
      </router-link>
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
  padding: 0rem 1.5rem;
}

header h1 {
  font-size: 2rem;
  font-weight: bold;
  text-align: left;
  margin-bottom: 1rem;
  color: #E0E0E0;
}
</style>