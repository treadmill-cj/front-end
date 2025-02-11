<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useTreadmillStore } from "@/stores/treadmillStore";

import type { Ref } from "vue";

// WebSocket URL (match Rust server address)
const WS_URL = import.meta.env.VITE_WS_URL;

const {  total_distance, total_time_ms, unit_records, speed  } = storeToRefs(useTreadmillStore());
const { addRecord } = useTreadmillStore();

// Reactive state for incoming data
// const totalDistance = ref(0);

const socket: Ref<WebSocket | null> = ref(null);

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
  const totalSeconds = number / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

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
      <p><strong>Total Distance:</strong> {{ total_distance }} ft</p>
      <p><strong>Total Time:</strong> {{ convertNumberToTime(total_time_ms) }} </p>
      <p><strong>Speed:</strong> {{ Math.round(speed) }} m/s</p>
    </v-card>
  </v-container>
</template>
