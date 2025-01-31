<script setup>
import { ref, computed, onMounted } from "vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useUserStore } from "@/stores/user";
import AddUser from "./modals/AddUser.vue";
import Alert from "@/components/Alert.vue";

const dashboardStore = useDashboardStore();
const userStore = useUserStore();

const currentPage = ref(1);
const itemsPerPage = ref(5);
const modalData = ref(null);
const showModal = ref(false);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return userStore.filteredUsers.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(userStore.filteredUsers.length / itemsPerPage.value)
);

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

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
    <!--  Search and Button Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3><i class="bi bi-people me-2"></i>List of Users</h3>
      <button class="btn btn-secondary btn-md" @click="openAddUserModal">
        <i class="bi bi-person-plus me-2"></i> New User
      </button>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="input-group w-50">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input
          type="text"
          class="form-control"
          placeholder="Search user..."
          v-model="userStore.searchQuery"
        />
      </div>
      <h6 class="text-secondary">
        Total Users:
        {{ dashboardStore.totals.totalUsers }}
      </h6>
    </div>

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
        <tr v-for="user in paginatedUsers" :key="user.id">
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
    <!-- Pagination -->
    <div class="d-flex justify-content-center gap-2 mb-1">
      <button
        class="btn btn-secondary"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <i class="bi bi-chevron-bar-left me-1"></i>Previous
      </button>
      <button
        class="btn btn-secondary"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next<i class="bi bi-chevron-bar-right ms-1"></i>
      </button>
    </div>

    <AddUser v-if="showModal" :user="modalData" @close="closeModal" />
  </div>
</template>
