<script setup>
import { useDashboardStore } from "@/stores/dashboard";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AddStock from "/home/ahmed/Documents/vue-projects/vue-2/src/views/modals/AddStock.vue";
import { useStockStore } from "/home/ahmed/Documents/vue-projects/vue-2/src/stores/stock.js";
import Alert from "@/components/Alert.vue";

const dashboardStore = useDashboardStore();
const stockStore = useStockStore();

const router = useRouter();
const currentPage = ref(1);
const pageSize = 5;
const showModal = ref(false);
const modalData = ref(null);
const currentModal = ref(null);

const paginatedStocks = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return stockStore.filteredStocks.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(stockStore.filteredStocks.length / pageSize)
);

const closeModal = () => {
  showModal.value = false;
  modalData.value = null;
};

const openAddStockModal = () => {
  modalData.value = null;
  showModal.value = true;
  currentModal.value = "add";
};

const deleteStock = async (id) => {
  const confirmDelete = confirm("Are you sure you want to delete this stock?");
  if (confirmDelete) {
    await stockStore.deleteStock(id);
  }
};

onMounted(async () => {
  await stockStore.fetchStocks();
  await dashboardStore.initializeDashboard();
});
</script>

<template>
  <Alert
    :message="stockStore.alertMessage"
    :type="stockStore.alertType"
    :show="stockStore.showAlert"
    @close="stockStore.showAlert = false"
  />

  <div class="card shadow-sm p-3">
    <!-- Heading and Add Button -->
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 text-center text-md-start"
    >
      <h3><i class="bi-cart4 me-2"></i>List of Stocks</h3>
      <button class="btn btn-secondary btn-md mt-2 mt-md-0" @click="openAddStockModal">
        <i class="bi bi-cart-plus me-1"></i>New Stock
      </button>
    </div>
    <!-- Search and Total Stocks -->
    <div class="row align-items-center mb-3">
      <div class="col-12 col-md-6">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input
            type="text"
            class="form-control"
            placeholder="Search stock..."
            v-model="stockStore.searchQuery"
          />
        </div>
      </div>
      <div class="col-12 col-md-auto text-md-end text-center mt-2 mt-md-0">
        <h6 class="text-muted">
          Total Stocks:
          {{ dashboardStore.totals.totalStock }}
        </h6>
      </div>
    </div>

    <!-- Stocks Table -->
    <div class="table-responsive">
      <table class="table table-striped table-hover text-capitalize fs-5">
        <thead class="table-dark">
          <tr>
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
          <tr v-for="stock in paginatedStocks" :key="stock.id">
            <td>{{ stock.product_name }}</td>
            <td>{{ stock.quantity }}</td>
            <td>{{ stock.purchasing_price }}</td>
            <td>{{ stock.expiry_date }}</td>
            <td>{{ stock.added_by }}</td>
            <td>{{ stock.added_at }}</td>
            <td>
              <div class="btn-group">
                <button
                  class="btn btn-outline-success btn-md"
                  @click="editStock(stock.id)"
                  style="border: none !important"
                >
                  <i class="bi-pencil"></i>
                </button>
                <button
                  class="btn btn-outline-danger btn-md"
                  @click="deleteStock(stock.id)"
                  style="border: none !important"
                >
                  <i class="bi-trash3"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedStocks.length === 0">
            <td colspan="7" class="text-center text-muted">
              <i class="bi bi-question-circle me-2"></i>No stocks found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-center align-items-center mt-3">
      <button
        class="btn btn-secondary me-1"
        @click="currentPage > 1 && currentPage--"
        :disabled="currentPage === 1"
      >
        <i class="bi bi-chevron-bar-left"></i> Previous
      </button>
      <button
        class="btn btn-secondary"
        @click="currentPage < totalPages && currentPage++"
        :disabled="currentPage === totalPages"
      >
        Next <i class="bi bi-chevron-bar-right"></i>
      </button>
    </div>

    <AddStock
      v-if="currentModal === 'add' && showModal"
      :product="modalData"
      @close="closeModal"
    />
  </div>
</template>
