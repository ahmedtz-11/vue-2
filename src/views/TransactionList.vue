<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSalesStore } from '@/stores/sales';
import { useRouter } from 'vue-router';

const salesStore = useSalesStore();
const router = useRouter();

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 15;


onMounted(() => {
  salesStore.fetchTransactions();
});



// Filtered transactions based on search query
const filteredTransactions = computed(() => {
  const transactions = Array.isArray(salesStore.transactions)
    ? salesStore.transactions
    : Object.values(salesStore.transactions); // Convert object to array

  return transactions.filter(transaction =>
    transaction.transaction_date.includes(searchQuery.value)
  );
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
  router.push('/sales');
};

// Toggle product list accordion
const toggleAccordion = (transactionId) => {
  const transaction = salesStore.transactions.find(t => t.transaction_id === transactionId);
  if (transaction) {
    transaction.isOpen = !transaction.isOpen;
  }
};

// Style classes for payment status
const paymentStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'paid';
    case 'pending':
      return 'pending';
    case 'cancelled':
      return 'cancelled';
    default:
      return '';
  }
};

// Ensure transactions have the `isOpen` property
salesStore.transactions.forEach(transaction => {
  transaction.isOpen = false;
});
</script>

<template>
  <div class="transaction-list">
    <h3>Transaction History</h3>

    <div class="transaction-button">
      <button @click="goToTransactionPage" class="do-transaction-btn">Do Transaction</button>
    </div>

    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by Date..." 
        class="search-input"
      />
    </div>

    <table>
      <thead>
        <tr>
          <th>Transaction Date</th>
          <th>Total Amount (tsh.)</th>
          <th>Payment Status</th>
          <th>Sold By</th>
          <th>Products</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in paginatedTransactions" :key="transaction.transaction_id">
          <td>{{ transaction.transaction_date }}</td>
          <td>{{ parseFloat(transaction.total_amount).toFixed(2) }}</td>
          <td :class="paymentStatusClass(transaction.payment_status)">
            {{ transaction.payment_status.toLowerCase() }}
          </td>
          <td>{{ transaction.sold_by }}</td>
          <td>
            <div>
              <div v-for="(product, index) in transaction.details.slice(0, 1)" :key="index">
                {{ product.product_name }} x {{ product.quantity }} - 
                {{ (parseFloat(product.unit_price) * product.quantity).toFixed(2) }}
              </div>

              <div v-if="transaction.details.length > 1">
                <button class="accordion-btn" @click="toggleAccordion(transaction.transaction_id)">
                  {{ transaction.isOpen ? 'Show Less' : 'Show More' }}
                </button>
                <div v-if="transaction.isOpen">
                  <div v-for="(product, index) in transaction.details.slice(1)" :key="index">
                    {{ product.product_name }} x {{ product.quantity }} - 
                    {{ (parseFloat(product.unit_price) * product.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="currentPage > 1 && currentPage--" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="currentPage < totalPages && currentPage++" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<style scoped>
.transaction-list {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  height: 100vh;
}

.transaction-button {
  text-align: right;
  margin-bottom: 10px;
}

.do-transaction-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.do-transaction-btn:hover {
  background-color: #0866ca;
}


.search-container {
  margin-bottom: 20px;
}

.search-input {
  padding: 8px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

/* Table Styling */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #34495e;
  color: white;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:hover {
  background-color: #2980b9;
}

.pagination span {
  font-size: 1rem;
}

.accordion-btn {
  background-color: #1abc9c;
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.accordion-btn:hover {
  background-color: #0eaa8b;
}

.paid, .pending, .cancelled {
  font-weight: bold;
  text-transform: uppercase;
}

.paid {
  color: #27ae60;
}

.pending {
  color: #f39c12;
}

.cancelled {
  color: #e74c3c;
}

div[role="button"] {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

div[role="button"] button {
  margin-top: 10px;
}

td > div {
  margin-top: 10px;
}

</style>
