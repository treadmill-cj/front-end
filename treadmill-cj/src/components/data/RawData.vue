<script lang="ts" setup>
  // import { onMounted } from "vue";
  import { useTreadmillStore } from "@/stores/treadmillStore";

  const treadmillStore = useTreadmillStore();

  // onMounted(() => {
  //   treadmillStore.all();
  // });

  // const startTreadmill = () => {
  //   treadmillStore.start();
  // };

  // const resetTreadmill = () => {
  //   treadmillStore.reset();
  // };

</script>

<template>
  <v-container>
    <v-row>{{ treadmillStore.totalDistance }}</v-row>
    <v-row>{{ treadmillStore.totalTime }}</v-row>
    <v-list>
      <v-list-item
        v-for="item in treadmillStore.unit_records"
        :key="item.timestamp"
      >
        <v-list-item-title>{{ item.total_distance }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.total_time_ms }}</v-list-item-subtitle>
        <v-list-item-subtitle>{{ item.speed }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-container>
</template>
