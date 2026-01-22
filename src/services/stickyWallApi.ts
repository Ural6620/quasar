import { apiClient } from './apiClient';

export interface StickyNote {
  id?: number;
  title: string;
  content: string;
  color: string;
  createdAt?: string;
}

export const getStickyNotes = async (): Promise<StickyNote[]> => {
  const response = await apiClient.get('/sticky-notes');
  return response.data;
};

export const createStickyNote = async (note: Omit<StickyNote, 'id' | 'createdAt'>): Promise<StickyNote> => {
  const response = await apiClient.post('/sticky-notes', note);
  return response.data;
};

export const updateStickyNote = async (id: number, note: Partial<StickyNote>): Promise<StickyNote> => {
  const response = await apiClient.patch(`/sticky-notes/${id}`, note);
  return response.data;
};

export const deleteStickyNote = async (id: number): Promise<void> => {
  await apiClient.delete(`/sticky-notes/${id}`);
};
