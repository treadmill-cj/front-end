<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Line } from "vue-chartjs";
import { Chart as ChartJS } from "chart.js";
import { useChartData } from "vue-chartjs";

// Reactive sparkline data
const dataPoints = ref([10, 15, 12, 20, 18, 25, 30, 28, 35]);

// Simulate real-time updates
onMounted(() => {
  setInterval(() => {
    if (dataPoints.value.length >= 10) {
      dataPoints.value.shift(); // Remove the oldest value
    }
    dataPoints.value.push(Math.floor(Math.random() * 40)); // Add a new random value
  }, 2000);
});

const chartData = ref({
  labels: dataPoints.value,
  datasets: [
    {
      data: dataPoints.value,
      borderColor: "blue",
      fill: true,
      tension: 0.4, // For smooth curve
      borderWidth: 2,
    },
  ],
});

</script>

<template>
  <v-container class="pa-4">
    <v-card class="pa-4">
      <h3>Sparkline Graph</h3>
      <Line :data="chartData" :options="{ responsive: true, maintainAspectRatio: false }" />
    </v-card>
  </v-container>
</template>
