import AddStock from '/home/ahmed/Documents/vue-projects/vue-2/src/views/modals/AddStock.vue';
import AddCategory from '@/views/AddCategory.vue';
import AvailableProducts from '@/views/AvailableProducts.vue';
import Sales from '@/views/Sales.vue';
import Stock from '@/views/Stock.vue';
import TransactionList from '@/views/TransactionList.vue';
import UnavailableProducts from '@/views/UnavailableProducts.vue';
import Users from '@/views/Users.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../components/Layout.vue';
import AddProduct from '/home/ahmed/Documents/vue-projects/vue-2/src/views/modals/AddProduct.vue';
import Dashboard from '../views/Dashboard.vue';
import LoginForm from '../views/LoginForm.vue';
import Products from '../views/Products.vue';

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
      { path: '/available-products', component: AvailableProducts },
      { path: '/unavailable-products', component: UnavailableProducts },
      { path: '/add-category', component: AddCategory },
      { path: '/stocks', component: Stock },
      {
        path: '/add-product/:id?',
        name: 'AddProduct',
        component: AddProduct,
        props: true, // Allows passing route params as props
      },      
      { path: '/transaction', component: Sales },
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
  const isAuthenticated = !!sessionStorage.getItem('auth'); 
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
