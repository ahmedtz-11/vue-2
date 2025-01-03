<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

const stocks = ref([
  { 
    id: 1, 
    product: 'Coke 500mls', 
    quantity: 50, 
    purchasingPrice: 1200, 
    expiryDate: '2025-01-01', 
    addedBy: 'admin', 
    addedAt: '2025-01-05 14:00' 
  },
  { 
    id: 2, 
    product: 'Dettol Soap', 
    quantity: 100, 
    purchasingPrice: 1500, 
    expiryDate: '2025-03-15', 
    addedBy: 'manager', 
    addedAt: '2025-01-06 10:30' 
  },
  { 
    id: 3, 
    product: 'Petroleum Jelly S', 
    quantity: 75, 
    purchasingPrice: 3000, 
    expiryDate: '2025-02-20', 
    addedBy: 'admin', 
    addedAt: '2025-01-07 12:45' 
  }
]);

const searchQuery = ref('');
const router = useRouter();

const filteredStocks = computed(() => {
  if (!searchQuery.value) return stocks.value;
  return stocks.value.filter((stock) =>
    stock.product.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Navigate to the Add New Stock page
const addNewStock = () => {
  router.push('/add-stock');
};

// Delete a stock item
const deleteStock = (id) => {
  stocks.value = stocks.value.filter((stock) => stock.id !== id);
};

// Edit stock item (functionality to be added later)
const editStock = (id) => {
  alert(`Edit stock with ID: ${id}`);
};
</script>

<template>
  <div class="stock-container">
    <div class="header">
      <h3>List of Stocks</h3>
      <input
        type="text"
        class="search-box"
        placeholder="Search stock..."
        v-model="searchQuery"
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
        <tr v-for="stock in filteredStocks" :key="stock.id">
          <td>{{ stock.id }}</td>
          <td>{{ stock.product }}</td>
          <td>{{ stock.quantity }}</td>
          <td>{{ stock.purchasingPrice }}</td>
          <td>{{ stock.expiryDate }}</td>
          <td>{{ stock.addedBy }}</td>
          <td>{{ stock.addedAt }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editStock(stock.id)">
              Edit
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteStock(stock.id)">
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="filteredStocks.length === 0">
          <td colspan="8" class="no-results">No stocks found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.stock-container {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
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
  border: 1px solid #ddd;
}

.stock-table th {
  background-color: #2c3e50;
  color: white;
}

.stock-table tr:nth-child(even) {
  background-color: #f2f2f2;
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
  background-color: #ffc107;
  color: white;
  margin-right: 5px;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
