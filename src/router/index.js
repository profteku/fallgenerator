import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CaseView from '../views/CaseView.vue';
import TagView from '../views/TagView.vue';
import UsersView from '../views/UsersView.vue';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';


const routes = [
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

  // --- ADMIN-BEREICH ---
  {
    // Die Seite, auf der man das Passwort eingibt.
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: DashboardView,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('isAdminAuthenticated') === 'true') {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/users', 
    name: 'Users',
    component: UsersView,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('isAdminAuthenticated') === 'true') {
        next();
      } else {
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