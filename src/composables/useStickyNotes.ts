import { ref } from 'vue';
import {
  getStickyNotes,
  createStickyNote,
  updateStickyNote,
  deleteStickyNote,
  type StickyNote,
} from 'src/services/stickyWallApi';

const STORAGE_KEY = 'todopy_sticky_notes';

function getNotesFromStorage(): StickyNote[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotesToStorage(notes: StickyNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes to localStorage:', error);
  }
}

export function useStickyNotes() {
  const notes = ref<StickyNote[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchNotes = async () => {
    loading.value = true;
    error.value = null;
    try {
      const fetchedNotes = await getStickyNotes();
      notes.value = Array.isArray(fetchedNotes) ? fetchedNotes : [];
      saveNotesToStorage(notes.value);
    } catch (apiError: unknown) {
      console.warn('API failed, using localStorage:', apiError);
      const storedNotes = getNotesFromStorage();
      notes.value = storedNotes;
    } finally {
      loading.value = false;
    }
  };

  const addNote = async (noteData: { title: string; content: string; color: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const newNote = await createStickyNote(noteData);
      notes.value.unshift(newNote);
      saveNotesToStorage(notes.value);
      return newNote;
    } catch (apiError: unknown) {
      console.warn('API failed, using localStorage:', apiError);
      const newNote: StickyNote = {
        ...noteData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      notes.value.unshift(newNote);
      saveNotesToStorage(notes.value);
      return newNote;
    } finally {
      loading.value = false;
    }
  };

  const editNote = async (id: number, updates: { title: string; content: string; color: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const updatedNote = await updateStickyNote(id, updates);
      const index = notes.value.findIndex((n) => n.id === id);
      if (index !== -1) {
        notes.value[index] = updatedNote;
        saveNotesToStorage(notes.value);
      }
      return updatedNote;
    } catch (apiError: unknown) {
      console.warn('API failed, using localStorage:', apiError);
      const index = notes.value.findIndex((n) => n.id === id);
      if (index !== -1) {
        const existingNote = notes.value[index];
        if (!existingNote || existingNote.id === undefined) return;
        
        const updatedNote: StickyNote = {
          title: updates.title,
          content: updates.content,
          color: updates.color,
        };
        
        if (existingNote.id !== undefined) {
          updatedNote.id = existingNote.id;
        }
        if (existingNote.createdAt !== undefined) {
          updatedNote.createdAt = existingNote.createdAt;
        }
        
        notes.value[index] = updatedNote;
        saveNotesToStorage(notes.value);
        return updatedNote;
      }
    } finally {
      loading.value = false;
    }
  };

  const removeNote = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await deleteStickyNote(id);
      notes.value = notes.value.filter((n) => n.id !== id);
      saveNotesToStorage(notes.value);
    } catch {
      notes.value = notes.value.filter((n) => n.id !== id);
      saveNotesToStorage(notes.value);
    } finally {
      loading.value = false;
    }
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote,
    editNote,
    removeNote,
  };
}
