<script setup>
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
</script>

<template>
    <div class="layout">
      <Navbar />
      <div class="main-content">
        <Sidebar />
        <div class="content">
          <router-view />
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
  }
  .main-content {
    display: flex;
    flex: 1;
  }
  .content {
    flex: 1;
    padding: 15px;
    margin-left: 300px;
  }
  </style>
  