<script setup>
import { ref, watch, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useDashboardStore } from "@/stores/dashboard";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

const dashboardStore = useDashboardStore();
const userStore = useUserStore();
const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["close"]);
const isEditing = ref(false);

// Define form fields with correct validation rules
const { handleSubmit } = useForm({
  validationSchema: yup.object({
    username: yup.string().required("Username is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    role: yup
      .string()
      .oneOf(["Owner", "Admin", "Cashier 1", "Cashier 2"], "Invalid role")
      .required("Role is required"),
    status: yup
      .string()
      .oneOf(["Active", "Inactive"], "Invalid status")
      .required("Status is required"),
  }),
});

// Bind validation fields correctly
const { value: username, errorMessage: usernameError } = useField("username");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: role, errorMessage: roleError } = useField("role");
const { value: status, errorMessage: statusError } = useField("status");

const populateForm = () => {
  if (props.user) {
    username.value = props.user.username;
    password.value = props.user.password;
    role.value = props.user.role;
    status.value = props.user.status_name;
    isEditing.value = true;
  } else {
    resetForm();
  }
};

// Save or update user
const saveUser = handleSubmit(async (values) => {
  const userData = {
    id: props.user?.id || null,
    username: values.username,
    password: values.password,
    role: values.role,
    status: values.status,
  };
  try {
    await userStore.saveUser(userData, isEditing.value);
    resetForm();
    emit("close");
  } catch (error) {
    console.error("Error saving user:", error);
  }
});

// Reset form
const resetForm = () => {
  isEditing.value = false;
};

const closeModal = () => {
  emit("close");
};

watch(
  () => props.user,
  () => {
    populateForm();
  }
);

onMounted(() => {
  populateForm();
  dashboardStore.initializeDashboard();
});
</script>

<template>
  <teleport to="body">
    <div
      class="modal fade show"
      id="userModal"
      tabindex="-1"
      aria-labelledby="userModalLabel"
      aria-hidden="true"
      style="display: block; background: rgba(0, 0, 0, 0.7)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h3>
              {{ isEditing ? "Edit User" : "Add New User" }}
            </h3>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body fs-5">
            <form @submit.prevent="saveUser">
              <!-- Username -->
              <div class="mb-3">
                <label for="username" class="form-label">
                  <i class="bi bi-person me-2"></i>Username
                </label>
                <input
                  type="text"
                  id="username"
                  class="form-control form-control-lg"
                  :class="{ 'is-invalid': usernameError }"
                  v-model="username"
                />
                <div v-if="usernameError" class="invalid-feedback">
                  {{ usernameError }}
                </div>
              </div>
              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="bi bi-key me-2"></i>Password
                </label>
                <input
                  type="password"
                  id="password"
                  class="form-control form-control-lg"
                  :class="{ 'is-invalid': passwordError }"
                  v-model="password"
                />
                <div v-if="passwordError" class="invalid-feedback">
                  {{ passwordError }}
                </div>
              </div>

              <div class="row mb-3 g-3">
                <!-- Role -->
                <div class="col-12 col-md-6">
                  <label for="role" class="form-label">
                    <i class="bi bi-suitcase-lg me-2"></i>Role
                  </label>
                  <select
                    id="role"
                    class="form-select form-select-lg"
                    :class="{ 'is-invalid': roleError }"
                    v-model="role"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Cashier 1">Cashier 1</option>
                    <option value="Cashier 2">Cashier 2</option>
                  </select>
                  <div v-if="roleError" class="invalid-feedback">
                    {{ roleError }}
                  </div>
                </div>
                <!-- Status -->
                <div class="col-12 col-md-6">
                  <label for="status" class="form-label">
                    <i class="bi bi-info-circle me-2"></i>Status
                  </label>
                  <select
                    id="status"
                    class="form-select form-select-lg"
                    :class="{ 'is-invalid': statusError }"
                    v-model="status"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <div v-if="statusError" class="invalid-feedback">
                    {{ statusError }}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="submit" class="btn btn-success" @click="saveUser">
              <i class="bi bi-save me-2"></i>
              {{ isEditing ? "Save Changes" : "Add User" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped></style>
