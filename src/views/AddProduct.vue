<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductStore } from '@/stores/product';

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();

const name = ref('');
const category = ref('');
const price = ref('');
const description = ref('');
const status = ref('');
const categories = ref([]);
const statuses = ref(['Available', 'Not Available']);

// Get categories and fetch product when editing
onMounted(async () => {
  categories.value = await productStore.fetchCategories();

  if (route.params.id) {
    await productStore.fetchProductById(route.params.id);
    const product = productStore.currentProduct;
    if (product) {
      name.value = product.name;
      category.value = product.category;
      price.value = product.price;
      description.value = product.description;
      status.value = product.status;
    }
  }
});

const saveProduct = async () => {
  const productData = {
    id: route.params.id, // Use this when you edit
    name: name.value,
    category: category.value,
    price: price.value,
    description: description.value,
    status: status.value,
  };

  await productStore.saveProduct(productData);
  router.push('/products');
};

const back = () => {
  router.push('/products');
};
</script>

<template>
  <div class="add-product-container">
    <h3>{{ route.params.id ? 'Edit Product Details' : 'Add New Product' }}</h3>
    <form class="add-product-form" @submit.prevent="saveProduct">
      <div class="form-row">
        <!-- Name -->
        <div class="form-group">
          <label for="name">Product Name</label>
          <input
            type="text"
            id="name"
            class="form-control"
            v-model="name"
            required
          />
        </div>

        <!-- Category -->
        <div class="form-group">
          <label for="category">Category</label>
          <select
            id="category"
            class="form-control"
            v-model="category"
            required
          >
            <option value="" disabled>Select a category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.category">{{ cat.category }}</option>
          </select>
        </div>

        <!-- Price -->
        <div class="form-group">
          <label for="price">Price</label>
          <input
            type="number"
            id="price"
            class="form-control"
            v-model="price"
            required
            min="0"
          />
        </div>
      </div>

      <div class="form-row">
        <!-- Status -->
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" class="form-control" v-model="status" required>
            <option value="" disabled>Select a status</option>
            <option v-for="stat in statuses" :key="stat" :value="stat">{{ stat }}</option>
          </select>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            class="form-control"
            v-model="description"
            rows="1"
            placeholder="Write anything about product..."
            required
          ></textarea>
        </div>
      </div>

      <div class="form-row">
        <button type="button" class="btn btn-warning" @click="back">Cancel</button>
        <button type="submit" class="btn btn-primary">
          {{ route.params.id ? 'Save Changes' : 'Add Product' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-product-container {
  width: 100%;
  padding: 13px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}

.add-product-form .form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.add-product-form .form-group {
  flex: 1;
}

.add-product-form label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.add-product-form .form-control {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-product-form .btn {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 18px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.add-product-form .btn:hover {
  background-color: #218838;
}

.add-product-form .btn-warning {
  background-color: rgb(210, 30, 45);
}

.add-product-form .btn-warning:hover {
  background-color: rgb(168, 20, 32);
}
</style>
