<script setup lang="ts">
defineEmits<{
  addTask: [];
}>();
</script>

<template>
  <div class="page-header q-mb-lg">
    <div class="row items-center justify-between">
      <div class="text-h4 text-weight-bold">Tasks</div>
      <q-btn
        color="primary"
        label="Add Task"
        icon="add"
        @click="$emit('addTask')"
      />
    </div>
  </div>
</template>
