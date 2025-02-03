<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
// import Alert from "@/components/Alert.vue";

const showAlert = ref(false);
const alertMessage = ref("");
const alertType = ref("danger");
const userStore = useUserStore();
const showPassword = ref(false);
const loading = ref(false);
const emit = defineEmits(["close"]);

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

const closeModal = () => {
  emit("close");
};

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
      showAlert = true;
      alertMessage = response.message;
      alertType = "success";
      //   alert(response.message);
      closeModal();
    } else {
      showAlert = true;
      alertMessage = response.error;
      alertType = "danger";
      //   alert(response.error);
    }
  } catch (error) {
    console.error("API Error:", error);
    showAlert = true;
    alertMessage = error;
    alertType = "danger";
    // alert("An error occurred while changing the PIN.");
  } finally {
    loading.value = false;
  }
});

onMounted(() => {
  userStore.fetchLoggedInUser();
});
</script>

<template>
  <teleport to="body">
    <!-- <Alert
      :message="alertMessage"
      :type="alertType"
      :show="showAlert"
      @close="showAlert = false"
    /> -->
    <div
      class="modal fade show"
      tabindex="-1"
      id="changePasswordModal"
      aria-labelledby="changePasswordModalLabel"
      aria-hidden="true"
      style="display: block; background: rgba(0, 0, 0, 0.7)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h3 class="modal-title" id="changePasswordModalLabel">Change Password</h3>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body fs-5">
            <form @submit.prevent="changePin">
              <div class="mb-3">
                <label for="oldPin" class="form-label">
                  <i class="bi bi-database-lock me-2"></i> Current Password
                </label>
                <input
                  type="password"
                  class="form-control form-control-lg"
                  v-model="oldPin"
                  :class="{ 'is-invalid': oldPinError }"
                />
                <div v-if="oldPinError" class="invalid-feedback">
                  {{ oldPinError }}
                </div>
              </div>

              <div class="mb-3">
                <label for="newPin" class="form-label">
                  <i class="bi bi-shield-lock me-2"></i> New Password
                </label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control form-control-lg"
                    v-model="newPin"
                    :class="{ 'is-invalid': newPinError }"
                  />
                  <button
                    type="button"
                    class="btn btn-dark"
                    @click="togglePasswordVisibility"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="newPinError" class="invalid-feedback">
                  {{ newPinError }}
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmPin" class="form-label">
                  <i class="bi bi-shield-lock-fill me-2"></i> Confirm New Password
                </label>
                <input
                  type="password"
                  class="form-control form-control-lg"
                  v-model="confirmPin"
                  :class="{ 'is-invalid': confirmPinError }"
                />
                <div v-if="confirmPinError" class="invalid-feedback">
                  {{ confirmPinError }}
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="submit" class="btn btn-success" @click="changePin">
              <i class="bi bi-save me-2"></i> Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>


