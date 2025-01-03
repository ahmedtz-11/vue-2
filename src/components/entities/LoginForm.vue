<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const usernameError = ref(false);
const passwordError = ref(false);
const router = useRouter(); 

const validateForm = () => {
  usernameError.value = !username.value;
  passwordError.value = !password.value;
  return !usernameError.value && !passwordError.value;
};

const handleSubmit = () => {
  if (username.value === 'admin' && password.value === 'admin123') {
    localStorage.setItem('auth', 'true'); // Simulate authentication
    router.push('/layout'); // Redirect to the main layout
  } else {
    usernameError.value = true;
    passwordError.value = true;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="card shadow-lg text-bg-secondary">
      <div class="card-header text-center">
        <h3>Business Management System</h3>
      </div>
      <div class="card-body">
        <h5 class="card-title text-center">Login Form</h5>
        <!-- USERNAME FIELD -->
        <div class="input-group mb-4">
          <span class="input-group-text" id="inputGroup-sizing-default">Username</span>
          <input 
            type="text" 
            class="form-control" 
            id="username" 
            v-model="username" 
            :class="{'is-invalid': usernameError}">
        </div>

        <!-- PASSWORD FIELD -->
        <div class="input-group mb-4">
          <span class="input-group-text" id="inputGroup-sizing-default">Password</span>
          <input 
            type="password" 
            class="form-control" 
            id="password" 
            v-model="password" 
            :class="{'is-invalid': passwordError}">
        </div>

        <!-- SUBMIT BUTTON -->
        <div class="d-grid gap-2">
          <button class="btn btn-primary" type="button" @click="handleSubmit">LOGIN</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url('/home/ahmed/Documents/vue-projects/vue-2/src/assets/pexels-wendy-wei-1555900.jpg') no-repeat center center/cover;
}

.card {
  width: 40rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  background-color: #007bff;
  color: white;
}

.card-title {
  margin-bottom: 1rem;
}

.is-invalid {
  border: 1px solid red;
}
</style>
