<script setup lang="ts">
import StickyNoteCard from './StickyNoteCard.vue';
import type { StickyNote } from 'src/services/stickyWallApi';

defineProps<{
  notes: StickyNote[];
}>();

defineEmits<{
  edit: [note: StickyNote];
  delete: [id: number];
}>();
</script>

<template>
  <div class="notes-grid">
    <StickyNoteCard
      v-for="(note, index) in notes"
      :key="note.id ?? `note-${index}`"
      :note="note"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.notes-grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  @media (min-width: 601px) and (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 961px) and (max-width: 1264px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1265px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
