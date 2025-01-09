<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const transactions = ref([
  {
    id: 1, totalAmount: 9000, date: '2025-01-02', paymentStatus: 'Paid', soldBy: 'Admin',
    products: [
      { name: 'Coke 500ml', quantity: 2, price: 1000 },
      { name: 'Dettol Soap', quantity: 1, price: 2000 },
      { name: 'Petroleum Jelly', quantity: 1, price: 2500 },
      { name: 'Tissue Paper', quantity: 3, price: 1500 }
    ]
  },
  {
    id: 2, totalAmount: 12000, date: '2025-01-03', paymentStatus: 'Pending', soldBy: 'Cashier 1',
    products: [
      { name: 'Dettol Soap', quantity: 3, price: 2000 },
      { name: 'Colgate 400g', quantity: 2, price: 2500 },
      { name: 'Coke 500ml', quantity: 1, price: 1000 }
    ]
  },
  {
    id: 3, totalAmount: 13500, date: '2024-01-01', paymentStatus: 'Paid', soldBy: 'Admin',
    products: [
      { name: 'Dettol Soap', quantity: 1, price: 2000 },
      { name: 'Petroleum Jelly', quantity: 1, price: 2500 },
      { name: 'Tissue Paper', quantity: 3, price: 1500 }
    ]
  },
  {
    id: 4, totalAmount: 5000, date: '2023-01-03', paymentStatus: 'Failed', soldBy: 'Cashier 2',
    products: [
      { name: 'Milk 1L', quantity: 2, price: 1800 },
      { name: 'Bread', quantity: 1, price: 1500 }
    ]
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

const toggleAccordion = (transactionId) => {
  const transaction = transactions.value.find(t => t.id === transactionId);
  if (transaction) {
    transaction.isOpen = !transaction.isOpen;
  }
};

const paymentStatusClass = (status) => {
  switch (status.toLowerCase()) {
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

transactions.value.forEach(transaction => {
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
          <th>Total Amount(tsh.)</th>
          <th>Payment Status</th>
          <th>Sold By</th>
          <th>Products</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
          <td>{{ transaction.date }}</td>
          <td>{{ transaction.totalAmount.toFixed(2) }}</td>
          <td :class="paymentStatusClass(transaction.paymentStatus)">
            {{ transaction.paymentStatus.toLowerCase() }}
          </td>
          <td>{{ transaction.soldBy }}</td>
          <td>
            <div>
              <div v-for="(product, index) in transaction.products.slice(0, 1)" :key="index">
                {{ product.name }} x {{ product.quantity }} - {{ (product.price * product.quantity).toFixed(2) }}
              </div>

              <div v-if="transaction.products.length > 1">
                <button class="accordion-btn" @click="toggleAccordion(transaction.id)">
                  {{ transaction.isOpen ? 'Show Less' : 'Show More' }}
                </button>
                <div v-if="transaction.isOpen">
                  <div v-for="(product, index) in transaction.products.slice(1)" :key="index">
                    {{ product.name }} x {{ product.quantity }} - {{ (product.price * product.quantity).toFixed(2) }}
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

.paid, .pending, .failed {
  font-weight: bold;
  text-transform: uppercase;
}

.paid {
  color: #27ae60;
}

.pending {
  color: #f39c12;
}

.failed {
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
