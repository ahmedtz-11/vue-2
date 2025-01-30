<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
defineProps(["onToggleSidebar"]);

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  sessionStorage.removeItem("auth");
  sessionStorage.removeItem("user");
  router.push("/");
};

onMounted(() => {
  userStore.fetchLoggedInUser();
});
</script>

<template>
  <nav class="navbar navbar-dark bg-secondary d-flex align-items-center">
    <div class="container-fluid">
      <!-- Left Side: Toggle Button and Brand -->
      <div class="d-flex align-items-center">
        <button
          class="btn btn-outline-light me-2"
          type="button"
          @click="onToggleSidebar"
        >
          <i class="bi bi-list"></i>
        </button>
      </div>

      <!-- Right Side: User Profile with Dropdown -->
      <div class="dropdown me-2">
        <div
          class="d-flex align-items-center dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <!-- <img
            src="/home/ahmed/Documents/vue-projects/vue-2/src/assets/icon2.jpg"
            alt="User"
            class="rounded-circle border me-2"
            style="width: 40px; height: 40px"
          /> -->
          <span class="text-light text-capitalize fs-5">
            <i class="bi bi-person-circle me-2"></i>{{ userStore.username }}
          </span>
        </div>
        <ul class="dropdown-menu dropdown-menu-end bg-dark">
          <li>
            <a class="dropdown-item text-white" href="#">
              <i class="bi bi-key me-2"></i>Change PIN
            </a>
          </li>
          <!-- <li><hr class="dropdown-divider" /></li> -->
          <li>
            <a class="dropdown-item text-white" href="#" @click.prevent="logout">
              <i class="bi bi-box-arrow-right me-2"></i>Logout
            </a>
          </li>
        </ul>
      </div>
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

.dropdown-toggle {
  cursor: pointer;
}

.dropdown-menu {
  margin-top: 10px;
}

.dropdown-menu a:hover {
 background-color: #4b4e50;
}
</style>
