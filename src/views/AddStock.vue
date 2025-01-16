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
  <div class="add-stock-container">
    <h3>Add New Stock</h3>
    <form class="add-stock-form" @submit.prevent="addStock">
      <div class="form-row">
        <!-- Product -->
        <div class="form-group">
          <label for="product">Product</label>
          <select id="product" class="form-control" v-model="product" required>
            <option value="" disabled>Select a product</option>
            <option v-for="prod in productStore.products" :key="prod.id" :value="prod.name">{{ prod.name }}</option>
          </select>
        </div>

        <!-- Quantity Available -->
        <div class="form-group">
          <label for="quantity">Quantity</label>
          <input type="number" id="quantity" class="form-control" v-model="quantity" required min="1" />
        </div>
      </div>

      <div class="form-row">
        <!-- Purchasing Price -->
        <div class="form-group">
          <label for="purchasingPrice">Purchasing Price</label>
          <input type="number" id="purchasingPrice" class="form-control" v-model="purchasingPrice" required min="0" />
        </div>

        <!-- Expiry Date -->
        <div class="form-group">
          <label for="expiryDate">Expiry Date</label>
          <input type="date" id="expiryDate" class="form-control" v-model="expiryDate" required />
        </div>

        <!-- Added By -->
        <div class="form-group">
          <label for="addedBy">Added By</label>
          <input type="text" id="addedBy" class="form-control" :value="userStore.username" disabled />
        </div>
      </div>

      <div class="form-row">
        <!-- Submit Button -->
        <button type="button" class="btn btn-warning" @click="back">Cancel</button>
        <button type="submit" class="btn btn-primary">Add Stock</button>
      </div>
    </form>
  </div>
</template>


<style scoped>
.add-stock-container {
  /* max-width: 800px; */
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}

.add-stock-form .form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.add-stock-form .form-group {
  flex: 1;
}

.add-stock-form label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.add-stock-form .form-control {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-stock-form .btn {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 18px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.add-stock-form .btn:hover {
  background-color: #218838;
}

.add-stock-form .btn-warning {
  background-color: rgb(210, 30, 45);
}

.add-stock-form .btn-warning:hover {
  background-color: rgb(168, 20, 32);
}
</style>
