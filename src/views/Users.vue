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
    <!-- Heading, Search and Add Button -->
    <div class="row g-3 align-items-center mb-4">
      <div class="col-12 col-md-auto text-center text-md-start mb-3 mb-md-0">
        <h3 class="mb-0"><i class="bi bi-people me-2"></i>List of Users</h3>
      </div>
      <div class="col-12 col-md flex-grow-1 order-md-1 order-2">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input
            type="text"
            class="form-control"
            placeholder="Search user..."
            v-model="userStore.searchQuery"
          />
        </div>
      </div>
      <div
        class="col-12 col-md-auto text-center text-md-end order-md-2 order-1 mb-3 mb-md-0"
      >
        <button
          class="btn btn-secondary btn-md w-100 w-md-auto"
          @click="openAddUserModal"
        >
          <i class="bi bi-person-plus me-1"></i> New User
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-responsive">
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
                  'bg-success': user.status_name === 'Active',
                  'bg-danger': user.status_name === 'Inactive',
                }"
                class="badge"
              >
                {{ user.status_name }}
              </span>
            </td>
            <td>{{ user.createdAt }}</td>
            <td>
              <div class="btn-group">
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
      <!-- Total Users -->
      <div class="col-12 col-md-auto mt-2 mt-md-0">
        <h6 class="text-muted">
          Total Users:
          {{ dashboardStore.totals.totalUsers }}
        </h6>
      </div>
    </div>

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
