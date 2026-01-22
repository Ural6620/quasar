<script setup lang="ts">
defineProps<{
  page: number;
  totalPages: number;
}>();

defineEmits<{
  'update:page': [value: number];
}>();
</script>

<template>
  <div v-if="totalPages > 1" class="row justify-center q-mt-lg">
    <q-pagination
      :model-value="page"
      :max="totalPages"
      :max-pages="7"
      direction-links
      @update:model-value="$emit('update:page', $event)"
    />
  </div>
</template>
