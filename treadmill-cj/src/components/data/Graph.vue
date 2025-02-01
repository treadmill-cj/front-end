<script setup lang="ts">
import { ref, onMounted } from "vue";

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
</script>

<template>
  <v-container class="pa-4">
    <v-card class="pa-4">
      <h3>Sparkline Graph</h3>
      <v-sparkline
        :value="dataPoints"
        color="blue"
        smooth
        :line-width="2"
        :fill="true"
        type="trend"
      />
    </v-card>
  </v-container>
</template>
