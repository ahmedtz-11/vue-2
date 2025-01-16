<script setup>
import { ref, computed } from 'vue';

const currentUserRole = 'Admin'; // Adjust as needed for testing roles
const users = ref([]);
const logs = ref([]);
const isEditing = ref(false);
const userForm = ref({ id: null, username: '', password: '', role: 'Owner', status: 'Active' });
const apiUrl = 'http://localhost:8080/vue-api/users/'; // Adjust to your API base URL

// Fetch users from API
const fetchUsers = async () => {
  try {
    const response = await fetch(`${apiUrl}getAllUser.php`);
    const data = await response.json();
    users.value = data.users || [];
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
      alert(data.message);
      fetchUsers();
      resetForm();
    } else {
      alert(data.error || 'An error occurred');
    }
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Edit user
const editUser = (user) => {
  isEditing.value = true;
  userForm.value = { ...user };
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
        alert(data.message);
        fetchUsers();
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
  <div class="user-management">
    <h3>User Management</h3>

    <div v-if="currentUserRole === 'Admin'" class="admin-actions">
      <form @submit.prevent="saveUser" class="user-form">
        <input v-model="userForm.username" id="uname" placeholder="Username..." required />
        <input v-model="userForm.password" placeholder="Password..." required />
        <select v-model="userForm.role">
          <option value="Owner">Owner</option>
          <option value="Admin">Admin</option>
          <option value="Cashier 1">Cashier 1</option>
          <option value="Cashier 2">Cashier 2</option>
        </select>
        <select v-model="userForm.status">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button type="submit">{{ isEditing ? 'Update User' : 'Add User' }}</button>
        <button type="button" @click="resetForm" v-if="isEditing">Cancel</button>
      </form>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID.</th>
          <th>Username</th>
          <th>Password</th>
          <th>Role</th>
          <th>Status</th>
          <th>Created At</th>
          <th v-if="currentUserRole === 'Admin'">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.password }}</td>
          <td>{{ user.role }}</td>
          <td>{{ user.status }}</td>
          <td>{{ user.createdAt }}</td>
          <td v-if="currentUserRole === 'Admin'">
            <button class="btn btn-success btn-sm" @click="editUser(user)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>



<style scoped>
.user-management {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  height: 100vh;
}

.user-form {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

#uname {
  text-transform: capitalize;
}

.user-form input,
.user-form select,
.user-form button {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.user-form button {
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.user-form button:hover {
  background-color: #0056b3;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
    background-color: #34495e;
    color: white;
}

button {
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

.system-logs {
  margin-top: 40px;
}

.btn {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
}

.btn-success {
  background-color: #28a745;
  color: white;
  margin-right: 5px;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
