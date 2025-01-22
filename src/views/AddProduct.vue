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
  <div class="card p-3">
    <h3 class="mb-3">
      <i class="bi bi-pencil-square me-2"></i>
      {{ $route.params.id ? "Edit Product Details" : "Add New Product" }}
    </h3>
    <form @submit.prevent="saveProduct">
      
       <div class="row mb-3">

            <div class="col-lg-6">
              <label for="name" class="form-label">
                <i class="bi bi-box me-2"></i>Product Name
              </label>
              <input
                type="text"
                id="name"
                class="form-control"
                v-model="name"
                required
              />
            </div>
              
          
            <div class="col-lg-6">
                <label for="category" class="form-label">
                  <i class="bi bi-card-list me-2"></i>Category
                </label>
                <select
                  id="category"
                  class="form-select"
                  v-model="category"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.category"
                  >
                    {{ cat.category }}
                  </option>
                </select>
            </div>
       </div>

      <div class="row mb-3">
          <div class="col-lg-6">
              
              <label for="price" class="form-label">
                <i class="bi bi-currency-dollar me-2"></i>Price
              </label>
              <input
                type="number"
                id="price"
                class="form-control"
                v-model="price"
                required
                min="0"
              />
          </div>

          
          <div class="col-lg-6">
            <label for="status" class="form-label">
              <i class="bi bi-info-circle me-2"></i>Status
            </label>
            <select
              id="status"
              class="form-select"
              v-model="status"
              required
            >
              <option value="" disabled>Select a status</option>
              <option v-for="stat in statuses" :key="stat" :value="stat">
                {{ stat }}
              </option>
            </select>
          </div> 
      </div>

      
      <div class="mb-3">
        <label for="description" class="form-label">
          <i class="bi bi-chat-dots me-2"></i>Description
        </label>
        <textarea
          id="description"
          class="form-control"
          v-model="description"
          rows="2"
          placeholder="Write anything about the product..."
          required
        ></textarea>
      </div>

      
      <div class="d-flex justify-content-between mt-4">
        <button type="button" class="btn btn-danger d-flex align-items-center" @click="back">
          <i class="bi bi-arrow-left-circle me-2"></i>Cancel
        </button>
        <button type="submit" class="btn btn-success d-flex align-items-center">
          <i class="bi bi-save me-2"></i>
          {{ $route.params.id ? "Save Changes" : "Add Product" }}
        </button>
      </div>
    </form>
  </div>
</template>

