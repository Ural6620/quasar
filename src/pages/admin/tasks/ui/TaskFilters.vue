<script setup lang="ts">
defineProps<{
  searchInput: string;
  filterCompleted: boolean | undefined;
}>();

const emit = defineEmits<{
  'update:searchInput': [value: string];
  'update:filterCompleted': [value: boolean | undefined];
  search: [];
}>();

function handleSearchInputUpdate(value: string | number | null) {
  emit('update:searchInput', String(value ?? ''));
}
</script>

<template>
  <div class="row q-col-gutter-md q-mb-md">
    <div class="col-12 col-md-6">
      <q-input
        :model-value="searchInput"
        placeholder="Search tasks..."
        outlined
        dense
        @update:model-value="handleSearchInputUpdate"
        @keyup.enter="emit('search')"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="col-12 col-md-6">
      <q-btn-toggle
        :model-value="filterCompleted"
        :options="[
          { label: 'All', value: undefined },
          { label: 'Active', value: false },
          { label: 'Completed', value: true },
        ]"
        @update:model-value="emit('update:filterCompleted', $event)"
      />
    </div>
  </div>
</template>
