<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';


const products = ref([
  { id: 1, name: 'Coke 500mls', status: 'Available', price: '1,200' },
  { id: 2, name: 'Dettol Soap', status: 'Not Available', price: '1,500' },
  { id: 3, name: 'Petroleum Jelly S', status: 'Available', price: '3,000' },
]);

const searchQuery = ref('');
const router = useRouter();

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return products.value.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const addNewProduct = () => {
  router.push('/add-product');
};

const deleteProduct = (id) => {
  products.value = products.value.filter((product) => product.id !== id);
};

const updateProduct = (id) => {
  alert(`Update product with ID: ${id}`);
};
</script>

<template>
  <div class="products-container">
    <div class="header">
      <h3>List of Products</h3>
      <input
        type="text"
        class="search-box"
        placeholder="Search products..."
        v-model="searchQuery"
      />
      <button class="btn btn-primary" @click="addNewProduct">Add New Product</button>
    </div>

    <table class="products-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Status</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.status }}</td>
          <td>{{ product.price }}</td>
          <td>
            <button class="btn btn-success btn-sm" @click="updateProduct(product.id)">
              Update
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteProduct(product.id)">
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="filteredProducts.length === 0">
          <td colspan="5" class="no-results">No products found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.products-container {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
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

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.products-table th {
  background-color: #2c3e50;
  color: white;
}

.products-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.products-table tr:hover {
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

.btn-success {
  background-color: #28a745;
  color: white;
  margin-right: 5px;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
