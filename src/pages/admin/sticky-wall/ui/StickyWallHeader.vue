<script setup lang="ts">
defineEmits<{
  addNote: [];
}>();
</script>

<template>
  <div class="page-header q-mb-lg">
    <div class="row items-center justify-between">
      <div class="text-h4 text-weight-bold">Sticky Wall</div>
      <q-btn
        color="primary"
        icon="add"
        label="Add Note"
        unelevated
        @click="$emit('addNote')"
      />
    </div>
  </div>
</template>
