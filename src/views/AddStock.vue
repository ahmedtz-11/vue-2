<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '/home/ahmed/Documents/vue-projects/vue-2/src/stores/product.js';
import { useUserStore } from '/home/ahmed/Documents/vue-projects/vue-2/src/stores/user.js';
import { useStockStore } from '/home/ahmed/Documents/vue-projects/vue-2/src/stores/stock.js';

const router = useRouter();
const productStore = useProductStore();
const userStore = useUserStore();
const stockStore = useStockStore();

const product = ref('');
const quantity = ref('');
const purchasingPrice = ref('');
const expiryDate = ref('');

const addStock = async () => {
  const stockData = {
    product_name: product.value,
    quantity: quantity.value,
    purchasing_price: purchasingPrice.value,
    expiry_date: expiryDate.value,
    added_by: userStore.username,
  };

  const success = await stockStore.addStock(stockData);
  if (success) {
    router.push('/stocks');
  }
};

const back = () => {
  router.push('/stocks');
};

onMounted(() => {
  productStore.fetchProducts();
  userStore.fetchLoggedInUser();
});
</script>


<template>
  <div class="card shadow-sm p-3">
    <h3 class="mb-3"><i class="bi bi-cart-plus me-2"></i>Add New Stock</h3>
    <form @submit.prevent="addStock">
      <div class="row mb-3">
        <!-- Product -->
        <div class="col-md-6">
          <label for="product" class="form-label">
            <i class="bi bi-box me-2"></i>Product
          </label>
          <select id="product" class="form-select" v-model="product" required>
            <option value="" disabled>Select a product</option>
            <option v-for="prod in productStore.products" :key="prod.id" :value="prod.name" class="text-capitalize">
              {{ prod.name }}
            </option>
          </select>
        </div>

        <!-- Quantity -->
        <div class="col-md-6">
          <label for="quantity" class="form-label">
            <i class="bi bi-bag-plus me-2"></i>Quantity
          </label>
          <input 
            type="number" 
            id="quantity" 
            class="form-control" 
            v-model="quantity" 
            required 
            min="1" 
          />
        </div>
      </div>

      <div class="row mb-3">
        <!-- Purchasing Price -->
        <div class="col-md-6">
          <label for="purchasingPrice" class="form-label">
            <i class="bi bi-cash-stack me-2"></i>Purchasing Price
          </label>
          <input 
            type="number" 
            id="purchasingPrice" 
            class="form-control" 
            v-model="purchasingPrice" 
            required 
            min="0" 
          />
        </div>

        <!-- Expiry Date -->
        <div class="col-md-6">
          <label for="expiryDate" class="form-label">
            <i class="bi bi-calendar-minus me-2"></i>Expiry Date
          </label>
          <input 
            type="date" 
            id="expiryDate" 
            class="form-control" 
            v-model="expiryDate" 
            required 
          />
        </div>
      </div>

      <div class="row mb-4">
        <!-- Added By -->
        <div class="col-md-6">
          <label for="addedBy" class="form-label">
            <i class="bi bi-person me-2"></i>Added By
          </label>
          <input 
            type="text" 
            id="addedBy" 
            class="form-control" 
            :value="userStore.username" 
            disabled 
          />
        </div>
      </div>

      <!-- Buttons -->
      <div class="d-flex justify-content-between mt-4">
        <button type="button" class="btn btn-danger" @click="back">
          <i class="bi-arrow-left-circle"></i> Cancel
        </button>
        <button type="submit" class="btn btn-success">
          <i class="bi-save"></i> Add Stock
        </button>
      </div>
    </form>
  </div>
</template>

