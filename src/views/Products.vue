<!-- <script setup>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '/home/ahmed/Documents/vue-projects/vue-2/src/stores/product.js';
import { useDashboardStore } from '@/stores/dashboard';


const dashboardStore = useDashboardStore();
const productStore = useProductStore();
const currentPage = ref(1);
const itemsPerPage = ref(8);
const router = useRouter();

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return productStore.filteredProducts.slice(start, end);
});

const closeAlert = () => {
  productStore.showAlert = false;
};

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

const getStatusClass = (status) => {
      return status === "Available"
        ? "text-success fw-bold"
        : "text-danger fw-bold";
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(async () => {
  await productStore.fetchProducts();
  await dashboardStore.initializeDashboard();
});
</script>

<template>
  <div class="card p-3">
    <h3 class="mb-3"><i class="bi bi-card-list me-2"></i>List of Products</h3>

    
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="input-group w-50">
          <span class="input-group-text"><i class="bi bi-search"></i></span>        
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search product..." 
            v-model="productStore.searchQuery" 
          />
        </div>
        <button class="btn btn-primary btn-md" @click="addNewProduct">
            <i class="bi bi-plus-circle me-2"></i> New Product
        </button>
    </div>

    
    <div
      v-if="productStore.showAlert"
      class="alert alert-dismissible"
      :class="`alert-${productStore.alertType}`"
      role="alert"
    >
      {{ productStore.alertMessage }}
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="closeAlert"
      ></button>
    </div>

    <h6 class=" text-secondary mb-2">
      <i class="bi bi-list-task me-2"></i>Total Products: {{ dashboardStore.totals.totalProducts }}
    </h6>
    
      <table class="table table-striped text-capitalize">
      <thead class="table-dark">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in paginatedProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.price }}</td>
          <td :class="getStatusClass(product.status)">
            {{ product.status }}
          </td>
          <td>
            <div class="input-group">
              <button
                class="btn btn-outline-success btn-sm"
                @click="updateProduct(product.id)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="confirmDelete(product.id)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>           
          </td>
        </tr>
        <tr v-if="productStore.filteredProducts.length === 0">
          <td colspan="6" class="text-center text-muted">
            <i class="bi bi-question-circle me-2"></i>No products found.
          </td>
        </tr>
      </tbody>
    </table>

      <div class="d-flex justify-content-center gap-2 mb-1">
        <button
          class="btn btn-secondary"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <i class="bi bi-chevron-bar-left me-1"></i>Previous
        </button>
        <button
          class="btn btn-secondary"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Next<i class="bi bi-chevron-bar-right ms-1"></i>
        </button>
      </div>
  </div>
</template> -->

<script setup>
import { useDashboardStore } from "@/stores/dashboard";
import { useProductStore } from "@/stores/product.js";
import { computed, onMounted, ref } from "vue";
import AddProduct from "/home/ahmed/Documents/vue-projects/vue-2/src/views/modals/AddProduct.vue";
import ViewProduct from "/home/ahmed/Documents/vue-projects/vue-2/src/views/modals/ViewProduct.vue";
import Alert from "@/components/Alert.vue";

const productStore = useProductStore();
const dashboardStore = useDashboardStore();

const currentPage = ref(1);
const itemsPerPage = ref(10);
const showModal = ref(false);
const modalData = ref(null);
const currentModal = ref(null);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return productStore.filteredProducts.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(productStore.filteredProducts.length / itemsPerPage.value)
);

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const closeModal = () => {
  showModal.value = false;
  modalData.value = null;
};

const openAddProductModal = () => {
  modalData.value = null;
  showModal.value = true;
  currentModal.value = "add";
};

const openEditProductModal = (product) => {
  modalData.value = { ...product };
  showModal.value = true;
  currentModal.value = "edit";
};

const openViewProductModal = (product) => {
  modalData.value = { ...product };
  currentModal.value = "view";
  showModal.value = true;
};

const confirmDelete = async (id) => {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await productStore.deleteProduct(id);
      await dashboardStore.initializeDashboard();
    } catch (error) {
      console.error("Error deleting product:", error)
    }  
  }
};

onMounted(() => {
  productStore.fetchProducts();
  dashboardStore.initializeDashboard();
});
</script>

<template>
  <Alert
      :message="productStore.alertMessage"
      :type="productStore.alertType"
      :show="productStore.showAlert"
      @close="productStore.showAlert = false"
    />

  <div class="card p-3">
    <h3 class="mb-3"><i class="bi bi-card-list me-2"></i>List of Products</h3>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="input-group w-50">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input
          type="text"
          class="form-control"
          placeholder="Search product..."
          v-model="productStore.searchQuery"
        />
      </div>
      <button class="btn btn-secondary btn-md" @click="openAddProductModal">
        <i class="bi bi-plus-circle me-1"></i> New Product
      </button>
    </div>

    <h6 class="text-secondary mb-2">
      <i class="bi bi-list-task me-2"></i>Total Products:
      {{ dashboardStore.totals.totalProducts }}
    </h6>

    <!-- Products Table -->
    <table class="table table-striped text-capitalize fs-5">
      <thead class="table-dark">
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in paginatedProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.price }}</td>
          <td
            :class="
              product.status === 'Available'
                ? 'text-success fw-bold'
                : 'text-danger fw-bold'
            "
          >
            {{ product.status }}
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-dark btn-md"
                @click="openViewProductModal(product)"
                style="border:none !important"
              >
                <i class="bi bi-eye"></i>
              </button>
              <button
                class="btn btn-outline-success btn-md"
                @click="openEditProductModal(product)"
                style="border:none !important"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-outline-danger btn-md"
                @click="confirmDelete(product.id)"
                style="border:none !important"
              >
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="productStore.filteredProducts.length === 0">
          <td colspan="5" class="text-center text-muted">
            <i class="bi bi-question-circle me-2"></i>No products found.
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <div class="d-flex justify-content-center gap-2 mb-1">
      <button
        class="btn btn-secondary"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <i class="bi bi-chevron-bar-left me-1"></i>Previous
      </button>
      <button
        class="btn btn-secondary"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next<i class="bi bi-chevron-bar-right ms-1"></i>
      </button>
    </div>

    <AddProduct
      v-if="(currentModal === 'add' || currentModal === 'edit') && showModal"
      :product="modalData"
      @close="closeModal"
    />

    <ViewProduct
      v-if="currentModal === 'view' && showModal"
      :product="modalData"
      @close="closeModal"
    />
  </div>
</template>
