<script setup>
import Navbar from "./components/layout/Navbar.vue";
import Footer from "./components/layout/Footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between items-center">
    <Navbar />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<style scoped></style>
