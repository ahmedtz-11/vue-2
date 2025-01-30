<script setup>
import { ref, computed, onMounted } from "vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useUserStore } from "@/stores/user";
import AddUser from "./modals/AddUser.vue";
import Alert from "@/components/Alert.vue";

const dashboardStore = useDashboardStore();
const userStore = useUserStore();

const modalData = ref(null);
const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;
  modalData.value = null;
};

const openAddUserModal = () => {
  modalData.value = null;
  showModal.value = true;
};

const openEditUserModal = (user) => {
  modalData.value = { ...user };
  showModal.value = true;
};

// Delete user with confirmation dialog
const deleteUser = async (id) => {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      await userStore.deleteUser(id);
      await dashboardStore.initializeDashboard();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
};

onMounted(async () => {
  await userStore.fetchUsers();
  await dashboardStore.initializeDashboard();
});
</script>

<template>
  <Alert
    :message="userStore.alertMessage"
    :type="userStore.alertType"
    :show="userStore.showAlert"
    @close="userStore.showAlert = false"
  />

  <div class="card shadow-sm p-3">
    <h3 class="mb-3"><i class="bi bi-people me-2"></i>User Management</h3>

    <button class="btn btn-secondary mb-3 w-25" @click="openAddUserModal">
      <i class="bi bi-plus-circle me-2"></i> New User
    </button>
    <h6 class="text-secondary mb-2">
      <i class="bi bi-list-task me-2"></i>Total Users:
      {{ dashboardStore.totals.totalUsers }}
    </h6>
    <!-- Users Table -->
    <table class="table table-hover align-middle fs-5">
      <thead class="table-dark">
        <tr>
          <th>Username</th>
          <th>Role</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in userStore.users" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.role }}</td>
          <td>
            <span
              :class="{
                'text-success': user.status === 'Active',
                'text-danger': user.status === 'Inactive',
              }"
              class="fw-bold"
            >
              {{ user.status }}
            </span>
          </td>
          <td>{{ user.createdAt }}</td>
          <td>
            <div class="btn-group">
              <!-- data-bs-toggle="tooltip"
              title="Delete" -->
              <button
                class="btn btn-outline-success btn-md"
                @click="openEditUserModal(user)"
                style="border: none !important"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-outline-danger btn-md"
                @click="deleteUser(user.id)"
                style="border: none !important"
              >
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="userStore.users.length === 0">
          <td colspan="5" class="text-center text-muted">
            <i class="bi bi-info-circle"></i> No users found.
          </td>
        </tr>
      </tbody>
    </table>

    <AddUser v-if="showModal" :user="modalData" @close="closeModal" />
  </div>
</template>
