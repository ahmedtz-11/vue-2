<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '/home/ahmed/Documents/vue-projects/vue-2/src/stores/user.js';

const userStore = useUserStore();
const isAdmin = ref(false);

onMounted(() => {
  userStore.fetchLoggedInUser();
  if (userStore.username === 'admin') {
    isAdmin.value = true;
  }
});

const toggleDropdown = (event) => {
  const parent = event.target.closest('.has-dropdown');
  if (parent) {
    parent.classList.toggle('active');
  }
};
</script>

<template>
  <aside class="sidebar">
    <ul>
      <li><router-link to="/layout">Dashboard</router-link></li>
      <li><router-link to="/products">Products</router-link></li>
      <li><router-link to="/stocks">Stocks</router-link></li>
      <li><router-link to="/sales">Sales</router-link></li>
      <li v-if="isAdmin"><router-link to="/users">Users</router-link></li>
      
      <!-- Products Dropdown -->
      <!-- <li class="has-dropdown">
        <a @click="toggleDropdown">Products &nbsp;&nbsp;+</a>
        <ul class="dropdown">
          <li><router-link to="/add-product">Add Product</router-link></li>
          <li><router-link to="/products">View Products</router-link></li>
        </ul>
      </li> -->
    </ul>
    
    

    <div class="company-footer">
      <p>
        Powered by:
        <span><img src="/home/ahmed/Documents/vue-projects/vue-2/src/assets/rahisi.png" alt="Company Logo" /></span>
      </p>
      <p>&copy; 2022-2027 Rahisi Solutions</p>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 300px;
  background-color: #34495e;
  color: white;
  padding: 20px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 10px 0;
}

.sidebar li a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 1.2rem;
  display: block;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.sidebar li a:hover {
  background-color: #2c3e50;
}

.has-dropdown > a {
  cursor: pointer;
}

.has-dropdown .dropdown {
  display: none;
  list-style: none;
  padding: 0;
  margin-left: 10px;
}

.has-dropdown.active .dropdown {
  display: block;
}

.dropdown li {
  border-bottom: 1px solid #ecf0f1
}

.company-logo {
  text-align: center;
  margin: 20px 0;
}

.company-logo img {
  max-width: 100%;
  height: auto;
}

.company-footer {
  text-align: center;
  font-size: 0.9rem;
  color: #bdc3c7;
}
</style>
