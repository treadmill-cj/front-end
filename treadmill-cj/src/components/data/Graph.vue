<template>
  <v-container>
    <v-card>
      <VChart
        :option="chartOptions"
        autoresize
        style="height: 400px;"
      />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useTreadmillStore } from "@/stores/treadmillStore"; // Adjust the path as needed
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts"; // Import Vue-ECharts component

// Register required ECharts modules
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent]);

// Get speed and time records from Pinia store
const { speedRecords, timeRecords } = storeToRefs(useTreadmillStore()); // ✅ Reactively track store data

// Define chart options with explicit types
const chartOptions = ref<{
  title: { text: string };
  tooltip: { trigger: string };
  legend: { data: string[] };
  xAxis: { type: string; data: string[] };
  yAxis: { type: string; name: string };
  series: { name: string; type: string; data: number[]; smooth: boolean }[];
}>({
  title: { text: "Speed Over Time" },
  tooltip: { trigger: "axis" },
  legend: { data: ["Speed (km/h)"] },
  xAxis: { type: "category", data: [] },
  yAxis: { type: "value", name: "Speed (km/h)" },
  series: [{ name: "Speed (km/h)", type: "line", data: [], smooth: true }],
});

// Watch the store data and update the chart when records change
watch(
  [speedRecords, timeRecords],
  ([newSpeedRecords, newTimeRecords]) => {
    if (newSpeedRecords.length === newTimeRecords.length) {
      chartOptions.value.xAxis.data = [...newTimeRecords]; // Update x-axis with time records
      chartOptions.value.series[0].data = [...newSpeedRecords]; // Update series with speed records
    }
  },
  { deep: true }
);
</script>
