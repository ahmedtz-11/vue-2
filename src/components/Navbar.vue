<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import Alert from "./Alert.vue";
import ChangePin from "@/views/modals/ChangePin.vue";

defineProps(["onToggleSidebar"]);

const userStore = useUserStore();
const router = useRouter();
const showModal = ref(false);

const logout = () => {
  sessionStorage.removeItem("auth");
  sessionStorage.removeItem("user");
  router.push("/");
};

const openChangePinModal = () => {
  showModal.value = true;
};

// Close modal & reset fields
const closeModal = () => {
  showModal.value = false;
  oldPin.value = "";
  newPin.value = "";
  confirmPin.value = "";
};

onMounted(() => {
  userStore.fetchLoggedInUser();
});
</script>

<template>
  <Alert
    :message="userStore.alertMessage"
    :type="userStore.alertType"
    :show="userStore.showAlert"
    @close="userStore.showAlert = false"
  />
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
          <span class="text-light text-capitalize fs-5">
            <i class="bi bi-person-circle me-2"></i>{{ userStore.username }}
          </span>
        </div>
        <ul class="dropdown-menu dropdown-menu-end bg-dark">
          <li>
            <a
              class="dropdown-item text-white"
              href="#"
              @click="openChangePinModal"
            >
              <i class="bi bi-key me-2"></i>Change PIN
            </a>
          </li>
          <li><hr class="dropdown-divider bg-secondary" /></li>
          <li>
            <a
              class="dropdown-item text-white"
              href="#"
              @click.prevent="logout"
            >
              <i class="bi bi-box-arrow-right me-2"></i>Logout
            </a>
          </li>
        </ul>
      </div>
    </div>

    <ChangePin v-if="showModal" @close="closeModal" />
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
