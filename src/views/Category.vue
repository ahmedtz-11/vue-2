<script setup>
import { ref, computed, onMounted } from "vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useProductStore } from "@/stores/product";
import AddCategory from "./modals/AddCategory.vue";
import Alert from "@/components/Alert.vue";

const dashboardStore = useDashboardStore();
const productStore = useProductStore();

const currentPage = ref(1);
const itemsPerPage = ref(5);
const showModal = ref(false);
const modalData = ref(null);
const currentModal = ref(null);

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return productStore.filteredCategories.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(productStore.filteredCategories.length / itemsPerPage.value)
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

const openAddCategoryModal = () => {
  modalData.value = null;
  showModal.value = true;
  currentModal.value = "add";
};

const openEditCategoryModal = (category) => {
  modalData.value = { ...category };
  showModal.value = true;
  currentModal.value = "edit";
};


onMounted(async () => {
  await dashboardStore.initializeDashboard();
  await productStore.fetchCategories();
});
</script>

<template>
  <Alert
    :message="productStore.alertMessage"
    :type="productStore.alertType"
    :show="productStore.showAlert"
    @close="productStore.showAlert = false"
  />

  <div class="card shadow-sm p-3">
    <!-- Heading, Search, and Add Button -->
    <div class="row g-3 align-items-center mb-4">
      <div class="col-12 col-md-auto text-center text-md-start mb-3 mb-md-0">
        <h3 class="mb-0"><i class="bi bi-tags me-2"></i>Products Categories</h3>
      </div>
      <div class="col-12 col-md flex-grow-1 order-md-1 order-2">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input
            type="text"
            class="form-control"
            placeholder="Search category..."
            v-model="productStore.searchQuery"
          />
        </div>
      </div>
      <div
        class="col-12 col-md-auto text-center text-md-end order-md-2 order-1 mb-3 mb-md-0"
      >
        <button
          class="btn btn-secondary btn-md w-100 w-md-auto"
          @click="openAddCategoryModal"
        >
          <i class="bi bi-plus-circle me-1"></i> New Category
        </button>
      </div>
    </div>

    <!-- Products Table -->
    <div class="table-responsive">
      <table class="table table-striped text-capitalize fs-5">
        <thead class="table-dark">
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in paginatedCategories" :key="category.id">
            <td>{{ category.name }}</td>
            <td>
              <span
                class="badge"
                :class="
                  category.status_name == 'Active' ? 'bg-success' : 'bg-danger'
                "
                >{{ category.status_name }}</span
              >
            </td>
            <td>
              <div class="btn-group">
                <button
                  class="btn btn-outline-success btn-md"
                  @click="openEditCategoryModal(category)"
                  style="border: none !important"
                >
                  <i class="bi bi-pencil"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="productStore.filteredCategories.length === 0">
            <td colspan="3" class="text-center text-muted">
              <i class="bi bi-question-circle me-2"></i>No category found.
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Total Categories -->
      <div class="col-12 col-md-auto mt-2 mt-md-0">
        <h6 class="text-muted">
          Total Categories: {{ dashboardStore.totals.totalCategories }}
        </h6>
      </div>
    </div>

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

    <AddCategory
      v-if="(currentModal === 'add' || currentModal === 'edit') && showModal"
      :category="modalData"
      @close="closeModal"
    />
  </div>
</template>
