<script setup>
import { ref, computed, onMounted } from "vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useUserStore } from "@/stores/user";
import BarChart from "@/components/BarChart.vue";
import LineChart from "@/components/LineChart.vue";
import Doughnut from "@/components/Doughnut.vue";

const userStore = useUserStore();
const dashboardStore = useDashboardStore();

// Date and Time
const currentTime = ref(new Date());
const currentFormattedDate = ref("");
const currentFormattedTime = ref(currentTime.value.toLocaleTimeString());

// Performance metrics for the week
const performanceData = ref({
  Monday: { sales: 30, cashIn: 4000 },
  Tuesday: { sales: 45, cashIn: 6000 },
  Wednesday: { sales: 50, cashIn: 7000 },
  Thursday: { sales: 35, cashIn: 5000 },
  Friday: { sales: 60, cashIn: 8000 },
  Saturday: { sales: 40, cashIn: 5500 },
  Sunday: { sales: 25, cashIn: 3500 },
});

const salesChartData = computed(() => {
  if (
    !performanceData.value ||
    Object.keys(performanceData.value).length === 0
  ) {
    return { labels: [], datasets: [] };
  }
  return {
    labels: Object.keys(performanceData.value),
    datasets: [
      {
        label: "Sales",
        data: Object.values(performanceData.value).map((day) => day.sales),
        backgroundColor: "rgba(54, 112, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
});

const salesChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    tooltip: { enabled: true },
    filler: {
      propagate: true, // or false depending on your needs
    },
  },
};

// Convert data into arrays for charts
const days = Object.keys(performanceData.value);
const salesData = Object.values(performanceData.value).map(
  (data) => data.sales
);
const cashInData = Object.values(performanceData.value).map(
  (data) => data.cashIn
);

// Line Chart Data
const lineChartData = ref({
  labels: days,
  datasets: [
    {
      label: "Cash In (Tsh.)",
      data: cashInData,
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderWidth: 2,
      fill: true,
    },
  ],
});

const lineChartOptions = {
  responsive: true,
  plugins: {
    filler: {
      propagate: true, // or false depending on your needs
    },
  },
};

// Doughnut Chart Data
const doughnutChartData = ref({
  labels: days,
  datasets: [
    {
      label: "Sales",
      data: salesData,
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
        "rgba(199, 199, 199, 0.6)",
      ],
    },
  ],
});

const doughnutChartOptions = {
  plugins: {
    filler: {
      propagate: true, // or false depending on your needs
    },
  },
  responsive: true,
};

// Update time every second
onMounted(() => {
  console.log("Dashboard.vue Mounted!");
  userStore.fetchLoggedInUser();
  dashboardStore.initializeDashboard();

  console.log("Performance Data:", performanceData.value);
  console.log("Sales Chart Data:", salesChartData.value);

  setInterval(() => {
    currentTime.value = new Date();
    currentFormattedDate.value = currentTime.value.toLocaleString("en-us", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    currentFormattedTime.value = currentTime.value.toLocaleTimeString();
  }, 1000);
});
</script>

<template>
  <div class="card shadow-sm p-3">
    <div class="row text-center g-3 mb-3">
      <div class="col-lg-7 text-center">
        <div class="row g-3">
          <!-- Time & Welcome Message -->
          <div class="col-lg-12 col-md-6">
            <div class="text-center">
              <h5 class="text-primary">
                {{ currentFormattedDate }} .
                <span class="text-info fw-bold"> {{ currentFormattedTime }}</span>
              </h5>
            </div>
            <div class="card shadow-sm text-center p-2">
              <h2
                class="text-primary fw-bold"
                style="text-transform: capitalize"
              >
                Welcome, {{ userStore.username }}!
              </h2>
              <p class="text-secondary">Here's an overview of the system.</p>
            </div>
          </div>
          <!-- Overview Cards -->
          <div class="col-lg-6 col-md-6">
            <div class="card border-success shadow h-100 p-2">
              <i class="bi bi-box-seam text-success display-4 mb-3"></i>
              <h5 class="card-title">Registered Products</h5>
              <p class="fs-3 fw-bold text-success">
                {{ dashboardStore.totals.totalProducts }}
              </p>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="card border-primary shadow h-100 p-2">
              <i class="bi bi-cart3 text-primary display-4 mb-3"></i>
              <h5 class="card-title">Total Stock</h5>
              <p class="fs-3 fw-bold text-primary">
                {{ dashboardStore.totals.totalStock }}
              </p>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="card border-warning shadow h-100 p-2">
              <i
                class="bi bi-currency-exchange text-warning display-4 mb-3"
              ></i>
              <h5 class="card-title">Total Revenue</h5>
              <p class="fs-3 fw-bold text-warning">
                {{ dashboardStore.totals.totalSales }} (TSH)
              </p>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="card border-danger shadow h-100 p-2">
              <i class="bi bi-people text-danger display-4 mb-3"></i>
              <h5 class="card-title">Registered Users</h5>
              <p class="fs-3 fw-bold text-danger">
                {{ dashboardStore.totals.totalUsers }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card shadow">
          <div class="card-header bg-success text-white text-center">
            <h5>Sales Distribution</h5>
          </div>
          <div class="card-body" style="width: 90%; height: auto">
            <Doughnut
              :chartData="doughnutChartData"
              :chartOptions="doughnutChartOptions"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bar Chart & Line Chart-->
    <div class="row mt-2">
      <div class="col-lg-6">
        <div class="card shadow mb-3">
          <div class="card-header bg-primary text-white text-center">
            <h5>Sales & Cash In</h5>
          </div>
          <div class="card-body">
            <BarChart
              :chartData="salesChartData"
              :chartOptions="salesChartOptions"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card shadow mb-3">
          <div class="card-header bg-info text-white text-center">
            <h5>Cash In Over Time</h5>
          </div>
          <div class="card-body">
            <LineChart
              :chartData="lineChartData"
              :chartOptions="lineChartOptions"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
