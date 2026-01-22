<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [data: { title: string; description?: string }];
}>();

const title = ref('');
const description = ref('');

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    title.value = '';
    description.value = '';
  }
});

const handleSubmit = () => {
  if (!title.value.trim()) return;

  const taskData: { title: string; description?: string } = {
    title: title.value.trim(),
  };
  
  if (description.value.trim()) {
    taskData.description = description.value.trim();
  }

  emit('submit', taskData);
  emit('update:modelValue', false);
  title.value = '';
  description.value = '';
};
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Add New Task</div>
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
          label="Add"
          :disable="!title.trim()"
          @click="handleSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
