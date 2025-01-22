<script setup>
import { ref, computed } from 'vue';
import dataService from '@/services/dataService';

const users = ref([]);
const isEditing = ref(false);
const userForm = ref({ id: null, username: '', password: '', role: 'Owner', status: 'Active' });
const apiUrl = 'http://localhost:8080/vue-api/users/';
const showModal = ref(false);

// Alert state
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('danger');

// Close Alert
const closeAlert = () => {
  showAlert.value = false;
};

// Fetch users from API
const fetchUsers = async () => {
  try {
    const response = await dataService.getSplash();
    users.value = response?.data?.data?.users || [];
    console.log('Users:', users.value);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

// Save or update user
const saveUser = async () => {
  const endpoint = isEditing.value ? 'updateUser.php' : 'addUser.php';
  const method = isEditing.value ? 'PUT' : 'POST';
  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm.value),
    });
    const data = await response.json();
    if (data.success) {
      fetchUsers();
      resetForm();
      showModal.value = false;
      alertMessage.value = data.message ;
      alertType.value = 'success';
      showAlert.value = true;
    } else {
      alertMessage.value = data.error ;
      alertType.value = 'danger';
      showAlert.value = true;
    }
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Edit user
const editUser = (user) => {
  isEditing.value = true;
  userForm.value = { ...user };
  showModal.value = true;
};

// Delete user with confirmation dialog
const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const response = await fetch(`${apiUrl}deleteUser.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        alertMessage.value = data.message ;
        alertType.value = 'success';
        showAlert.value = true;
      } else {
        alert(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};

// Reset form
const resetForm = () => {
  isEditing.value = false;
  userForm.value = { id: null, username: '', password: '', role: 'Owner', status: 'Active' };
};

// Fetch users on component load
fetchUsers();
</script>

<template>
  <div class="card shadow-sm p-3">
    <h3 class="mb-3"><i class="bi bi-people me-2"></i>User Management</h3>

    <!-- Add User Button -->
    <button class="btn btn-primary mb-2 w-25" @click="() => { resetForm(); showModal = true; }">
      <i class="bi bi-plus-circle me-2"></i> New User
    </button>

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

    <!-- User Table -->
    <table class="table table-hover align-middle mt-3">
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
        <tr v-for="user in users" :key="user.id">
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
            <button class="btn btn-outline-success btn-sm me-2" @click="editUser(user)">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteUser(user.id)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="5" class="text-center text-muted">
            <i class="bi bi-info-circle"></i> No users found.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.7);"
      @click.self="showModal = false"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-person-plus me-2"></i> {{ isEditing ? 'Edit User' : 'Add User' }}
            </h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input
                  type="text"
                  id="username"
                  class="form-control"
                  v-model="userForm.username"
                  required
                />
                </div>
                
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-key"></i></span>
                  <input
                  type="password"
                  id="password"
                  class="form-control"
                  v-model="userForm.password"
                  :required="!isEditing"
                />
                </div>   
              </div>
              <div class="mb-3">
                <label for="role" class="form-label">Role</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-suitcase-lg"></i></span>
                  <select id="role" class="form-select" v-model="userForm.role" required>
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Cashier 1">Cashier 1</option>
                    <option value="Cashier 2">Cashier 2</option>
                  </select>
                </div>
  
              </div>
              <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-info-circle"></i></span>
                  <select id="status" class="form-select" v-model="userForm.status" required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
              </div>
              <button type="submit" class="btn btn-success w-100">
                <i class="bi bi-save me-2"></i> Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
