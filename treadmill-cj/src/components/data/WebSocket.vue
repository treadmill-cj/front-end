<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useTreadmillStore } from "@/stores/treadmillStore";

// WebSocket URL (match Rust server address)
const WS_URL = "ws://localhost:5000";

const { totalDistance, records } = storeToRefs(useTreadmillStore());
const { addRecord } = useTreadmillStore();

// Reactive state for incoming data
// const totalDistance = ref(0);
const totalTime = ref(0);
const speed = ref(0);

const socket = ref(null);

const connectWebSocket = () => {
  socket.value = new WebSocket(WS_URL);

  socket.value.onopen = () => {
    console.log("Connected to Rust WebSocket server");
  };

  socket.value.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.data) {
        console.log(data.data, records.value);
        addRecord(data.data);
        // totalDistance.value = data.data.total_distance;
        // totalTime.value = data.data.total_time_ms;
        // speed.value = data.data.speed;
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  socket.value.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.value.onclose = () => {
    console.log("WebSocket Disconnected. Reconnecting...");
    setTimeout(connectWebSocket, 5000); // Reconnect after 3 seconds
  };
};

onMounted(() => connectWebSocket());
onUnmounted(() => {
  if (socket.value) socket.value.close();
});
</script>

<template>
  <v-container>
    <v-card class="pa-4">
      <h1>Live Treadmill Data</h1>
      <p><strong>Total Distance:</strong> {{ totalDistance }} meters</p>
      <p><strong>Total Time:</strong> {{ totalTime }} ms</p>
      <p><strong>Speed:</strong> {{ speed }} m/s</p>
    </v-card>
  </v-container>
</template>
