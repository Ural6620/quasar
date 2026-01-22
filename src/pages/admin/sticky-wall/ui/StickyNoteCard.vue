<script setup lang="ts">
import type { StickyNote } from 'src/services/stickyWallApi';

const props = defineProps<{
  note: StickyNote;
}>();

const emit = defineEmits<{
  edit: [note: StickyNote];
  delete: [id: number];
}>();

function handleDelete() {
  if (props.note.id !== undefined) {
    emit('delete', props.note.id);
  }
}
</script>

<template>
  <q-card
    class="sticky-note"
    :style="{ backgroundColor: note.color }"
  >
    <q-card-section class="note-header">
      <div class="row items-center justify-between">
        <div class="text-h6 text-weight-bold note-title">
          {{ note.title }}
        </div>
        <div class="note-actions">
          <q-btn
            flat
            dense
            round
            icon="edit"
            size="sm"
            @click="$emit('edit', note)"
          />
          <q-btn
            flat
            dense
            round
            icon="delete"
            size="sm"
            color="negative"
          >
            <q-popup-proxy>
              <q-card>
                <q-card-section>
                  <div class="text-h6">Delete Note?</div>
                  <div class="text-subtitle2 q-mt-sm">Are you sure you want to delete this note?</div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Cancel" v-close-popup />
                  <q-btn flat label="Delete" color="negative" @click="handleDelete" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-popup-proxy>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="note-content">
      <div class="note-text">{{ note.content || 'No content' }}</div>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">
.sticky-note {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.note-header {
  padding-bottom: 0.5rem;
}

.note-title {
  flex: 1;
  word-break: break-word;
}

.note-actions {
  display: flex;
  gap: 0.25rem;
}

.note-content {
  flex: 1;
  padding-top: 0;
}

.note-text {
  white-space: pre-wrap;
  word-break: break-word;
  color: rgba(0, 0, 0, 0.7);
}
</style>
