import { defineStore } from "pinia";
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import type { Ref, ComputedRef } from "vue";

const apiUrl = import.meta.env.VITE_API_URL;

type TreadmillRecord = {
  distance: number;
  timestamp: string; // Ensure ISO 8601 format for consistency
};

export const useTreadmillStore = defineStore("treadmillData", () => {

  const err: Ref<string | null> = ref(null);
  const records: Ref<Array<TreadmillRecord>> = ref([]);

  const totalDistance = computed(() => {
    return records.value.length > 0
      ? records.value[records.value.length - 1].distance
      : 0;
  });

  const totalTime = computed(() => {
    if (records.value.length < 2) return 0;

    const start = new Date(records.value[0].timestamp).getTime();
    const end = new Date(records.value[records.value.length - 1].timestamp).getTime();

    return end - start;
  });

  const start = async () => {
    try {
      await axios.post(`${apiUrl}/start`);
    } catch (error) {
      err.value = "Error stopping treadmill"
      console.error("Error starting treadmill:", error);
    }
  };

  const reset = async () => {
    records.value = [];
    try {
      await axios.post(`${apiUrl}/stop`);
    } catch (error) {
      err.value = "Error stopping treadmill"
      console.error("Error stopping treadmill:", error);
    }
  };

  const all = async () => {
    try {
      const response = await axios.get(`${apiUrl}/all.json`);
      records.value = response.data;
    } catch (error) {
      err.value = "Error stopping treadmill"
      console.error("Error fetching treadmill data:", error);
    }
  }

  onMounted(() => {
    all();
  });

  // Current speed calculation should be handled by WebSocket, but included for reference
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentSpeed: ComputedRef<number> = computed(() => {
    if (records.value.length < 2) return 0;

    const last = records.value[records.value.length - 1];
    const prev = records.value[records.value.length - 2];

    const distanceDiff = last.distance - prev.distance;
    const timeDiff =
      (new Date(last.timestamp).getTime() -
        new Date(prev.timestamp).getTime()) /
      1000;

    return timeDiff > 0 ? distanceDiff / timeDiff : 0;
  })

  return {
    err,
    records,
    totalDistance,
    totalTime,
    start,
    reset,
    all,
  };
});
