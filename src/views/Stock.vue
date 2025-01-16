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

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

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
  <div class="stock-container">
    <div class="header">
      <h3>List of Stocks</h3>
      <input
        type="text"
        class="search-box"
        placeholder="Search stock..."
        v-model="stockStore.searchQuery"
      />
      <button class="btn btn-primary" @click="addNewStock">Add New Stock</button>
    </div>

    <table class="stock-table">
      <thead>
        <tr>
          <th>#</th>
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
          <td>{{ stock.id }}</td>
          <td>{{ stock.product_name }}</td>
          <td>{{ stock.quantity }}</td>
          <td>{{ stock.purchasing_price }}</td>
          <td>{{ stock.expiry_date }}</td>
          <td>{{ stock.added_by }}</td>
          <td>{{ stock.added_at }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editStock(stock.id)">
              Edit
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteStock(stock.id)">
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="paginatedStocks.length === 0">
          <td colspan="8" class="no-results">No stocks found.</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button class="btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
        Previous
      </button>
      <button
        v-for="page in pageNumbers"
        :key="page"
        :class="['btn', { 'btn-active': currentPage === page }]"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button class="btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.stock-container {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-box {
  padding: 7px;
  font-size: 16px;
  width: 270px;
  margin-right: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
}

.stock-table th,
.stock-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.stock-table th {
  background-color: #2c3e50;
  color: white;
  font-weight: bolder;
}

.stock-table tr:hover {
  background-color: #ddd;
}

.no-results {
  text-align: center;
  color: #999;
  font-style: italic;
}

.btn {
  padding: 8px 12px;
  margin: 0 2px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-warning {
  background-color: #28a745;
  color: white;
  margin-right: 5px;
}

.btn-warning:hover {
  background-color: #218838;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.pagination {
  margin-top: 20px;
  text-align: center;
  justify-content: center;
}

.pagination .btn-active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.pagination .btn:hover {
  background-color: #f0f0f0;
  color: #007bff;
}
</style>
