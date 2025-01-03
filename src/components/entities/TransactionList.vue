<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const transactions = ref([
  {
    id: 1, totalAmount: 20.0, date: '2025-01-02', paymentStatus: 'Paid', soldBy: 'Admin',
    products: [{ name: 'Coke 500ml', quantity: 2, price: 1.5 }, { name: 'Dettol Soap', quantity: 1, price: 2.0 },
      { name: 'Petroleum Jelly', quantity: 1, price: 3.0 }, { name: 'Tissue Paper', quantity: 3, price: 1.2 }]
  },
  {
    id: 2, totalAmount: 35.0, date: '2025-01-03', paymentStatus: 'Pending', soldBy: 'Cashier 1',
    products: [{ name: 'Dettol Soap', quantity: 3, price: 2.0 }, { name: 'Colgate 400g', quantity: 2, price: 3.0 },
      { name: 'Coke 500ml', quantity: 1, price: 1.5 }]
  },
  {
    id: 3, totalAmount: 35.0, date: '2025-01-03', paymentStatus: 'Failed', soldBy: 'Cashier 1',
    products: [{ name: 'Dettol Soap', quantity: 3, price: 2.0 }, { name: 'Colgate 400g', quantity: 2, price: 3.0 },
      { name: 'Coke 500ml', quantity: 1, price: 1.5 }]
  }
]);

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 15;

const filteredTransactions = computed(() => {
  return transactions.value.filter(transaction => 
    transaction.date.includes(searchQuery.value)
  );
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage);
});

const goToTransactionPage = () => {
  router.push('/sales');
};

// Accordion functionality
const toggleAccordion = (transactionId) => {
  const transaction = transactions.value.find(t => t.id === transactionId);
  if (transaction) {
    transaction.isOpen = !transaction.isOpen;
  }
};

// Initialize `isOpen` for each transaction
transactions.value.forEach(transaction => {
  transaction.isOpen = false;
});

const paymentStatusClass = (status) => {
  switch (status.toUpperCase()) {
    case 'paid':
      return 'paid';
    case 'pending':
      return 'pending';
    case 'failed':
      return 'failed';
    default:
      return '';
  }
};
</script>

<template>
  <div class="transaction-list">
    <h3>Transaction History</h3>

    <!-- Button to do transaction -->
    <div class="transaction-button">
      <button @click="goToTransactionPage" class="do-transaction-btn">Do Transaction</button>
    </div>

    <!-- Search Input for Date -->
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by Date..." 
        class="search-input"
      />
    </div>

    <!-- Transaction Table -->
    <table>
      <thead>
        <tr>
          <th>Transaction Date</th>
          <th>Total Amount</th>
          <th>Payment Status</th>
          <th>Sold By</th>
          <th>Products</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
          <td>{{ transaction.date }}</td>
          <td>${{ transaction.totalAmount.toFixed(2) }}</td>

          <!-- Payment Status with Color Change -->
          <td :class="paymentStatusClass(transaction.paymentStatus)">
            {{ transaction.paymentStatus.toLowerCase() }}
          </td>

          <td>{{ transaction.soldBy }}</td>
          <td>
            <div>
              <!-- Show only one product initially -->
              <div v-for="(product, index) in transaction.products.slice(0, 1)" :key="index">
                {{ product.name }} x {{ product.quantity }} - ${{ (product.price * product.quantity).toFixed(2) }}
              </div>

              <!-- Show more products with an accordion -->
              <div v-if="transaction.products.length > 1">
                <button class="accordion-btn" @click="toggleAccordion(transaction.id)">
                  Show More
                </button>
                <div v-if="transaction.isOpen">
                  <div v-for="(product, index) in transaction.products.slice(1)" :key="index">
                    {{ product.name }} x {{ product.quantity }} - ${{ (product.price * product.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="pagination">
      <button 
        @click="currentPage > 1 && currentPage--" 
        :disabled="currentPage === 1">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="currentPage < totalPages && currentPage++" 
        :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.transaction-list {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
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
  background-color: #0056b3;
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 3px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f1f1f1;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  margin: 5px 0;
  /* padding: 5px; */
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

/* Accordion button styling */
.accordion-btn {
  background-color: #3498db;
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.accordion-btn:hover {
  background-color: #2980b9;
}

/* Payment status colors */
.paid {
  color: #27ae60;
}

.pending {
  background-color: #f39c12;
  color: white;
}

.failed {
  background-color: #e74c3c;
  color: white;
}
</style>

