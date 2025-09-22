import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CaseView from '../views/CaseView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    // Die ":nr" ist ein dynamischer Parameter für die Fall-Nummer
    path: '/fall/:nr',
    name: 'CaseDetails',
    component: CaseView,
    props: true, // Übergibt die Route-Parameter als Props an die Komponente
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;