import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/entities/LoginForm.vue';
import Dashboard from '../components/entities/Dashboard.vue';
import Layout from '/home/ahmed/Documents/vue-projects/vue-2/src/components/Layout/Layout.vue'
import Products from '/home/ahmed/Documents/vue-projects/vue-2/src/components/entities/Products.vue'
import Stock from '@/components/entities/Stock.vue';
import AddProduct from '/home/ahmed/Documents/vue-projects/vue-2/src/components/entities/AddProduct.vue';
import Sales from '@/components/entities/Sales.vue';
import AddStock from '@/components/entities/AddStock.vue';
import Users from '@/components/entities/Users.vue';
import TransactionList from '@/components/entities/TransactionList.vue';

const routes = [
  {
    path: '/',
    component: LoginForm,
  },
  {
    path: '/layout',
    component: Layout,
    children: [
      { path: '', component: Dashboard },
      { path: '/products', component: Products },
      { path: '/stocks', component: Stock },
      { path: '/add-product', component: AddProduct },
      { path: '/sales', component: Sales },
      { path: '/add-stock', component: AddStock },
      { path: '/users', component: Users },
      { path: '/transaction-list', component: TransactionList },

    ],
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('auth'); 
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
