<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import dataService from '@/services/dataService'; // Import the service

const username = ref('');
const password = ref('');
const usernameError = ref(false);
const passwordError = ref(false);
const router = useRouter();

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const forgotPassword = () => {
  alert('Forgot password functionality is under construction.');
};

const validateForm = () => {
  usernameError.value = !username.value;
  passwordError.value = !password.value;
  return !usernameError.value && !passwordError.value;
};

const handleSubmit = async () => {
  if (validateForm()) {
    try {
      const response = await dataService.login({ 
        username: username.value, 
        password: password.value 
      });

      if (response.data.success) {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('user', JSON.stringify({ username: username.value }));
        router.push('/layout');
      } else {
        usernameError.value = true;
        passwordError.value = true;
        alert(response.data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login request failed:', error);
      alert('An error occurred. Please try again later.');
    }
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h3>Business Management System</h3>
      </div>
      <div class="login-body">
        <form @submit.prevent="handleSubmit">
          <!-- USERNAME FIELD -->
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              v-model="username"
              :class="{ 'error': usernameError }"
              required
            />
            <span v-if="usernameError" class="error-text">Valid username is required</span>
          </div>

          <!-- PASSWORD FIELD -->
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                :class="{ 'error': passwordError }"
                required
              />
              <button type="button" class="show-password" @click="togglePasswordVisibility">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
            <span v-if="passwordError" class="error-text">Valid password is required</span>
          </div>

          <!-- FORGOT PASSWORD LINK -->
          <div class="form-footer">
            <a href="#" @click="forgotPassword">Forgot Password?</a>
          </div>

          <!-- SUBMIT BUTTON -->
          <button type="submit" class="btn-submit">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('/home/ahmed/Documents/vue-projects/vue-2/src/assets/pexels-pixabay-164501.jpg')
    no-repeat center center/cover;
  backdrop-filter: blur(200px);
}

.login-card {
  width: 550px;
  background: rgba(255, 255, 255, 0.5);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
}

.login-header {
  text-align: center;
  margin-bottom: 15px;
  color: #111;
}

.login-body {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #bbb;
  border-radius: 10px;
  font-size: 18px;
  background-color: rgba(255, 255, 255, 0.2);
}

.password-wrapper {
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
}

.show-password {
  margin-left: 5px;
  padding: 8px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.show-password:hover {
  background: #0056b3;
}

.error {
  border-color: red;
}

.error-text {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

.form-footer {
  text-align: right;
  margin-bottom: 20px;
}

.form-footer a {
  color: #007bff;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}

.btn-submit {
  width: 100%;
  padding: 8px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
}

.btn-submit:hover {
  background: #0056b3;
}

</style>