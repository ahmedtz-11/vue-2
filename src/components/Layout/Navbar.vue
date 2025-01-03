<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  localStorage.removeItem('auth');
  router.push('/');
};
</script>

<template>
  <nav class="navbar">
    <h1>Dukani</h1>
    <div class="dropdown">
      <button class="dropdown-toggle">
        <!-- src="https://via.placeholder.com/40" -->
        <img
          src="/home/ahmed/Documents/vue-projects/vue-2/src/assets/icon2.jpg"
          alt="User Icon"
          class="user-icon"
        />
        <span class="user-name">User</span>
      </button>
      <div class="dropdown-menu">
        <a href="#">Profile</a>
        <a href="#">Settings</a>
        <a href="#" @click="logout">Logout</a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50; /* Matches sidebar */
  color: white;
  padding: 10px 20px;
  width: calc(100% - 300px); /* Accounts for sidebar width */
  margin-left: 300px; /* Adjust for sidebar positioning */
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  background-color: transparent;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  border: 2px solid white;
}

.user-name {
  font-size: 1rem;
  margin-right: 5px;
}

.dropdown-menu {
  display: none;
  position: absolute;
  right: 0;
  background-color: #1f2f3d;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  min-width: 150px;
  z-index: 1000;
}

.dropdown-menu a {
  color: white;
  padding: 10px 15px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s ease;
}

.dropdown-menu a:hover {
  background-color: #1abc9c;
}

.dropdown:hover .dropdown-menu {
  display: block;
}
</style>
