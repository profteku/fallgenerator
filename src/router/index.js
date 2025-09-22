import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CaseView from '../views/CaseView.vue';
import TagView from '../views/TagView.vue';

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
  {
    path: '/tags', // z.B. /tag/gruselig
    name: 'TagView',
    component: TagView,
    props: true, // Übergibt 'tagName' als Prop an die Komponente
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;