import { defineStore } from "pinia";
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import type { Ref, ComputedRef } from "vue";

const apiUrl = import.meta.env.VITE_API_URL;

type TreadmillRecord = {
  total_distance: number;
  total_time_ms: string; // Ensure ISO 8601 format for consistency
  speed: number;
};

export const useTreadmillStore = defineStore("treadmillData", () => {

  const err: Ref<string | null> = ref(null);
  const unit_records: Ref<Array<TreadmillRecord>> = ref([]);

  const speedRecords: ComputedRef<number[]> = computed(() => {
    return unit_records.value.map((record) => record.speed);
  });

  const timeRecords: ComputedRef<string[]> = computed(() => {
    return unit_records.value.map((record) => record.total_time_ms);
  });

  const speed: ComputedRef<number> = computed(() => {
    if (unit_records.value.length === 0) return 0
    return unit_records.value[unit_records.value.length - 1].speed
  })

  const total_distance: ComputedRef<number> = computed(() => {
    return unit_records.value.length > 0
      ? unit_records.value[unit_records.value.length - 1].total_distance
      : 0;
  });

  const total_time_ms: ComputedRef<number> = computed(() => {
    if (unit_records.value.length < 2) return 0;

    const start = new Date(unit_records.value[0].total_time_ms).getTime();
    const end = new Date(unit_records.value[unit_records.value.length - 1].total_time_ms).getTime();

    return end - start;
  });

  const addRecord = (record: TreadmillRecord) => {
    unit_records.value.push(record);
  };

  const reset = async () => {
    unit_records.value = [];
    try {
      await axios.post(`${apiUrl}/stop`);
    } catch (error) {
      err.value = "Error stopping treadmill"
      console.error("Error stopping treadmill:", error);
    }
  };

  const all = async () => {
    try {
      const response = await axios.get(`${apiUrl}/all`);
      unit_records.value = response.data;
    } catch (error) {
      err.value = "Error stopping treadmill"
      console.error("Error fetching treadmill data:", error);
    }
  }

  onMounted(() => {
    all();
  });


  return {
    err,
    unit_records,
    speedRecords,
    timeRecords,
    speed,
    total_distance,
    total_time_ms,
    addRecord,
    reset,
    all,
  };
});
