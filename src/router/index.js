import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Trip from "../views/Trip.vue";

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
