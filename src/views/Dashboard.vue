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
  <div class="card p-3">
    <!-- Time and Day -->
    <div class="text-center mb-4">
      <h4 class="text-success">
        {{ currentFormattedDate }} | {{ currentFormattedTime }}
      </h4>
    </div>

    <!-- Welcome Message -->
    <div class="card shadow-sm mb-4">
      <div class="card-body text-center">
        <h2 class="text-primary" style="text-transform: capitalize;">Welcome, {{ userStore.username }}!</h2>
        <p class="text-secondary">Here's an overview of the system.</p>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="row text-center g-4">
      <div class="col-md-3 col-sm-6">
        <div class="card border-success shadow h-100">
          <div class="card-body">
            <i class="bi bi-box-seam text-success display-4 mb-3"></i>
            <h5 class="card-title">Total Products</h5>
            <p class="fs-3 fw-bold text-success">{{ dashboardStore.totals.totalProducts }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="card border-primary shadow h-100">
          <div class="card-body">
            <i class="bi bi-cart3 text-primary display-4 mb-3"></i>
            <h5 class="card-title">Total Stock</h5>
            <p class="fs-3 fw-bold text-primary">{{ dashboardStore.totals.totalStock }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="card border-warning shadow h-100">
          <div class="card-body">
            <i class="bi bi-currency-exchange text-warning display-4 mb-3"></i>
            <h5 class="card-title">Total Revenue</h5>
            <p class="fs-3 fw-bold text-warning">{{ dashboardStore.totals.totalSales }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="card border-danger shadow h-100">
          <div class="card-body">
            <i class="bi bi-people text-danger display-4 mb-3"></i>
            <h5 class="card-title">Total Users</h5>
            <p class="fs-3 fw-bold text-danger">{{ dashboardStore.totals.totalUsers }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="card mt-4 shadow">
      <div class="card-header bg-secondary text-white">
        <h5 class="mb-0">Performance Metrics (Sales and Cash In)</h5>
      </div>
      <div class="card-body p-0">
        <table class="table table-striped mb-0">
          <thead class="table-dark">
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

    <!-- Performance Metrics -->
    <div class="card mt-4 shadow">
      <div class="card-header bg-secondary text-white">
        <h5 class="mb-0">Performance Metrics (Sales and Cash In)</h5>
      </div>
      <div class="card-body p-0">
        <table class="table table-striped mb-0">
          <thead class="table-dark">
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
.card-body i {
  margin-bottom: 10px;
}

.table th,
.table td {
  vertical-align: middle;
}
</style>


