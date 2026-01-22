<script setup lang="ts">
import type { Task } from 'src/services/taskApi';

const props = defineProps<{
  task: Task;
  index: number;
}>();

const emit = defineEmits<{
  toggle: [id: number];
  edit: [task: Task];
  delete: [id: number];
}>();

let lastToggleTime = 0;

function handleToggle() {
  const now = Date.now();
  if (now - lastToggleTime < 500) {
    return;
  }
  lastToggleTime = now;

  if (props.task.id !== undefined) {
    emit('toggle', props.task.id);
  }
}

function handleDelete() {
  if (props.task.id !== undefined) {
    emit('delete', props.task.id);
  }
}
</script>

<template>
  <q-item class="task-item">
    <q-item-section avatar>
      <q-checkbox
        :model-value="task.completed"
        @update:model-value="handleToggle"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label
        :class="{ 'text-strike': task.completed }"
        class="text-weight-medium"
      >
        {{ task.title }}
      </q-item-label>
      <q-item-label
        v-if="task.description"
        caption
        :class="{ 'text-strike': task.completed }"
      >
        {{ task.description }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <div class="row q-gutter-sm">
        <q-btn
          flat
          dense
          round
          icon="edit"
          color="primary"
          @click="$emit('edit', task)"
        />
        <q-btn
          flat
          dense
          round
          icon="delete"
          color="negative"
        >
          <q-popup-proxy>
            <q-card>
              <q-card-section>
                <div class="text-h6">Delete Task?</div>
                <div class="text-subtitle2 q-mt-sm">Are you sure you want to delete this task?</div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Delete" color="negative" @click="handleDelete" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-popup-proxy>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<style scoped lang="scss">
.task-item {
  border-bottom: 1px solid $grey-3;

  &:hover {
    background-color: $grey-1;
  }
}

.text-strike {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
