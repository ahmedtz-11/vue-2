<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductStore } from '@/stores/product';
import Alert from "@/components/Alert.vue";

const router = useRouter();
const route = useRoute();
const productStore = useProductStore();

const category = ref('');
const categories = ref([]);

onMounted(async () => {
    categories.value = await productStore.fetchCategories();
}
);

const saveCategory = async () => {
  const categoryData = {
    category: category.value,
  };

  await productStore.newCategory(categoryData);
//   router.push('/products');
};

const back = () => {
  router.push('/products');
};
</script>

<template>
  <Alert
      :message="productStore.alertMessage"
      :type="productStore.alertType"
      :show="productStore.showAlert"
      @close="productStore.showAlert = false"
    />
  <div class="card shadow p-4">
    <h3 class="mb-4">
      <i class="bi bi-card-list me-2"></i>
      New Category
    </h3>

    <form @submit.prevent="saveCategory">
       <div class="row mb-3">
          <!-- Category Name -->
              <label for="category" class="form-label">
                <i class="bi bi-tags me-2"></i>Category
              </label>
              <input
                type="text"
                id="category"
                class="form-control w-50"
                v-model="category"
                required
              />   
       </div>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-between mt-4">
        <button type="submit" class="btn btn-success d-flex align-items-center">
          <i class="bi bi-save me-2"></i>
          Save Category
        </button>
      </div>
    </form>
  </div>
</template>

