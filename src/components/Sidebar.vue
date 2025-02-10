<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

defineProps(["isSidebarOpen", "onCloseSidebar"]);

const userStore = useUserStore();
const activeDropdown = ref(null);
const router = useRouter();
const isAdmin = ref(false);

const toggleDropdown = (dropdown) => {
  activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
};

onMounted(() => {
  userStore.fetchLoggedInUser();
  if (userStore.username === "admin") {
    isAdmin.value = true;
  }
});
</script>

<template>
  <aside
    class="sidebar d-flex flex-column bg-dark text-white vh-100 fs-5 p-2"
    :class="{ 'sidebar-hidden': !isSidebarOpen }"
  >
    <!-- Close Button for Small Screens -->
    <button
      class="btn btn-outline-light align-self-end d-lg-none"
      @click="onCloseSidebar"
    >
      <i class="bi bi-x-lg"></i>
    </button>

    <ul class="nav flex-column mt-3">
      <!-- border-bottom border-1 border-secondary -->
      <li class="nav-item text-secondary fs-3 ms-4 mb-3 fw-bold">
        DUKANI
      </li>
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
          <span> <i class="bi bi-box-seam me-2"></i> Products </span>
          <i
            class="bi"
            :class="
              activeDropdown === 'products'
                ? 'bi-chevron-up'
                : 'bi-chevron-down'
            "
          ></i>
        </a>
        <ul
          v-if="activeDropdown === 'products'"
          class="nav flex-column ms-3"
        >
          <li>
            <router-link class="nav-link text-white" to="/products">
              All Products
            </router-link>
          </li>
          <li>
            <router-link class="nav-link text-white" to="/available-products">
              Available Products
            </router-link>
          </li>
          <li>
            <router-link class="nav-link text-white" to="/unavailable-products">
              Unavailable Products
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
          <span> <i class="bi bi-cart4 me-2"></i> Stocks </span>
          <i
            class="bi"
            :class="
              activeDropdown === 'stocks' ? 'bi-chevron-up' : 'bi-chevron-down'
            "
          ></i>
        </a>
        <ul
          v-if="activeDropdown === 'stocks'"
          class="nav flex-column ms-3"
        >
          <li>
            <router-link class="nav-link text-white" to="/stocks">
              View Stocks
            </router-link>
          </li>
        </ul>
      </li>
      <!-- Transactions Dropdowns -->
      <li class="nav-item">
        <a
          class="nav-link text-white d-flex justify-content-between"
          href="#"
          @click.prevent="toggleDropdown('transaction')"
        >
          <span> <i class="bi bi-currency-exchange me-2"></i> Sales </span>
          <i
            class="bi"
            :class="
              activeDropdown === 'transaction'
                ? 'bi-chevron-up'
                : 'bi-chevron-down'
            "
          ></i>
        </a>
        <ul
          v-if="activeDropdown === 'transaction'"
          class="nav flex-column ms-3"
        >
          <li>
            <router-link class="nav-link text-white" to="/transaction-list">
              Transaction List
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
          <span> <i class="bi bi-folder me-2"></i> Extras </span>
          <i
            class="bi"
            :class="
              activeDropdown === 'other' ? 'bi-chevron-up' : 'bi-chevron-down'
            "
          ></i>
        </a>
        <ul
          v-if="activeDropdown === 'other'"
          class="nav flex-column ms-3"
        >
          <li>
            <router-link class="nav-link text-white" to="/category">
              Categories
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 300px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1050;
  transition: transform 0.3s ease-in-out;
}
.sidebar-hidden {
  transform: translateX(-100%);
}
.nav-link:hover {
  background-color: #4b4e50;
}
</style>
