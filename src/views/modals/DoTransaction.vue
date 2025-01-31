<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/stores/product";
import { useUserStore } from "@/stores/user";
import { useSalesStore } from "@/stores/sales";
import Alert from "@/components/Alert.vue";

const emit = defineEmits(["close"]);
const productStore = useProductStore();
const userStore = useUserStore();
const salesStore = useSalesStore();

const currentPage = ref(1);
const itemsPerPage = ref(6);
const step = ref(1);
const selectedProducts = ref([]);
const selectedPaymentMethod = ref("");
const selectedPaymentStatus = ref("");

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return productStore.filteredProducts.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(productStore.filteredProducts.length / itemsPerPage.value)
);

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

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
  if (newQuantity < 1) newQuantity = 1;
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
    sales_details: selectedProducts.value.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.quantity * item.product.price,
    })),
  };

  console.log("Transaction:", transaction);
  await salesStore.createTransaction(transaction);
  selectedProducts.value = [];
  emit("close");
};

const nextStep = () => step.value++;
const prevStep = () => step.value--;
const closeModal = () => emit("close");

// Fetch products and loggedIn user when the component is loaded
onMounted(async () => {
  await productStore.fetchProducts();
  await userStore.fetchLoggedInUser();
});
</script>

<template>
  <teleport to="body">
    <div
      class="modal fade show d-flex align-items-center justify-content-center fs-5"
      style="display: block; background: rgba(0, 0, 0, 0.7)"
    >
      <div class="card p-3 w-50 w-md-75 w-lg-50 overflow-auto">
        <div class="d-flex justify-content-between mb-2">
          <h3>Transaction</h3>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <Alert
          :message="productStore.alertMessage"
          :type="productStore.alertType"
          :show="productStore.showAlert"
          @close="productStore.showAlert = false"
        />

        <!-- Step 1: Search and Product Selection -->
        <div v-if="step === 1">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="text-secondary">Select Products</h5>
            <div class="input-group w-50">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input
                type="text"
                v-model="productStore.searchQuery"
                placeholder="Search for products..."
                class="form-control"
              />
            </div>
          </div>

          <div class="row g-3">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              class="col-md-4"
            >
              <div
                class="card text-center text-capitalize"
                id="product-card"
                @click="addProduct(product)"
              >
                <div class="card-body">
                  <h5>{{ product.name }}</h5>
                  <p>Price: {{ Number(product.price).toFixed(2) }}</p>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-center mt-2">
              <div class="btn-group">
                <button
                  class="btn btn-outline-secondary"
                  :disabled="currentPage === 1"
                  @click="changePage(currentPage - 1)"
                  style="border: none !important"
                >
                  <i class="bi bi-caret-left-fill"></i>
                </button>
                <button
                  class="btn btn-outline-secondary"
                  :disabled="currentPage === totalPages"
                  @click="changePage(currentPage + 1)"
                  style="border: none !important"
                >
                  <i class="bi bi-caret-right-fill"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="text-end">
            <button
              class="btn btn-dark mt-3"
              @click="nextStep"
              :disabled="selectedProducts.length == 0"
            >
              Next<i class="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>

        <!-- Step 2: Review & Adjust Quantity -->
        <div v-if="step === 2">
          <h5 class="text-secondary">Adjust Quantity</h5>
          <table class="table table-striped text-capitalize fs-6">
            <thead class="table-dark">
              <tr class="fw-bold">
                <th>Product</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in selectedProducts"
                :key="item.product.id"
              >
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
                <td class="ms-3">
                  {{ (item.quantity * Number(item.product.price)).toFixed(2) }}
                </td>
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
          <div class="d-flex justify-content-between">
            <button class="btn btn-secondary" @click="prevStep">
              <i class="bi bi-arrow-left me-2"></i>Back
            </button>
            <button
              class="btn btn-dark"
              @click="nextStep"
              :disabled="selectedProducts.length == 0"
            >
              Next<i class="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>

        <!-- Step 3: Payment & Confirmation -->
        <div v-if="step === 3">
          <h5 class="text-secondary">Payment Information</h5>
          <!-- Payment Method -->
          <div class="mb-3">
            <label for="selectedPaymentMethod" class="form-label fs-6">
              <i class="bi bi-wallet2 me-2"></i>Payment Method
            </label>
            <select
              v-model="selectedPaymentMethod"
              class="form-select"
              id="selectedPaymentMethod"
            >
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
              <option value="online">Online</option>
            </select>
          </div>
          <!-- Payment Status -->
          <div class="mb-3">
            <label for="selectedPaymentStatus" class="form-label fs-6">
              <i class="bi bi-info-circle me-2"></i>Payment Status
            </label>
            <select
              v-model="selectedPaymentStatus"
              class="form-select"
              id="selectedPaymentStatus"
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <!-- Sold By -->
          <div class="mb-2">
            <label class="form-label fs-6"
              ><i class="bi bi-person me-2"></i>Sold By</label
            >
            <p class="form-control bg-light">{{ userStore.username }}</p>
          </div>

          <!-- Total Amount & Complete Transaction -->
          <h4 class="mt-3">
            Total Amount:
            <span class="text-success fw-bold ms-1"
              >{{ totalAmount }} Tsh.</span
            >
          </h4>
          <div class="d-flex justify-content-between">
            <button class="btn btn-secondary" @click="prevStep">
              <i class="bi bi-arrow-left me-2"></i>Back
            </button>
            <button class="btn btn-success" @click="completeTransaction">
              <i class="bi bi-save me-2"></i>Complete Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
#product-card:hover {
  border-color: #171818;
  cursor: pointer;
}

.modal {
  font-family: "Nunito Sans", serif;
}
</style>
