import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from '/home/ahmed/Documents/vue-projects/vue-2/src/router';

import '/home/ahmed/Documents/vue-projects/vue-2/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import '/home/ahmed/Documents/vue-projects/vue-2/node_modules/bootstrap/dist/css/bootstrap.min.css'

createApp(App)
.use(router)
.mount('#app')
