<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "/home/ahmed/Documents/vue-projects/vue-2/src/stores/product.js";
import { useDashboardStore } from "@/stores/dashboard";

const dashboardStore = useDashboardStore();
const productStore = useProductStore();

const currentPage = ref(1);
const itemsPerPage = ref(8);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return productStore.filteredProducts.slice(start, end);
});

const closeAlert = () => {
  productStore.showAlert = false;
};

const totalPages = computed(() =>
  Math.ceil(productStore.filteredProducts.length / itemsPerPage.value)
);

const getStatusClass = (status) => {
  return status === "Available"
    ? "text-success fw-bold"
    : "text-danger fw-bold";
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(async () => {
  await dashboardStore.initializeDashboard();
  await productStore.fetchProducts();
  await productStore.fetchAvailableProducts();
});
</script>

<template>
  <div class="card p-3">
    <h3 class="mb-3"><i class="bi bi-clipboard-check me-2"></i>Available Products</h3>
    <!--  Search and Button Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="input-group w-50">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input
          type="text"
          class="form-control"
          placeholder="Search product..."
          v-model="productStore.searchQuery"
        />
      </div>
    </div>
    <!-- Totals -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h6 class="text-success">
        <i class="bi bi-check2-circle me-2"></i>Available Products:
        {{ productStore.availableProducts.length }}
      </h6>
      <h6 class="text-secondary">
        <i class="bi bi-list-task me-2"></i>Total Products:
        {{ dashboardStore.totals.totalProducts }}
      </h6>
    </div>
    <!-- Products table -->
    <table class="table table-striped text-capitalize fs-5">
      <thead class="table-dark">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in productStore.availableProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.price }}</td>
          <td :class="getStatusClass(product.status)">
            {{ product.status }}
          </td>
        </tr>
        <tr v-if="productStore.filteredProducts.length === 0">
          <td colspan="5" class="text-center text-muted">
            <i class="bi bi-question-circle me-2"></i>No products found.
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <div class="d-flex justify-content-center gap-2 mb-1">
      <button
        class="btn btn-secondary"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <i class="bi bi-chevron-bar-left me-1"></i>Previous
      </button>
      <button
        class="btn btn-secondary"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next<i class="bi bi-chevron-bar-right ms-1"></i>
      </button>
    </div>
  </div>
</template>
