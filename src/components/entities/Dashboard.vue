<script setup>
import { ref, onMounted } from 'vue';

const totalProducts = ref(100);  
const totalStock = ref(500);  
const totalSales = ref(150);  
const totalUsers = ref(3);  

const username = ref('Admin');  

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
    <div class="card time-day-card">
      <p><strong>{{ currentFormattedDate }}</strong> - {{ currentFormattedTime }}</p>
    </div>

    <!-- Welcome Message -->
    <div class="welcome-message">
      <h2>Welcome, {{ username }}!</h2>
      <p>Here's an overview of the system.</p>
    </div>

    <!-- Overview Cards -->
    <div class="overview-cards">
      <div class="card card-products">
        <h3>Total Products</h3>
        <p>{{ totalProducts }}</p>
      </div>
      <div class="card card-stock">
        <h3>Total Stock</h3>
        <p>{{ totalStock }}</p>
      </div>
      <div class="card card-sales">
        <h3>Total Sales</h3>
        <p>{{ totalSales }}</p>
      </div>
      <div class="card card-users">
        <h3>Total Users</h3>
        <p>{{ totalUsers }}</p>
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.welcome-message {
  background-color: #c9c9c9;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.welcome-message h2 {
  margin: 0;
  font-size: 2rem;
}

.welcome-message p {
  font-size: 1.2rem;
  color: #7f8c8d;
}

/* Time and Day Section */
.time-day-card {
  background-color: #f1e1f1;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.1rem;
  color: #2c3e50;
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
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.card p {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.card-products {
  background-color: #28a745;
  color: white;
}

.card-stock {
  background-color: #3498db;
  color: white;
}

.card-sales {
  background-color: #f39c12;
  color: white;
}

.card-users {
  background-color: #e74c3c;
  color: white;
}

/* Performance Metrics */
.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.table-card {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
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
