<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const name = ref('');
const category = ref('');
const price = ref('');
const description = ref('');
const status = ref('');

const categories = ref(['Food', 'Drinks', 'Cosmetics', 'Diary', 'Cleaning', 'Detergent']);
const statuses = ref(['Available', 'Not Available']);


const loadProduct = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/vue-api/products/getSingleProduct.php?id=${id}`);
    const product = await response.json();
    name.value = product.name;
    category.value = product.category;
    price.value = product.price;
    description.value = product.description;
    status.value = product.status;
  } catch (error) {
    console.error('Error loading product:', error);
  }
};

onMounted(() => {
  if (route.params.id) {
    loadProduct(route.params.id);
  }
});

const saveProduct = async () => {
  const productData = {
    id: route.params.id, // Use this for updates
    name: name.value,
    category: category.value,
    price: price.value,
    description: description.value,
    status: status.value,
  };

  const endpoint = route.params.id
    ? 'http://localhost:8080/vue-api/products/updateProduct.php'
    : 'http://localhost:8080/vue-api/products/addProduct.php';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const result = await response.json();
    if (result.message) {
      alert(result.message);
      router.push('/products');
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Error saving product:', error);
  }
};

const back = () => {
  router.push('/products');
}

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
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
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
          placeholder="write anything about product...."
          required
        ></textarea>
        </div>
      </div>
      

      <div class="form-row">
        <button type="submit" class="btn btn-warning" @click="back">Cancel</button>

          <!-- Add/Update Button -->
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
