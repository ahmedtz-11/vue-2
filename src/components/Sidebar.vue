<script setup>
import { ref, onMounted } from 'vue';

const isAdmin = ref(false); // To store if the logged-in user is an admin

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user && user.username === 'admin') {
    isAdmin.value = true; // Set isAdmin to true if the user is an admin
  }
});
</script>

<template>
  <aside class="sidebar">
    <ul>
      <li><router-link to="/layout">Dashboard</router-link></li>
      <li><router-link to="/products">Products</router-link></li>
      <li><router-link to="/stocks">Stock</router-link></li>
      <li><router-link to="/sales">Sales</router-link></li>
      <li v-if="isAdmin"><router-link to="/users">Users</router-link></li>
    </ul>
    
    <div class="company-footer">
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

.company-name {
  text-align: center;
  margin-bottom: 20px;
}

.company-name h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #ecf0f1;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 10px 0;
}

.sidebar li i {
  margin-right: 10px;
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

.company-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: #bdc3c7; 
}
</style>
