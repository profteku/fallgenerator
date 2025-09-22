import { createApp } from 'vue'
import { createPinia } from 'pinia' // Pinia importieren
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia() // Pinia-Instanz erstellen

app.use(pinia) // Pinia verwenden
app.use(router)

app.mount('#app')