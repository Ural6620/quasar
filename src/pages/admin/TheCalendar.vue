<script setup lang="ts">
import { ref } from 'vue';

const selectedDate = ref('');
</script>

<template>
  <div class="calendar-page q-pa-lg">
    <div class="page-header q-mb-lg">
      <div class="text-h4 text-weight-bold">Calendar</div>
    </div>

    <q-card>
      <q-card-section>
        <q-date
          v-model="selectedDate"
          landscape
          class="calendar-widget"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.calendar-page {
  max-width: 1400px;
  margin: 0 auto;
}

.calendar-widget {
  width: 100%;
}
</style>
