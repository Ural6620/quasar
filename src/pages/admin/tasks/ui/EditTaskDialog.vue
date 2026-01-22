<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Task } from 'src/services/taskApi';

const props = defineProps<{
  modelValue: boolean;
  task: Task | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [id: number, data: { title: string; description?: string }];
}>();

const title = ref('');
const description = ref('');

watch(() => props.task, (newTask) => {
  if (newTask) {
    title.value = newTask.title;
    description.value = newTask.description || '';
  }
}, { immediate: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    title.value = '';
    description.value = '';
  }
});

const handleSubmit = () => {
  if (!props.task || !title.value.trim()) return;

  const updates: { title: string; description?: string } = {
    title: title.value.trim(),
  };
  
  if (description.value.trim()) {
    updates.description = description.value.trim();
  }

  emit('submit', props.task.id!, updates);
  emit('update:modelValue', false);
};
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Edit Task</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="title"
          label="Title"
          outlined
          autofocus
          @keyup.enter="handleSubmit"
        />
        <q-input
          v-model="description"
          label="Description (optional)"
          outlined
          type="textarea"
          class="q-mt-md"
          @keyup.enter.ctrl="handleSubmit"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="$emit('update:modelValue', false)" />
        <q-btn
          color="primary"
          label="Update"
          :disable="!title.trim()"
          @click="handleSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
