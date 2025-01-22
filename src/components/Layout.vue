<script setup>
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
</script>

<template>
  <div class="layout">
    <Navbar />
    <div class="d-flex">
      <Sidebar />
      <div class="content flex-grow-1 p-2">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout {
  height: 100vh;
}
.content {
  margin-left: 330px;
  margin-top: 60px; /* Navbar height */
  overflow-y: auto;
}
@media (max-width: 992px) {
  .content {
    margin-left: 0;
  }
}
</style>
