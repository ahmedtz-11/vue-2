<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '/home/ahmed/Documents/vue-projects/vue-2/src/stores/user.js';
import { useDashboardStore } from '@/stores/dashboard';


const userStore = useUserStore();
const dashboardStore = useDashboardStore();   

// Date and Time
const currentTime = ref(new Date());
const currentFormattedDate = ref('');
const currentFormattedTime = ref(currentTime.value.toLocaleTimeString());

// Performance metrics for the week
const performanceData = ref({
  Monday: { sales: 30, cashIn: 4000 },
  Tuesday: { sales: 45, cashIn: 6000 },
  Wednesday: { sales: 50, cashIn: 7000 },
  Thursday: { sales: 35, cashIn: 5000 },
  Friday: { sales: 60, cashIn: 8000 },
  Saturday: { sales: 40, cashIn: 5500 },
  Sunday: { sales: 25, cashIn: 3500 }
});

// Update time every second
onMounted(() => {
  userStore.fetchLoggedInUser();
  dashboardStore.initializeDashboard();
  setInterval(() => {
    currentTime.value = new Date();
    currentFormattedDate.value = currentTime.value.toLocaleString('en-us', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
    currentFormattedTime.value = currentTime.value.toLocaleTimeString();
  }, 1000);
});
</script>

<template>
  <div class="dashboard-container">
    <!-- Time and Day -->
    <div class="time-day-card">
      <h4>{{ currentFormattedDate }}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{{ currentFormattedTime }}</h4>
    </div>

    <!-- Welcome Message -->
    <div class="welcome-message">
      <h2>Welcome, {{ userStore.username }}!</h2>
      <p>Here's an overview of the system.</p>
    </div>

    <!-- Overview Cards -->
    <div class="overview-cards">
      <div class="card card-products">
        <h3>Total Products</h3>
        <p>{{ dashboardStore.totals.totalProducts }}</p>
      </div>
      <div class="card card-stock">
        <h3>Total Stock</h3>
        <p>{{ dashboardStore.totals.totalStock }}</p>
      </div>
      <div class="card card-sales">
        <h3>Total Revenue</h3>
        <p>{{ dashboardStore.totals.totalSales }}</p>
      </div>
      <div class="card card-users">
        <h3>Total Users</h3>
        <p>{{ dashboardStore.totals.totalUsers }}</p>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="performance-metrics">
      <div class="card table-card">
        <h3>Performance Metrics (Sales and Cash In)</h3>
        <table> 
          <thead>
            <tr>
              <th>Day</th>
              <th>Sales</th>
              <th>Cash In (Tsh.)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, day) in performanceData" :key="day">
              <td>{{ day }}</td>
              <td>{{ data.sales }}</td>
              <td>{{ data.cashIn }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.welcome-message {
  border: 1px solid #ccc;
  background-color: #eee;
  padding: 20px;
  border-radius: 8px;
}

.welcome-message h2 {
  margin: 0;
  font-size: 2rem;
  text-transform: capitalize;
}

.welcome-message p {
  font-size: 1.2rem;
  color: #34495e;
}

/* Time and Day Section */
.time-day-card {
  border: 1px solid #ccc;
  background-color: #eee;
  padding: 10px;
  border-radius: 8px;
  font-size: 1.5rem;
  color: #34495e;
  text-align: center;
}

.overview-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.card {
  flex: 1;
  min-width: 250px;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.card h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.card p {
  font-size: 2rem;
  font-weight: bold;
  color: #000;
}

.card-products {
  color: #28a745;
  border: 1px dashed #28a745;
}

.card-products:hover {
  background: linear-gradient(30deg, #28a745, #69f88a);
  color: #fff;
}

.card-stock {
  color: #3498db;
  border: 1px dashed #3498db;
}

.card-stock:hover {
  background: linear-gradient(30deg, #3498db, #7fc8f8);
  color: #fff;
}

.card-sales {
  color: #f39c12;
  border: 1px dashed #f39c12;
}

.card-sales:hover {
  background: linear-gradient(30deg, #f39c12, #fcc368);
  color: #fff;
}

.card-users {
  color: #e74c3c;
  border: 1px dashed #e74c3c;
}

.card-users:hover {
  background: linear-gradient(30deg, #e74c3c, #fa877a);
  color: #fff;
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.table-card {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

table th {
  background-color: #34495e;
  color: white;
}

table td {
  font-size: 1.2rem;
}

table tr:nth-child(even) {
  background-color: #c9c9c9;
}
</style>
