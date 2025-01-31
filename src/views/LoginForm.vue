<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import dataService from "@/services/dataService";
import Alert from "@/components/Alert.vue";

const router = useRouter();
const showAlert = ref(false);
const alertMessage = ref("");
const alertType = ref("danger");
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Forgot Password Placeholder
const forgotPassword = () => {
  alertMessage.value = "Forgot password functionality is under construction.";
  alertType.value = "info";
  showAlert.value = true;
};

// Vee-Validate Schema
const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

// Vee-Validate Form and Fields
const { handleSubmit } = useForm({
  validationSchema,
});

const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");

// Handle Form Submission
const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await dataService.login({
      username: values.username,
      password: values.password,
    });

    if (response.data.success) {
      sessionStorage.setItem("auth", "true");
      sessionStorage.setItem(
        "user",
        JSON.stringify({ username: values.username, id: response.data.id }) 
      );
      router.push("/layout");
    } else {
      alertMessage.value = response.data.error || "Invalid credentials";
      alertType.value = "danger";
      showAlert.value = true;
    }
  } catch (error) {
    console.error("Login request failed:", error);
    alertMessage.value = "An error occurred. Please try again later.";
    alertType.value = "danger";
    showAlert.value = true;
  }
});
</script>

<template>
  <Alert
    :message="alertMessage"
    :type="alertType"
    :show="showAlert"
    @close="showAlert = false"
  />
  <div
    class="d-flex justify-content-center align-items-center vh-100"
    style="
      background-image: linear-gradient(
          rgba(205, 205, 205, 0.9),
          rgba(0, 0, 0, 0.8)
        ),
        url('/images/dukani4.jpg');
      background-size: cover;
      background-position: center;
    "
  >
    <div
      class="card shadow-lg"
      style="width: 550px; background-color: rgba(255, 255, 255, 0.7)"
    >
      <div class="card-header text-center">
        <h2 class="fw-bold">DUKANI</h2>
      </div>
      <div class="card-body fs-5">
        <form @submit.prevent="onSubmit">
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
              style="background-color: rgba(5, 5, 5, 0.3)"
            />
            <div v-if="usernameError" class="text-danger mt-1">
              {{ usernameError }}
            </div>
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
                style="background-color: rgba(5, 5, 5, 0.3)"
              />
              <button
                type="button"
                class="btn btn-dark"
                @click="togglePasswordVisibility"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div v-if="passwordError" class="text-danger mt-1">
              {{ passwordError }}
            </div>
          </div>
          <!-- Forgot Password -->
          <div class="d-flex justify-content-end mb-3">
            <a
              href="#"
              @click.prevent="forgotPassword"
              class="text-decoration-none text-secondary"
              >Forgot Password?</a
            >
          </div>
          <!-- Submit Button -->
          <button type="submit" class="btn btn-dark fs-5 w-100">
            <i class="bi bi-box-arrow-in-right me-2"></i> Login
          </button>
        </form>
        <p class="text-center mt-4 fs-6">
          Powered by: <br />
          <img
            src="/images/rahisi-2-removebg-preview.png?url"
            alt="Company Logo"
            class="img-fluid"
            style="height: 30px"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .card {
  border-radius: 20px;
} */
</style>
