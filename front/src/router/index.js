// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import authMiddleware from "../middleware/auth"; 
import Login from "../views/LoginView.vue";
import Dashboard from "../views/DashboardView.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard,
    beforeEnter: authMiddleware, // Se Aplica el middleware
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;