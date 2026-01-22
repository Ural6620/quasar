import { apiClient } from './apiClient';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskResponse {
  items: Task[];
  meta: {
    total_items: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    remaining_count: number;
  };
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  completed?: boolean;
  search?: string;
}

export const getTasks = async (params?: TaskQueryParams): Promise<TaskResponse> => {
  const response = await apiClient.get('/tasks', { params });
  return response.data;
};

export const getTask = async (id: number): Promise<Task> => {
  const response = await apiClient.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  const response = await apiClient.post('/tasks', task);
  return response.data;
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const response = await apiClient.patch(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};
