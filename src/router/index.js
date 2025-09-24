import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CaseView from '../views/CaseView.vue';
import TagView from '../views/TagView.vue';

// NEU: Importiere die Login- und Dashboard-Ansichten.
// Du musst diese beiden .vue Dateien noch in deinem src/views Ordner erstellen.
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';


const routes = [
  // --- Deine bestehenden Routen ---
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/fall/:nr',
    name: 'CaseDetails',
    component: CaseView,
    props: true,
  },
  {
    path: '/tags',
    name: 'TagView',
    component: TagView,
    props: true,
  },

  // --- NEUE ROUTEN FÜR DEN ADMIN-BEREICH ---
  {
    // Die Seite, auf der man das Passwort eingibt.
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    // Die geschützte Route, die dein Dashboard anzeigt.
    path: '/admin',
    name: 'Dashboard',
    component: DashboardView,
    // Dieser "Navigation Guard" schützt die Route.
    beforeEnter: (to, from, next) => {
      // Er prüft, ob im Browser-Speicher der Login-Status vermerkt ist.
      if (localStorage.getItem('isAdminAuthenticated') === 'true') {
        // Wenn ja, erlaube den Zugriff auf /admin.
        next();
      } else {
        // Wenn nein, leite den Benutzer zur Login-Seite um.
        next('/login');
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;