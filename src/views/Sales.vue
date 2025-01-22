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

// Display only 4 products, other products will be displayed when searched
const limitedProducts = computed(() => {
  return searchQuery.value? filteredProducts.value : filteredProducts.value.slice(0, 4);
})

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
  <div class="card p-3">
    <h3 class="mb-4"><i class="bi bi-cash-coin me-2"></i>Sales Transaction</h3>

    <!-- Search and Button Section -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="input-group w-50">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for products..."
          class="form-control"
        />
      </div>
      <button @click="viewTransactions" class="btn btn-primary btn-md">
        <i class="bi bi-clipboard me-2"></i>List Of Transactions
      </button>
    </div>

    <!-- Product Selection -->
    <div class="mb-4">
      <h4 class="text-secondary">Select Products</h4>
      <!-- Bootstrap Alert -->
        <div
          v-if="productStore.showAlert"
          class="alert alert-dismissible"
          :class="`alert-${productStore.alertType}`"
          role="alert"
        >
          {{ productStore.alertMessage }}
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="productStore.showAlert = false"
          ></button>
        </div>

      <div class="row g-3 mt-2">
        <div
          v-for="product in limitedProducts"
          :key="product.id"
          class="col-6 col-md-4 col-lg-3"
        >
          <div
            class="card text-center h-100 shadow-sm text-capitalize"
            id="product-card"
            @click="addProduct(product)"
          >
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text">Price: {{ Number(product.price).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Products -->
    <div v-if="selectedProducts.length > 0" class="mb-4">
      <h4 class="text-secondary">Selected Products</h4>
      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price (Tsh.)</th>
            <th>Total (Tsh.)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in selectedProducts" :key="item.product.id" class="text-capitalize">
            <td>{{ item.product.name }}</td>
            <td>
              <input
                type="number"
                v-model="item.quantity"
                min="1"
                @change="updateQuantity(index, item.quantity)"
                class="form-control"
              />
            </td>
            <td>{{ Number(item.product.price).toFixed(2) }}</td>
            <td>{{ (item.quantity * Number(item.product.price)).toFixed(2) }}</td>
            <td>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="removeProduct(index)"
              >
              <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payment Information -->
    <div v-if="selectedProducts.length > 0" class="row g-3 mb-4">
      <div class="col-md-4">
        <label for="paymentMethod" class="form-label"><i class="bi bi-wallet2 me-2"></i>Payment Method</label>
        <select id="paymentMethod" v-model="selectedPaymentMethod" class="form-select">
          <option value="" disabled>Select a method</option>
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
          <option value="online">Online</option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="paymentStatus" class="form-label"><i class="bi bi-info-circle me-2"></i>Payment Status</label>
        <select id="paymentStatus" v-model="selectedPaymentStatus" class="form-select">
          <option value="" disabled>Select a status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="soldBy" class="form-label"><i class="bi bi-person me-2"></i>Sold By</label>
        <p class="form-control bg-light">{{ userStore.username }}</p>
      </div>
    </div>

    <!-- Total Amount & Complete Transaction -->
    <div class="d-flex justify-content-between mb-2">
          <h4 class="d-flex" v-if="selectedProducts.length > 0">
            Total Amount:<span class="text-success fw-bold ms-1">{{ totalAmount }} Tsh.</span>
          </h4>

          <button @click="completeTransaction" class="btn btn-success btn-md w-50" v-if="selectedProducts.length > 0">
            <i class="bi bi-save me-2"></i>Complete Transaction
          </button>
    </div> 
  </div>
</template>

<style scoped>

#product-card:hover {
  border-color: #007bff;
}
</style>



