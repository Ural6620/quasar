<script setup lang="ts">
import { ref, watch } from 'vue';
import type { StickyNote } from 'src/services/stickyWallApi';

const props = defineProps<{
  modelValue: boolean;
  note: StickyNote | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [data: { id: number; title: string; content: string; color: string }];
}>();

const title = ref('');
const content = ref('');
const selectedColor = ref('#FFEB3B');

const colors = [
  { name: 'Yellow', value: '#FFEB3B' },
  { name: 'Green', value: '#C8E6C9' },
  { name: 'Blue', value: '#BBDEFB' },
  { name: 'Pink', value: '#F8BBD0' },
  { name: 'Orange', value: '#FFE0B2' },
  { name: 'Purple', value: '#E1BEE7' },
];

watch(() => props.modelValue, (newVal) => {
  if (newVal && props.note) {
    title.value = props.note.title;
    content.value = props.note.content;
    selectedColor.value = props.note.color;
  } else {
    title.value = '';
    content.value = '';
    selectedColor.value = '#FFEB3B';
  }
});

const handleSubmit = () => {
  if (!props.note || !title.value.trim() || props.note.id === undefined) return;

  emit('submit', {
    id: props.note.id,
    title: title.value.trim(),
    content: content.value.trim(),
    color: selectedColor.value,
  });
  emit('update:modelValue', false);
};
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Edit Note</div>
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
          v-model="content"
          label="Content (optional)"
          outlined
          type="textarea"
          rows="4"
          class="q-mt-md"
        />

        <div class="q-mt-md">
          <div class="text-subtitle2 q-mb-sm">Color</div>
          <div class="row q-gutter-sm">
            <q-btn
              v-for="color in colors"
              :key="color.value"
              :style="{ backgroundColor: color.value }"
              :class="{ 'color-selected': selectedColor === color.value }"
              class="color-btn"
              size="md"
              @click="selectedColor = color.value"
            >
              <q-icon
                v-if="selectedColor === color.value"
                name="check"
                color="white"
              />
            </q-btn>
          </div>
        </div>
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

<style scoped lang="scss">
.color-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.2s;

  &.color-selected {
    border-color: #1976d2;
    transform: scale(1.1);
  }
}
</style>
