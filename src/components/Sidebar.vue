<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const isSidebarOpen = ref(true); // Sidebar should be open by default on large screens
const activeDropdown = ref(null);
const router = useRouter();
const isAdmin = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleDropdown = (dropdown) => {
  activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
};

const logout = () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('user');
  router.push('/');
};

onMounted(() => {
  userStore.fetchLoggedInUser();
  if (userStore.username === 'admin') {
    isAdmin.value = true;
  }
});

</script>

<template>
  <aside
    class="sidebar d-flex flex-column bg-dark text-white vh-100 fs-5 p-2"
    :class="{ 'd-none d-lg-flex': !isSidebarOpen }"
  >
    <ul class="nav flex-column mt-3">
      <li class="nav-item">
        <router-link class="nav-link text-white" to="/layout">
          <i class="bi bi-house-door me-2"></i> Dashboard
        </router-link>
      </li>
      <!-- Products Dropdowns -->
      <li class="nav-item">
        <a
          class="nav-link text-white d-flex justify-content-between"
          href="#"
          @click.prevent="toggleDropdown('products')"
        >
          <span>
            <i class="bi bi-boxes me-2"></i> Products
          </span>
          <i
            class="bi"
            :class="activeDropdown === 'products' ? 'bi-chevron-up' : 'bi-chevron-down'"
          ></i>
        </a>
        <ul v-if="activeDropdown === 'products'" class="nav flex-column ms-3 bg-secondary">
          <li>
            <router-link class="nav-link text-white" to="/products">
              <i class="bi bi-eye me-2"></i> All Products
            </router-link>
          </li>
          <li>
            <router-link class="nav-link text-white" to="/available-products">
              <i class="bi bi-check2-circle me-2"></i> Available Products
            </router-link>
          </li>
          <li>
            <router-link class="nav-link text-white" to="/unavailable-products">
              <i class="bi bi-x-circle me-2"></i> Unavailable Products
            </router-link>
          </li>
        </ul>
      </li>

      <!-- Stocks Dropdowns -->
      <li class="nav-item">
        <a
          class="nav-link text-white d-flex justify-content-between"
          href="#"
          @click.prevent="toggleDropdown('stocks')"
        >
          <span>
            <i class="bi bi-cart4 me-2"></i> Stocks
          </span>
          <i
            class="bi"
            :class="activeDropdown === 'stocks' ? 'bi-chevron-up' : 'bi-chevron-down'"
          ></i>
        </a>
        <ul v-if="activeDropdown === 'stocks'" class="nav flex-column ms-3 bg-secondary">
          <li>
            <router-link class="nav-link text-white" to="/stocks">
              <i class="bi bi-eye me-2"></i> View Stocks
            </router-link>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          class="nav-link text-white d-flex justify-content-between"
          href="#"
          @click.prevent="toggleDropdown('transaction')"
        >
          <span>
            <i class="bi bi-currency-exchange me-2"></i> Sales
          </span>
          <i
            class="bi"
            :class="activeDropdown === 'transaction' ? 'bi-chevron-up' : 'bi-chevron-down'"
          ></i>
        </a>
        <ul v-if="activeDropdown === 'transaction'" class="nav flex-column ms-3 bg-secondary">
          <li>
            <router-link class="nav-link text-white" to="/transaction-list">
              <i class="bi bi-list-ul me-2"></i> Transaction List
            </router-link>
          </li>
        </ul>
      </li>
      <li v-if="isAdmin">
            <router-link class="nav-link text-white" to="/users">
              <i class="bi bi-person-lines-fill me-2"></i> Users
            </router-link>
      </li>
      
      <!-- Other Dropdowns -->
      <li class="nav-item">
        <a
          class="nav-link text-white d-flex justify-content-between"
          href="#"
          @click.prevent="toggleDropdown('other')"
        >
          <span>
            <i class="bi bi-folder me-2"></i> Other
          </span>
          <i
            class="bi"
            :class="activeDropdown === 'other' ? 'bi-chevron-up' : 'bi-chevron-down'"
          ></i>
        </a>
        <ul v-if="activeDropdown === 'other'" class="nav flex-column ms-3 bg-secondary">
          <li>
            <router-link class="nav-link text-white" to="/add-category">
              <i class="bi bi-plus-circle me-2"></i> Add Category
            </router-link>
          </li>
        </ul>
      </li>
      
      <li>
        <a class="nav-link text-danger" href="#" @click.prevent="logout">
          <i class="bi bi-box-arrow-right me-2"></i> Logout
        </a>
      </li>
    </ul>

    <footer class="mt-auto text-center small fs-6">
      <p>
        Powered by: <br />
        <img
          src="@/assets/rahisi.png"
          alt="Company Logo"
          class="img-fluid"
          style="height: 35px;"
        />
      </p>
      <!-- <p class="mt-1">&copy; 2022-2027 Rahisi Solutions</p> -->
    </footer>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 330px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1050;
  transition: transform 0.3s ease-in-out;
}
.d-none {
  display: none !important;
}

.nav-link:hover {
  background-color: #495057;
}
</style>
