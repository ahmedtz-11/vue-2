<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import dataService from '@/services/dataService';

const username = ref('');
const password = ref('');
const usernameError = ref(false);
const passwordError = ref(false);
const showPassword = ref(false);
const router = useRouter();

// Alert state
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('danger');

// Close Alert
const closeAlert = () => {
  showAlert.value = false;
};

// Toggles
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Forgot Password Placeholder
const forgotPassword = () => {
  alertMessage.value = 'Forgot password functionality is under construction.';
  alertType.value = 'info';
  showAlert.value = true;
};

// Form Validation
const validateForm = () => {
  usernameError.value = !username.value;
  passwordError.value = !password.value;
  return !usernameError.value && !passwordError.value;
};

// Handle Form Submission
const handleSubmit = async () => {
  if (validateForm()) {
    try {
      const response = await dataService.login({
        username: username.value,
        password: password.value,
      });

      if (response.data.success) {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('user', JSON.stringify({ username: username.value }));
        router.push('/layout');
      } else {
        alertMessage.value = response.data.error || 'Invalid credentials';
        alertType.value = 'danger';
        showAlert.value = true;
      }
    } catch (error) {
      console.error('Login request failed:', error);
      alertMessage.value = 'An error occurred. Please try again later.';
      alertType.value = 'danger';
      showAlert.value = true;
    }
  }
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100" style="background: rgba(35, 35, 35, 0.1)" >
    <div class="card shadow-lg" style="width: 550px; background: rgba(35, 35, 35, 0.2);">

      <div class="card-header text-center bg-secondary text-white">
        <h2><i class="bi bi-shop display-5 me-3"></i>Dukani</h2>
      </div>
      <div class="card-body fs-5">
        <!-- Bootstrap Alert -->
      <div
        v-if="showAlert"
        class="alert alert-dismissible"
        :class="`alert-${alertType}`"
        role="alert"
      >
        {{ alertMessage }}
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="closeAlert"
        ></button>
      </div>

        <form @submit.prevent="handleSubmit">
          <!-- Username Field -->
          <div class="mb-3">
            <label for="username" class="form-label">
              <i class="bi bi-person me-2"></i>Username
            </label>
            <input
              type="text"
              id="username"
              v-model="username"
              class="form-control fs-5"
              :class="{ 'is-invalid': usernameError }"
              required
            />
            <div v-if="usernameError" class="invalid-feedback">Valid username is required</div>
          </div>

          <!-- Password Field -->
          <div class="mb-3">
            <label for="password" class="form-label">
              <i class="bi bi-key me-2"></i>Password
            </label>
            <div class="input-group">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="form-control fs-5"
                :class="{ 'is-invalid': passwordError }"
                required
              />
              <button
                type="button"
                class="btn btn-secondary"
                @click="togglePasswordVisibility"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div v-if="passwordError" class="invalid-feedback">Valid password is required</div>
          </div>

          <!-- Forgot Password -->
          <div class="d-flex justify-content-end mb-3">
            <a href="#" @click.prevent="forgotPassword" class="text-decoration-none">Forgot Password?</a>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-secondary fs-5 w-100">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 10px;
}

</style>
