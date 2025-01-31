<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import Alert from "./Alert.vue";

defineProps(["onToggleSidebar"]);

const userStore = useUserStore();
const router = useRouter();
const showModal = ref(false);
const showPassword = ref(false);
const loading = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Define form validation schema
const schema = yup.object({
  oldPin: yup.string().required("Current Password is required"),
  newPin: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])/, 
      "Password must contain a mix of numbers and characters"
    )
    .required("New Password is required"),
  confirmPin: yup
    .string()
    .oneOf([yup.ref("newPin"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

// Initialize form validation
const { handleSubmit } = useForm({ validationSchema: schema });
const { value: oldPin, errorMessage: oldPinError } = useField("oldPin");
const { value: newPin, errorMessage: newPinError } = useField("newPin");
const { value: confirmPin, errorMessage: confirmPinError } =
  useField("confirmPin");

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
}

const changePin = handleSubmit(async (values) => {
  if (!userStore.userId) {
    alert("User ID is not available. Please log in again.");
    return;
  }

  loading.value = true;
  try {
    const response = await userStore.changePin(userStore.userId, {
      oldPin: values.oldPin,
      newPin: values.newPin,
    });

    if (response.success) {
      alert(response.message);
      closeModal();
    } else {
      alert(response.error);
    }
  } catch (error) {
    console.error("API Error:", error);
    alert("An error occurred while changing the PIN.");
  } finally {
    loading.value = false;
  }
});

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

    <!-- Change PIN Modal -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.7)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              <i class="bi bi-key me-2"></i>Change Password
            </h4>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="changePin">
              <div class="mb-3">
                <label for="oldPin" class="form-label"><i class="bi bi-database-lock me-2 fs-5"></i>Current Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="oldPin"
                  :class="{ 'is-invalid': oldPinError }"
                />
                <div v-if="oldPinError" class="invalid-feedback">
                  {{ oldPinError }}
                </div>
              </div>
              <div class="mb-3">
                <label for="newPin" class="form-label"><i class="bi bi-shield-lock me-2 fs-5"></i>New Password</label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="newPin"
                    :class="{ 'is-invalid': newPinError }"
                  />
                  <button
                    type="button"
                    class="btn btn-dark"
                    @click="togglePasswordVisibility"
                  >
                    <i
                      :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                    ></i>
                  </button>
                </div>
                <div v-if="newPinError" class="invalid-feedback">
                  {{ newPinError }}
                </div>
              </div>
              <div class="mb-3">
                <label for="confirmPin" class="form-label"
                  ><i class="bi bi-shield-lock-fill me-2 fs-5"></i>Confirm New Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  v-model="confirmPin"
                  :class="{ 'is-invalid': confirmPinError }"
                />
                <div v-if="confirmPinError" class="invalid-feedback">
                  {{ confirmPinError }}
                </div>
              </div>
              <button type="submit" class="btn btn-dark">
                <i class="bi bi-save me-2"></i>Update Password
              </button>
            </form>
          </div>
        </div>
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
