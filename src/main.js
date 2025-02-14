import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from '/home/ahmed/Documents/vue-projects/vue-2/src/router';
import { createPinia } from 'pinia';
import '/home/ahmed/Documents/vue-projects/vue-2/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import '/home/ahmed/Documents/vue-projects/vue-2/src/assets/global.sass';
import '/home/ahmed/Documents/vue-projects/vue-2/node_modules/bootstrap-icons/font/bootstrap-icons.min.css';

const app = createApp(App); // Create the app instance first
const pinia = createPinia();

// Register a global function for formatting money
app.config.globalProperties.$formatMoney = (value) => {
  if (!value) return "0";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Now use plugins and mount the app
app.use(router).use(pinia).mount('#app');
