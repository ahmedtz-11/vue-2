<script setup>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '/home/ahmed/Documents/vue-projects/vue-2/src/stores/product.js';

const productStore = useProductStore();
const currentPage = ref(1);
const itemsPerPage = ref(8);
const router = useRouter();

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return productStore.filteredProducts.slice(start, end);
});


const totalPages = computed(() => Math.ceil(productStore.filteredProducts.length / itemsPerPage.value));

const addNewProduct = () => {
  router.push('/add-product');
};

const confirmDelete = (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    productStore.deleteProduct(id);
  }
};

const updateProduct = (id) => {
  router.push(`/add-product/${id}`);
};

const productStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'available':
      return 'available';
    case 'not available':
      return 'not-available';
    default:
      return '';
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(async () => {
  await productStore.fetchProducts();
});

</script>

<template>
  <div class="products-container">
    <div class="header">
      <h3>List of Products</h3>
      <input
        type="text"
        class="search-box"
        placeholder="Search products..."
        v-model="productStore.searchQuery"
      />
      <button class="btn btn-primary" @click="addNewProduct">Add New Product</button>
    </div>

    <table class="products-table">
      <thead>
        <tr>
          <th>ID.</th>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Status</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in paginatedProducts" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.category }}</td>
          <td :class="productStatusClass(product.status)">{{ product.status }}</td>
          <td>{{ product.price }}</td>
          <td>
            <button class="btn btn-success btn-sm" @click="updateProduct(product.id)">
              Edit
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmDelete(product.id)">
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="productStore.filteredProducts.length === 0">
          <td colspan="7" class="no-results">No products found.</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Previous</button>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Next</button>
    </div>
  </div>
</template>


<style scoped>
.products-container {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
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

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.products-table th {
  background-color: #2c3e50;
  color: white;
  font-weight: bolder;
}

.products-table tr:hover {
  background-color: #ddd;
}

.no-results {
  text-align: center;
  color: #999;
  font-style: italic;
}

.available, .not-available {
  font-weight: bold;
  text-transform: uppercase;
}

.available{
  color: #27ae60;
}

.not-available {
  color: #e70808;
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

.btn-success {
  background-color: rgba(0, 0, 0, 0);
  color: #28a745;
  margin-right: 5px;
  border: 1px solid #28a745;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: rgba(0, 0, 0, 0);
  color: #dc3545;
  border: 1px solid #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 15px;
}
.pagination button {
  padding: 5px 10px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 6px;
}

.pagination button:hover {
  background-color: #f0f0f0;
  color: #007bff;
}

.pagination button.active:hover {
  background-color: #f0f0f0;
  color: #007bff;
}
</style>
