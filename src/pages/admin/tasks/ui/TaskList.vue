<script setup lang="ts">
import TaskItem from './TaskItem.vue';
import type { Task } from 'src/services/taskApi';

defineProps<{
  tasks: Task[];
  loading: boolean;
}>();

defineEmits<{
  toggle: [id: number];
  edit: [task: Task];
  delete: [id: number];
}>();
</script>

<template>
  <q-card v-if="!loading && tasks.length > 0">
    <q-list>
      <TaskItem
        v-for="(task, index) in tasks"
        :key="task.id ?? `task-${index}`"
        :task="task"
        :index="index"
        @toggle="$emit('toggle', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </q-list>
  </q-card>
</template>
