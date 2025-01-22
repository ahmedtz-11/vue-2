<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStockStore } from '/home/ahmed/Documents/vue-projects/vue-2/src/stores/stock.js';

const stockStore = useStockStore();
const router = useRouter();
const currentPage = ref(1);
const pageSize = 5;

const paginatedStocks = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return stockStore.filteredStocks.slice(start, end);
});

const totalPages = computed(() => Math.ceil(stockStore.filteredStocks.length / pageSize));

// const goToPage = (page) => {
//   if (page >= 1 && page <= totalPages.value) {
//     currentPage.value = page;
//   }
// };

const addNewStock = () => {
  router.push('/add-stock');
};

const deleteStock = async (id) => {
  const confirmDelete = confirm('Are you sure you want to delete this stock?');
  if (confirmDelete) {
    await stockStore.deleteStock(id);
  }
};

onMounted(() => {
  stockStore.fetchStocks();
});
</script>


<template>
  <div class="card p-3">
      <h3 class="mb-3"><i class="bi-cart4 me-2"></i>List of Stocks</h3>

      <!--  Search and Button Section -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="input-group w-50">
          <span class="input-group-text"><i class="bi bi-search"></i></span>        
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search stock..." 
            v-model="stockStore.searchQuery" 
          />
        </div>
        <button class="btn btn-primary btn-md" @click="addNewStock">
            <i class="bi bi-cart-plus me-2"></i>Add New Stock
        </button>
      </div>

    <!-- Stocks Table -->
    <table class="table table-striped table-hover text-capitalize">
      <thead class="table-dark">
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Purchasing Price</th>
          <th>Expiry Date</th>
          <th>Added By</th>
          <th>Added At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in paginatedStocks" :key="stock.id">
          <td>{{ stock.product_name }}</td>
          <td>{{ stock.quantity }}</td>
          <td>{{ stock.purchasing_price }}</td>
          <td>{{ stock.expiry_date }}</td>
          <td>{{ stock.added_by }}</td>
          <td>{{ stock.added_at }}</td>
          <td>
            <button class="btn btn-outline-success btn-sm me-2" @click="editStock(stock.id)">
              <i class="bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteStock(stock.id)">
              <i class="bi-trash"></i>
            </button>
          </td>
        </tr>
        <tr v-if="paginatedStocks.length === 0">
          <td colspan="7" class="text-center text-muted">No stocks found.</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="d-flex justify-content-center align-items-center mt-3">
        <button 
          class="btn btn-secondary me-1" 
          @click="currentPage > 1 && currentPage--" 
          :disabled="currentPage === 1">
          <i class="bi bi-chevron-bar-left"></i> Previous
        </button>

        <button 
          class="btn btn-secondary" 
          @click="currentPage < totalPages && currentPage++" 
          :disabled="currentPage === totalPages">
          Next <i class="bi bi-chevron-bar-right"></i>
        </button>
    </div>
  </div>
</template>
