<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // Make sure to import useRouter for navigation

const router = useRouter();  // Initialize router

const products = ref([
  { id: 1, name: 'Coke 500ml', price: 1000 },
  { id: 2, name: 'Dettol Soap', price: 1500 },
  { id: 3, name: 'Petroleum Jelly', price: 2500 },
  { id: 4, name: 'Tissue Paper', price: 1500 },
  { id: 5, name: 'Colgate 400g', price: 3000 },
]);

const selectedProducts = ref([]);

const searchQuery = ref('');

const filteredProducts = computed(() => {
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalAmount = computed(() => {
  return selectedProducts.value.reduce((acc, item) => {
    return acc + (item.quantity * item.product.price);
  }, 0).toFixed(2);
});

const addProduct = (product) => {
  const existingProduct = selectedProducts.value.find(item => item.product.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    selectedProducts.value.push({ product, quantity: 1 });
  }
};

const updateQuantity = (index, newQuantity) => {
  selectedProducts.value[index].quantity = newQuantity;
};

const removeProduct = (index) => {
  selectedProducts.value.splice(index, 1);
};

const completeTransaction = () => {
  console.log('Transaction completed:', selectedProducts.value);
  // Send data to DB here

  selectedProducts.value = [];
};

const viewTransactions = () => {
  router.push('/transaction-list'); // Navigate to transaction list
};
</script>

<template>
  <div class="sales-form-container">
    <h3>Sales Transaction</h3>
    <!-- Container for both search input and button -->
    <div class="search-and-button">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search for products..." 
          class="search-input"
        />
      </div>

      <!-- Button to view transactions -->
      <div class="view-button">
        <button @click="viewTransactions" class="view-btn">List Of Transactions</button>
      </div>
    </div>

    <div class="product-selection">
      <h4>Select Products</h4>
      <div class="product-list">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="product-card" 
          @click="addProduct(product)">
          <h4>{{ product.name }}</h4>
          <p>Price: {{ product.price }}</p>
        </div>
      </div>
    </div>

    <!-- Selected products and quantity -->
    <div v-if="selectedProducts.length > 0" class="selected-products">
      <h3>Selected Products</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price(tsh.)</th>
            <th>Total(tsh.)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in selectedProducts" :key="item.product.id">
            <td>{{ item.product.name }}</td>
            <td>
              <input 
                type="number" 
                v-model="item.quantity" 
                min="1" 
                @change="updateQuantity(index, item.quantity)" />
            </td>
            <td>{{ item.product.price.toFixed(2) }}</td>
            <td>{{ (item.quantity * item.product.price).toFixed(2) }}</td>
            <td>
              <button class="remove-btn" @click="removeProduct(index)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Total amount -->
    <div v-if="selectedProducts.length > 0" class="total-amount">
      <h3>Total Amount: <strong>{{ totalAmount }}</strong> Tsh.</h3>
    </div>

    <!-- Complete Button -->
    <div v-if="selectedProducts.length > 0" class="complete-button">
      <button @click="completeTransaction">Complete Transaction</button>
    </div>
  </div>
</template>

<style scoped>
.sales-form-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.search-and-button {
  display: flex;
  gap: 15px;
  align-items: center; 
}

.view-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.view-btn:hover {
  background-color: #0056b3;
}

.search-container {
  flex-grow: 1;
}

.search-input {
  padding: 8px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.product-selection {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
}

.product-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.product-card {
  background-color: #ecf0f1;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  width: 150px;
}

.product-card:hover {
  background-color: #bdc3c7;
}

.selected-products table {
  width: 100%;
  border-collapse: collapse;
}

.selected-products table th, 
.selected-products table td {
  padding: 12px;
  text-align: left;
}

.selected-products table th {
  background-color: #34495e;
  color: white;
}

.selected-products table td input {
  width: 50px;
  padding: 5px;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: bold;
}

.complete-button {
  text-align: center;
  margin-top: 5px;
}

.complete-button button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
}

.complete-button button:hover {
  background-color: #218838;
}

.remove-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #c0392b;
}
</style>
