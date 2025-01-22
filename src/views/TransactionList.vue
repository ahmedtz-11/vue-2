<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSalesStore } from '@/stores/sales';
import { useRouter } from 'vue-router';
import { useDashboardStore } from '@/stores/dashboard';


const dashboardStore = useDashboardStore();
const salesStore = useSalesStore();
const router = useRouter();

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;


onMounted(() => {
  salesStore.fetchTransactions();

  // Initialize isOpen for each transaction
  salesStore.transactions.forEach(transaction => {
    if (transaction.details && !('isOpen' in transaction)) {
      transaction.isOpen = false;
    }
  });
});

// Filtered transactions based on search query
const filteredTransactions = computed(() => {
  const transactions = Array.isArray(salesStore.transactions)
    ? salesStore.transactions
    : Object.values(salesStore.transactions); // Convert object to array

  return transactions.filter(transaction => {
    const matchesDate = transaction.transaction_date.includes(searchQuery.value);
    const matchesSoldBy = transaction.sold_by.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesPaymentStatus = transaction.payment_status.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchesDate || matchesSoldBy || matchesPaymentStatus;
  });
});

// Paginate filtered transactions
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.value.slice(start, end);
});

// Total pages for pagination
const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage);
});

// Redirect to transaction page
const goToTransactionPage = () => {
  router.push('/transaction');
};

// Toggle product list accordion
const toggleAccordion = (transactionId) => {
  const transactions = Array.isArray(salesStore.transactions)
    ? salesStore.transactions
    : Object.values(salesStore.transactions); // Convert to array if it's an object

  const transaction = transactions.find(t => t.transaction_id === transactionId);
  if (transaction) {
    console.log(`Toggling accordion for transaction ${transactionId}, current state: ${transaction.isOpen}`);
    transaction.isOpen = !transaction.isOpen;
  }
};

</script>


<template>
    <div class="card p-3 shadow-sm">
      <h3 class="mb-3"><i class="bi bi-clipboard me-2"></i>Transaction History</h3>

      <!--  Search and Button Section -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="input-group w-50">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search here..." 
            class="form-control"
          />
        </div>
        <button @click="goToTransactionPage" class="btn btn-primary btn-md">
          <i class="bi bi-plus-circle me-2"></i>Do Transaction
        </button>
      </div>

      <h6 class=" text-secondary mb-2">
        <i class="bi bi-list-task me-2"></i>Total Revenue: {{ dashboardStore.totals.totalSales }}
      </h6>
      <!-- Transactions Table -->
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Transaction Date</th>
            <th>Total Amount (Tsh.)</th>
            <th>Payment Status</th>
            <th>Sold By</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="text-capitalize">
            <td>{{ transaction.transaction_date }}</td>
            <td>{{ parseFloat(transaction.total_amount).toFixed(2) }}</td>
            <td>
              <span
              :class="{
                'text-success': transaction.payment_status === 'paid',
                'text-warning': transaction.payment_status === 'pending',
                'text-danger': transaction.payment_status === 'cancelled',
              }"
              class="fw-bold"
              >
                {{ transaction.payment_status }}
              </span>
            </td>
            <td>{{ transaction.sold_by }}</td>
            <td>
              <div>
                <div v-if="transaction.details.length > 1">
                  <button 
                    class="btn btn-outline-primary btn-sm" 
                    @click="toggleAccordion(transaction.transaction_id)">
                    {{ transaction.isOpen ? 'Hide' : 'Show' }}
                    <i :class="transaction.isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                  </button>
                  <div v-if="transaction.isOpen" class="mt-2">
                    <ul class="list-unstyled">
                      <li v-for="(product, index) in transaction.details" :key="index">
                        {{ product.product_name }} : {{ product.quantity }} = 
                        {{ (parseFloat(product.unit_price) * product.quantity).toFixed(2) }}
                      </li>
                    </ul>
                  </div>
                </div>
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

      <!-- Pagination -->
      <div class="d-flex justify-content-center align-items-center mt-3">
        <button 
          class="btn btn-secondary me-1" 
          @click="currentPage > 1 && currentPage--" 
          :disabled="currentPage === 1">
          <i class="bi bi-chevron-bar-left"></i> Previous
        </button>

        <button 
          class="btn btn-secondary" 
          @click="currentPage < totalPages && currentPage++" 
          :disabled="currentPage === totalPages">
          Next <i class="bi bi-chevron-bar-right"></i>
        </button>
      </div>
    </div>

</template>