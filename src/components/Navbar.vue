<script setup>
const toggleSidebar = () => {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('d-none');
};
</script>

<template>
  <nav class="navbar navbar-dark bg-secondary d-flex align-items-center">
    <div class="container-fluid">
      <button class="btn btn-light" type="button" @click="toggleSidebar">
        <i class="bi bi-list"></i>
      </button>
      <a class="navbar-brand mt-1 h1">
        Dukani
      </a>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  width: 100%;
  z-index: 1000;
  top: 0;
}
</style>
