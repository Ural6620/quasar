<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Task } from 'src/services/taskApi';

const props = defineProps<{
  modelValue: boolean;
  task: Task | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [id: number, data: { title: string; description?: string | null }];
}>();

const title = ref('');
const description = ref('');
const isSubmitting = ref(false);
const titleError = ref('');

watch(() => props.task, (newTask) => {
  if (newTask) {
    title.value = newTask.title;
    description.value = newTask.description || '';
    titleError.value = '';
  }
}, { immediate: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    isSubmitting.value = false;
    titleError.value = '';
  } else if (props.task) {
    title.value = props.task.title;
    description.value = props.task.description || '';
    titleError.value = '';
    isSubmitting.value = false;
  }
});

const handleSubmit = () => {
  if (!props.task || isSubmitting.value) return;

  const trimmedTitle = title.value.trim();
  if (!trimmedTitle) {
    titleError.value = 'Title is required';
    return;
  }

  titleError.value = '';
  isSubmitting.value = true;

  const updates: { title: string; description?: string | null } = {
    title: trimmedTitle,
  };
  
  const trimmedDescription = description.value.trim();
  if (trimmedDescription) {
    updates.description = trimmedDescription;
  } else {
    updates.description = null;
  }

  emit('submit', props.task.id!, updates);
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
          :error="!!titleError"
          :error-message="titleError"
          @keyup.enter="handleSubmit"
          @update:model-value="titleError = ''"
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
        <q-btn 
          flat 
          label="Cancel" 
          :disable="isSubmitting"
          @click="$emit('update:modelValue', false)" 
        />
        <q-btn
          color="primary"
          label="Update"
          :disable="!title.trim() || isSubmitting"
          :loading="isSubmitting"
          @click="handleSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
