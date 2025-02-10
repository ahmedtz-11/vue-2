<script setup>
import { defineProps } from "vue";
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, Filler);

const props = defineProps({
  chartData: Object,
  chartOptions: Object,
});
</script>

<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>
