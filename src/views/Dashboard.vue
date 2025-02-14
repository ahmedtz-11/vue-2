<script setup>
import { ref, watch, computed, onMounted } from "vue";
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

// Payment method sales data from API
const paymentMethodSales = ref({});
const paymentMethods = computed(() => Object.keys(paymentMethodSales.value));
const paymentAmounts = computed(() => Object.values(paymentMethodSales.value));

// Sales Trend Data
const salesTrend = ref({});
const days = computed(() => Object.keys(salesTrend.value));
const salesAmounts = computed(() => Object.values(salesTrend.value));

// Sales Trend Line Chart Data
const lineChartData = computed(() => {
  if (!salesTrend.value || Object.keys(salesTrend.value).length === 0) {
    return { labels: [], datasets: [] };
  }
  return {
    labels: days.value,
    datasets: [
      {
        label: "Sales Trend (Tsh.)",
        data: salesAmounts.value,
        borderColor: "rgba(75, 192, 195, 1)",
        backgroundColor: "rgba(75, 192, 195, 0.3)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };
});

// Sales Trend Line Chart Options
const lineChartOptions = {
  responsive: true,
  plugins: {
    filler: {
      propagate: true,
    },
  },
};

// Bar Chart Data for Payment Method Sales
const salesChartData = computed(() => {
  if (
    !paymentMethodSales.value ||
    Object.keys(paymentMethodSales.value).length === 0
  ) {
    return { labels: [], datasets: [] };
  }
  return {
    labels: paymentMethods.value,
    datasets: [
      {
        label: "Sales (Tsh.)",
        data: paymentAmounts.value,
        backgroundColor: "rgb(52, 76, 183)",
        borderColor: "rgba(52, 76, 183, 0.5)",
        borderWidth: 1,
      },
    ],
  };
});

// Bar Chart Options
const salesChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    tooltip: { enabled: true },
  },
};

// Doughnut Chart Data for Top Selling Products
const topSellingProducts = computed(() => dashboardStore.topSellingProducts);
const doughnutChartData = computed(() => {
  if (
    !topSellingProducts.value ||
    Object.keys(topSellingProducts.value).length === 0
  ) {
    return { labels: [], datasets: [] };
  }
  return {
    labels: Object.keys(topSellingProducts.value),
    datasets: [
      {
        label: "Products sold",
        data: Object.values(topSellingProducts.value),
        backgroundColor: [
          "rgb(67, 121, 242)",
          "rgb(255, 235, 0)",
          "rgb(39, 102, 123)",
          "rgb(17, 117, 84)",
          "rgb(239, 176, 54)",
        ],
      },
    ],
  };
});

const doughnutChartOptions = {
  plugins: {
    legend: { display: true },
    tooltip: { enabled: true },
  },
  responsive: true,
};

onMounted(() => {
  dashboardStore.fetchSalesTrend();
  dashboardStore.fetchTopSellingProducts();
  userStore.fetchLoggedInUser();
  dashboardStore.initializeDashboard();

  // Fetch payment method sales data
  dashboardStore.fetchPaymentMethodSales().then(() => {
    paymentMethodSales.value = { ...dashboardStore.paymentMethodSales };

    // Update the bar chart data for payment methods
    salesChartData.value = {
      labels: paymentMethods.value,
      datasets: [
        {
          label: "Sales by Payment Method (Tsh.)",
          data: paymentAmounts.value,
          backgroundColor: "rgb(52, 76, 183)",
          borderColor: "rgba(52, 76, 183, 0.5)",
          borderWidth: 1,
        },
      ],
    };
  });

  // Update the line chart data for sales trend
  dashboardStore.fetchSalesTrend().then(() => {
    salesTrend.value = { ...dashboardStore.salesTrend };

    lineChartData.value = {
      labels: days.value,
      datasets: [
        {
          label: "Sales Trend (Tsh.)",
          data: salesAmounts.value,
          borderColor: "rgba(75, 192, 195, 1)",
          backgroundColor: "rgba(75, 192, 195, 0.3)",
          borderWidth: 2,
          fill: true,
        },
      ],
    };
  });

  // Update time every second
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
      <!-- Time & Welcome Message -->
      <div class="col-lg-12 col-md-12">
        <div class="text-center">
          <h5 class="text-dark">
            {{ currentFormattedDate }} .
            <span class="text-muted fw-bold"> {{ currentFormattedTime }}</span>
          </h5>
        </div>
        <div class="card shadow-sm text-center p-2">
          <h2 class="text-dark" style="text-transform: capitalize">
            Welcome, {{ userStore.username }}!
          </h2>
          <p class="text-secondary">Here's an overview of the system.</p>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card shadow">
          <div class="card-header text-success text-center">
            <h4>Top 5 Selling Products</h4>
          </div>
          <div class="card-body" style="width: 90%; height: auto">
            <Doughnut
              :chartData="doughnutChartData"
              :chartOptions="doughnutChartOptions"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-8 text-center">
        <div class="row g-3">
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
                {{ $formatMoney(dashboardStore.totals.totalSales) }} (TSH)
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
    </div>

    <!-- Bar Chart & Line Chart-->
    <div class="row mt-2">
      <div class="col-lg-6">
        <div class="card shadow mb-3">
          <div class="card-header text-primary text-center">
            <h4>Sales from Payment Methods</h4>
          </div>
          <div class="card-body w-auto">
            <BarChart
              :chartData="salesChartData"
              :chartOptions="salesChartOptions"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card shadow mb-3">
          <div class="card-header text-info text-center">
            <h4>Sales Trend</h4>
          </div>
          <div class="card-body w-auto">
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
