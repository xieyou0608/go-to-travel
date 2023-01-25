import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Trip from "../components/Trip.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/trip/:tripId",
      component: Trip,
    },
  ],
});
