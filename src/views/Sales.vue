<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '/home/ahmed/Documents/vue-projects/vue-2/src/stores/product.js';
import { useUserStore } from '/home/ahmed/Documents/vue-projects/vue-2/src/stores/user.js';
import { useSalesStore } from '@/stores/sales';

const userStore = useUserStore();
const productStore = useProductStore();
const salesStore = useSalesStore();
const router = useRouter();
const selectedProducts = ref([]);
const searchQuery = ref('');
const selectedPaymentMethod = ref('');
const selectedPaymentStatus = ref('');

// Fetch products and loggedIn user when the component is loaded
onMounted(async () => {
  try {
    await productStore.fetchProducts();
    await userStore.fetchLoggedInUser();
  } catch (error) {
    console.error('Error loading products:', error);
  }
});

// Filtered products based on search query
const filteredProducts = computed(() => {
  return productStore.products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Calculate total amount for the transaction
const totalAmount = computed(() => {
  return selectedProducts.value
    .reduce((acc, item) => acc + item.quantity * Number(item.product.price), 0)
    .toFixed(2);
});

// Add product to the selected list
const addProduct = (product) => {
  const existingProduct = selectedProducts.value.find(
    (item) => item.product.id === product.id
  );
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    selectedProducts.value.push({ product, quantity: 1 });
  }
};

// Update quantity of selected product
const updateQuantity = (index, newQuantity) => {
  if (newQuantity < 1) {
    newQuantity = 1;
  }
  selectedProducts.value[index].quantity = newQuantity;
};

const removeProduct = (index) => {
  selectedProducts.value.splice(index, 1);
};

const completeTransaction = async () => {
  const transaction = {
    total_amount: totalAmount.value,
    payment_method: selectedPaymentMethod.value,
    payment_status: selectedPaymentStatus.value,
    sold_by: userStore.username,
    sales_details: selectedProducts.value.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.quantity * item.product.price
    }))
  };

  await salesStore.createTransaction(transaction);
  selectedProducts.value = [];
};

const viewTransactions = () => {
  router.push('/transaction-list');
};
</script>

<template>
  <div class="sales-form-container">
    <h3>Sales Transaction</h3>

    <!-- Search and View Transactions -->
    <div class="search-and-button">
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for products..."
          class="search-input"
        />
      </div>
      <div class="view-button">
        <button @click="viewTransactions" class="view-btn">
          List Of Transactions
        </button>
      </div>
    </div>

    <!-- Product Selection -->
    <div class="product-selection">
      <h4>Select Products</h4>
      <div class="product-list">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          @click="addProduct(product)"
        >
          <h4>{{ product.name }}</h4>
          <p>Price: {{ Number(product.price).toFixed(2) }}</p>
        </div>
      </div>
    </div>

    <!-- Selected Products -->
    <div v-if="selectedProducts.length > 0" class="selected-products">
      <h3>Selected Products</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price (Tsh.)</th>
            <th>Total (Tsh.)</th>
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
                @change="updateQuantity(index, item.quantity)"
              />
            </td>
            <!-- <td>{{ Number(item.product.price).toFixed(2) }}</td> -->
            <td>{{ Number(item.product.price).toFixed(2) }}</td>
            <td>{{ (item.quantity * Number(item.product.price)).toFixed(2) }}</td>
            <td>
              <button class="remove-btn" @click="removeProduct(index)">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

      <!-- Payment Method, Status, and Sold By -->
    <div v-if="selectedProducts.length > 0" class="payment-info">
      <div class="payment-item">
        <label for="paymentMethod">Payment Method:</label>
        <select id="paymentMethod" v-model="selectedPaymentMethod">
          <option value="" disabled>Select a method</option>
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
          <option value="online">Online</option>
        </select>
      </div>
    
      <div class="payment-item">
        <label for="paymentStatus">Payment Status:</label>
        <select id="paymentStatus" v-model="selectedPaymentStatus">
          <option value="" disabled>Select a status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    
      <div class="payment-item">
        <label for="soldBy">Sold By: <br><span class="sold-by">{{ userStore.username }}</span></label>
      </div>
    </div>

    <!-- Total Amount -->
    <div v-if="selectedProducts.length > 0" class="total-amount">
      <h3>Total Amount: <strong>{{ totalAmount }}</strong> Tsh.</h3>
    </div>

    <!-- Complete Transaction -->
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
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  width: 150px;
  border: 1px solid #ecf0f1;
  text-transform: capitalize;
}

.product-card:hover {
  background-color: rgba(34, 49, 100, 0.4);
  border: 1px solid #34495e;
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
  font-weight: bold;
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

.payment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}

.payment-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 150px;
}

.payment-item label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.payment-item select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.sold-by {
  padding: 8px;
  border-radius: 5px;
  font-size: 1.1rem;
  text-align: left;
  color: #222;
  text-transform: capitalize;
}
</style>
