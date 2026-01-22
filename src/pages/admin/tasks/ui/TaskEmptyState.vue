<script setup lang="ts">
defineEmits<{
  addTask: [];
}>();
</script>

<template>
  <q-card>
    <q-card-section class="text-center q-pa-xl">
      <q-icon name="task_alt" size="64px" color="grey-5" />
      <div class="text-h6 text-grey-6 q-mt-md">No tasks found</div>
      <q-btn
        color="primary"
        label="Add your first task"
        class="q-mt-md"
        @click="$emit('addTask')"
      />
    </q-card-section>
  </q-card>
</template>
