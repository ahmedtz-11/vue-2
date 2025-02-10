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

const totalPages = computed(() =>
  Math.ceil(productStore.filteredProducts.length / itemsPerPage.value)
);

// const getStatusClass = (status) => {
//   return status === "Available"
//     ? "bg-success"
//     : "bg-danger";
// };

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(async () => {
  await dashboardStore.initializeDashboard();
  await productStore.fetchProducts();
  await productStore.fetchUnavailableProducts();
});
</script>

<template>
  <div class="card p-3">
    
    <!--  Search and Button Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0">
      <i class="bi bi-clipboard-x me-2"></i>Not Available Products
    </h3>
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
    
    <!-- Products table -->
    <div class="table-responsive">
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
          <tr
            v-for="product in productStore.unavailableProducts"
            :key="product.id"
          >
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ product.category_name }}</td>
            <td>{{ product.price }}</td>
            <td>
              <span
                class="badge"
                :class="
                  product.product_status === 'Available' ? 'bg-success' : 'bg-danger'
                "
                >{{ product.product_status }}</span
              >
            </td>
          </tr>
          <tr v-if="productStore.filteredProducts.length === 0">
            <td colspan="5" class="text-center text-muted">
              <i class="bi bi-question-circle me-2"></i>No products found.
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Totals -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h6 class="text-danger">
        <i class="bi bi-ban me-2"></i>Unavailable Products:
        {{ productStore.unavailableProducts.length }}
      </h6>
    </div>
    </div>

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
