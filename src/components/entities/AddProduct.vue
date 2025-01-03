<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref('');
const category = ref('');
const price = ref('');
const description = ref('');
const status = ref('');

const categories = ref(['Food', 'Drinks', 'Cosmetics', 'Diary']);
const statuses = ref(['Available', 'Not Available']);

const addProduct = () => {
  console.log({
    name: name.value,
    category: category.value,
    price: price.value,
    description: description.value,
    status: status.value,
  });

  router.push('/products');
};
</script>

<template>
  <div class="add-product-container">
    <h3>Add New Product</h3>
    <form class="add-product-form" @submit.prevent="addProduct">
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
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>

      <div class="form-row">
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

        <!-- Status -->
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" class="form-control" v-model="status" required>
            <option value="" disabled>Select a status</option>
            <option v-for="stat in statuses" :key="stat" :value="stat">{{ stat }}</option>
          </select>
        </div>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          class="form-control"
          v-model="description"
          rows="2"
          placeholder="write anything about product...."
          required
        ></textarea>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="btn btn-primary">Add Product</button>
    </form>
  </div>
</template>

<style scoped>
.add-product-container {
  max-width: 800px;
  padding: 10px;
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
</style>
