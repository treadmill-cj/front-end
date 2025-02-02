<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useTreadmillStore } from "@/stores/treadmillStore";

// WebSocket URL (match Rust server address)
const WS_URL = import.meta.env.VITE_WS_URL;

const {  total_distance, total_time_ms, unit_records  } = storeToRefs(useTreadmillStore());
const { addRecord } = useTreadmillStore();

// Reactive state for incoming data
// const totalDistance = ref(0);
const speed = ref(0);

const socket = ref(null);

const connectWebSocket = () => {
  socket.value = new WebSocket(WS_URL);

  // socket.value.onopen = () => {
  //   console.log("Connected to Rust WebSocket server");
  // };

  socket.value.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (!data.data) return
      if (data.data.total_distance < total_distance.value) {
        unit_records.value = []
        // unit_records.value.push(data.data)
      }
      addRecord(data.data)
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  socket.value.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.value.onclose = () => {
    console.log("WebSocket Disconnected. Reconnecting...");
    setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
  };
};

onMounted(() => connectWebSocket());
onUnmounted(() => {
  if (socket.value) socket.value.close();
});

const convertNumberToTime = (number: number) => {
  const hours = Math.floor(number / 3600);
  const minutes = Math.floor((number % 3600) / 60);
  const seconds = number % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

</script>

<template>
  <v-container>
    <v-card class="pa-4">
      <h1>Live Treadmill Data</h1>
      <p><strong>Total Distance:</strong> {{ total_distance }} meters</p>
      <p><strong>Total Time:</strong> {{ convertNumberToTime(total_time_ms) }} ms</p>
      <p><strong>Speed:</strong> {{ speed }} m/s</p>
    </v-card>
  </v-container>
</template>
