<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';

// Sidebar open by default on lg and above
const isSidebarOpen = ref(window.innerWidth >= 992);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Ensure the sidebar opens automatically on larger screens
const updateSidebarVisibility = () => {
  isSidebarOpen.value = window.innerWidth >= 992;
};

onMounted(() => {
  updateSidebarVisibility();
  window.addEventListener('resize', updateSidebarVisibility);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSidebarVisibility);
});
</script>

<template>
  <div class="layout">
    <Navbar :onToggleSidebar="toggleSidebar" />
    <div class="d-flex">
      <Sidebar :isSidebarOpen="isSidebarOpen" :onCloseSidebar="toggleSidebar" />
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
  margin-left: 300px;
  margin-top: 60px; /* Navbar height */
  overflow-y: auto;
  transition: margin-left 0.3s ease-in-out;
}
@media (max-width: 992px) {
  .content {
    margin-left: 0;
  }
}
</style>




