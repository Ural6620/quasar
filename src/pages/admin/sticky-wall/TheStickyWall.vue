<script setup lang="ts">
import { ref, onMounted } from 'vue';
import StickyWallHeader from './ui/StickyWallHeader.vue';
import StickyNoteGrid from './ui/StickyNoteGrid.vue';
import StickyWallEmptyState from './ui/StickyWallEmptyState.vue';
import AddNoteDialog from './ui/AddNoteDialog.vue';
import EditNoteDialog from './ui/EditNoteDialog.vue';
import { useStickyNotes } from 'src/composables/useStickyNotes';
import type { StickyNote } from 'src/services/stickyWallApi';


const {
  notes,
  loading,
  fetchNotes,
  addNote,
  editNote,
  removeNote,
} = useStickyNotes();

const showAddDialog = ref(false);
const showEditDialog = ref(false);
const editingNote = ref<StickyNote | null>(null);

const handleAddNote = async (data: { title: string; content: string; color: string }) => {
  await addNote(data);
};

const handleEditNote = async (data: { id: number; title: string; content: string; color: string }) => {
  await editNote(data.id, {
    title: data.title,
    content: data.content,
    color: data.color,
  });
  showEditDialog.value = false;
  editingNote.value = null;
};

const handleDeleteNote = async (id: number) => {
  await removeNote(id);
};

function openEditDialog(note: StickyNote) {
  editingNote.value = note;
  showEditDialog.value = true;
}

onMounted(() => {
  void fetchNotes();
});
</script>

<template>
  <div class="sticky-wall-page q-pa-lg">
    <StickyWallHeader @add-note="showAddDialog = true" />

    <div v-if="loading && notes.length === 0" class="text-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <StickyWallEmptyState
      v-else-if="!loading && notes.length === 0"
      @add-note="showAddDialog = true"
    />

    <StickyNoteGrid
      v-else
      :notes="notes"
      @edit="openEditDialog"
      @delete="handleDeleteNote"
    />

    <AddNoteDialog
      v-model="showAddDialog"
      @submit="handleAddNote"
    />

    <EditNoteDialog
      v-model="showEditDialog"
      :note="editingNote"
      @submit="handleEditNote"
    />
  </div>
</template>

<style scoped lang="scss">
.sticky-wall-page {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
