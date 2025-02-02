<script lang="ts" setup>
  //
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-row><Graph /></v-row>
        <v-row><WebSocket /></v-row>
      </v-col>
      <v-col>
        <video controls>
          <source src="/src/assets/BigBuckBunny_320x180.mp4" type="video/mp4">
          does not work
        </video>
      </v-col>
    </v-row>
  </v-container>
  <!-- <RawData />
  <WebSocket />/ -->
</template>
