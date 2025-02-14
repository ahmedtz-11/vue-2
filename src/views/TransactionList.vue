<script setup>
import { ref, computed, onMounted } from "vue";
import { useSalesStore } from "@/stores/sales";
import { useRouter } from "vue-router";
import { useDashboardStore } from "@/stores/dashboard";
import Alert from "@/components/Alert.vue";
import DoTransaction from "./modals/DoTransaction.vue";
import ViewTransaction from "./modals/ViewTransaction.vue";

const dashboardStore = useDashboardStore();
const salesStore = useSalesStore();

const router = useRouter();
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;
const showModal = ref(false);
const modalData = ref(null);
const currentModal = ref(null);

const closeModal = () => {
  showModal.value = false;
};

const openTransactionModal = () => {
  showModal.value = true;
  currentModal.value = "add";
};

const openViewTransactionModal = (transaction) => {
  modalData.value = { ...transaction };
  currentModal.value = "view";
  showModal.value = true;
};

onMounted(() => {
  dashboardStore.initializeDashboard();
  salesStore.fetchTransactions();
});

// Filtered transactions based on search query
const filteredTransactions = computed(() => {
  const transactions = Array.isArray(salesStore.transactions)
    ? salesStore.transactions
    : Object.values(salesStore.transactions); // Convert object to array

  return transactions.filter((transaction) => {
    const matchesDate = transaction.transaction_date.includes(
      searchQuery.value
    );
    const matchesSoldBy = transaction.sold_by
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesPaymentStatus = transaction.payment_status
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    return matchesDate || matchesSoldBy || matchesPaymentStatus;
  });
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage);
});
</script>

<template>
  <Alert
    :message="salesStore.alertMessage"
    :type="salesStore.alertType"
    :show="salesStore.showAlert"
    @close="salesStore.showAlert = false"
  />

  <div class="card shadow-sm p-3">
    <!-- Heading, Search and Add Button -->
    <div class="row g-3 align-items-center mb-4">
      <div class="col-12 col-md-auto text-center text-md-start mb-3 mb-md-0">
        <h3 class="mb-0">
          <i class="bi bi-clipboard me-2"></i>Transaction History
        </h3>
      </div>
      <div class="col-12 col-md flex-grow-1 order-md-1 order-2">
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search here..."
            class="form-control"
          />
        </div>
      </div>
      <div
        class="col-12 col-md-auto text-center text-md-end order-md-2 order-1 mb-3 mb-md-0"
      >
        <button
          @click="openTransactionModal"
          class="btn btn-secondary btn-md w-100 w-md-auto"
        >
          <i class="bi bi-cash-coin me-1"></i>Do Transaction
        </button>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="table-responsive">
      <table class="table table-striped table-hover fs-5">
        <thead class="table-dark">
          <tr>
            <th>Transaction Date</th>
            <th>Payment Status</th>
            <th>Sold By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="transaction in paginatedTransactions"
            :key="transaction.id"
            class="text-capitalize"
          >
            <td>{{ transaction.transaction_date }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'bg-success': transaction.payment_status === 'Paid',
                  'bg-warning': transaction.payment_status === 'Pending',
                  'bg-danger': transaction.payment_status === 'Cancelled',
                }"
              >
                {{ transaction.payment_status }}
              </span>
            </td>
            <td>{{ transaction.sold_by }}</td>
            <td>
              <div class="btn-group">
                <button
                  class="btn btn-outline-dark btn-sm"
                  @click="openViewTransactionModal(transaction)"
                  style="border: none !important"
                >
                  <i class="bi bi-eye fs-5"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredTransactions.length === 0">
            <td colspan="6" class="text-center text-muted">
              <i class="bi bi-question-circle me-2"></i>No transactions found.
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Total Revenue -->
      <div class="col-12 col-md-auto mt-2 mt-md-0">
        <h6 class="text-muted">
          Total Revenue:
          {{ $formatMoney(dashboardStore.totals.totalSales) }}
        </h6>
      </div>
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

    <DoTransaction
      v-if="currentModal === 'add' && showModal"
      @close="closeModal"
    />
    <ViewTransaction
      v-if="currentModal === 'view' && showModal"
      :transaction="modalData"
      @close="closeModal"
    />
  </div>
</template>
