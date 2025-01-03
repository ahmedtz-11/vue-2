<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const product = ref('');
const quantityAvailable = ref('');
const purchasingPrice = ref('');
const expiryDate = ref('');
const addedBy = ref('Admin');  // Simulate logged-in user
const addedAt = ref(new Date().toISOString());  // Auto-generate timestamp

// List of products (you can replace this with dynamic data from the database later)
const products = ref([
  { id: 1, name: 'Coke 500ml' },
  { id: 2, name: 'Dettol Soap' },
  { id: 3, name: 'Petroleum Jelly' },
]);

const addStock = () => {
  console.log({
    product: product.value,
    quantityAvailable: quantityAvailable.value,
    purchasingPrice: purchasingPrice.value,
    expiryDate: expiryDate.value,
    addedBy: addedBy.value,
    addedAt: addedAt.value,
  });

  // Redirect to stock list after adding
  router.push('/stocks');
};
</script>

<template>
  <div class="add-stock-container">
    <h3>Add New Stock</h3>
    <form class="add-stock-form" @submit.prevent="addStock">
      <div class="form-row">
        <!-- Product -->
        <div class="form-group">
          <label for="product">Product</label>
          <select
            id="product"
            class="form-control"
            v-model="product"
            required
          >
            <option value="" disabled>Select a product</option>
            <option v-for="prod in products" :key="prod.id" :value="prod.name">{{ prod.name }}</option>
          </select>
        </div>

        <!-- Quantity Available -->
        <div class="form-group">
          <label for="quantityAvailable">Quantity Available</label>
          <input
            type="number"
            id="quantityAvailable"
            class="form-control"
            v-model="quantityAvailable"
            required
            min="1"
          />
        </div>
      </div>

      <div class="form-row">
        <!-- Purchasing Price -->
        <div class="form-group">
          <label for="purchasingPrice">Purchasing Price</label>
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
        <div class="form-group">
          <label for="expiryDate">Expiry Date</label>
          <input
            type="date"
            id="expiryDate"
            class="form-control"
            v-model="expiryDate"
            required
          />
        </div>
      </div>

      <div class="form-row">
          <!-- Added By (Auto-generated as Admin for now) -->
        <div class="form-group">
          <label for="addedBy">Added By</label>
          <input
            type="text"
            id="addedBy"
            class="form-control"
            v-model="addedBy"
            disabled
          />
        </div>

        <!-- Added At (Auto-generated timestamp) -->
        <div class="form-group">
          <label for="addedAt">Added At</label>
          <input
            type="text"
            id="addedAt"
            class="form-control"
            v-model="addedAt"
            disabled
          />
        </div>
      </div>
      
      <!-- Submit Button -->
      <button type="submit" class="btn btn-primary">Add Stock</button>
    </form>
  </div>
</template>

<style scoped>
.add-stock-container {
  max-width: 800px;
  padding: 10px;
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
</style>
