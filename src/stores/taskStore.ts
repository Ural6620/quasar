import { defineStore } from 'pinia';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type TaskQueryParams,
} from 'src/services/taskApi';

const STATE_STORAGE_KEY = 'todopy_tasks_state';
const TASKS_STORAGE_KEY = 'todopy_tasks';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  searchQuery: string;
  filterCompleted: boolean | undefined;
  togglingTasks: Set<number>;
}

interface PersistedState {
  pagination: {
    page: number;
    limit: number;
  };
  searchQuery: string;
  filterCompleted: boolean | undefined;
}

function getStateFromStorage(): PersistedState | null {
  try {
    const stored = localStorage.getItem(STATE_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as PersistedState;
  } catch {
    return null;
  }
}

function saveStateToStorage(state: PersistedState): void {
  try {
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

function getTasksFromStorage(): Task[] {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

function mergeTasksWithStorage(newTasks: Task[]): Task[] {
  const storedTasks = getTasksFromStorage();
  const taskMap = new Map<number, Task>();
  
  storedTasks.forEach(task => {
    if (task.id !== undefined) {
      taskMap.set(task.id, task);
    }
  });
  
  newTasks.forEach(task => {
    if (task.id !== undefined) {
      taskMap.set(task.id, task);
    }
  });
  
  return Array.from(taskMap.values());
}

export const useTaskStore = defineStore('tasks', {
  state: (): TaskState => {
    const restoredState = getStateFromStorage();
    
    return {
      tasks: [],
      loading: false,
      error: null,
      pagination: {
        page: restoredState?.pagination?.page ?? 1,
        limit: restoredState?.pagination?.limit ?? 10,
        total: 0,
      },
      searchQuery: restoredState?.searchQuery ?? '',
      filterCompleted: restoredState?.filterCompleted ?? undefined,
      togglingTasks: new Set<number>(),
    };
  },

  getters: {
    totalPages: (state) => {
      if (state.pagination.total === 0) return 1;
      return Math.ceil(state.pagination.total / state.pagination.limit);
    },
  },

  actions: {
    async fetchTasks(params?: TaskQueryParams) {
      this.loading = true;
      this.error = null;
      try {
        const queryParams: TaskQueryParams = {
          page: params?.page || this.pagination.page,
          limit: params?.limit || this.pagination.limit,
        };

        if (this.filterCompleted !== undefined) {
          queryParams.completed = this.filterCompleted;
        }

        if (this.searchQuery) {
          queryParams.title = this.searchQuery;
        }

        const response = await getTasks(queryParams);
        this.tasks = Array.isArray(response.items) ? response.items : [];
        this.pagination.total = response.meta?.total_items ?? 0;
        if (params?.page) {
          this.pagination.page = params.page;
        } else {
          this.pagination.page = response.meta?.current_page ?? this.pagination.page;
        }
        this.pagination.limit = response.meta?.per_page ?? this.pagination.limit;
        
        if (Array.isArray(response.items) && response.items.length > 0) {
          const mergedTasks = mergeTasksWithStorage(response.items);
          saveTasksToStorage(mergedTasks);
        }
      } catch (apiError: unknown) {
        console.warn('API failed:', apiError);
        this.error = apiError instanceof Error ? apiError.message : 'Failed to fetch tasks';
        this.tasks = [];
        this.pagination.total = 0;
      } finally {
        this.loading = false;
      }
    },

    async addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      this.error = null;
      try {
        const newTask = await createTask(taskData);
        
        const allTasks = getTasksFromStorage();
        allTasks.unshift(newTask);
        saveTasksToStorage(allTasks);
        
        if (this.pagination.page === 1) {
          await this.fetchTasks();
        } else {
          this.tasks.unshift(newTask);
          if (this.tasks.length > this.pagination.limit) {
            this.tasks = this.tasks.slice(0, this.pagination.limit);
          }
        }
        return newTask;
      } catch (apiError: unknown) {
        console.warn('API failed:', apiError);
        this.error = apiError instanceof Error ? apiError.message : 'Failed to add task';
        throw apiError;
      } finally {
        this.loading = false;
      }
    },

    async editTask(id: number, updates: Partial<Task> & { description?: string | null }) {
      this.loading = true;
      this.error = null;
      try {
        const updatedTask = await updateTask(id, updates);
        
        const allTasks = getTasksFromStorage();
        const storageIndex = allTasks.findIndex((t) => t.id === id);
        if (storageIndex !== -1) {
          allTasks[storageIndex] = updatedTask;
          saveTasksToStorage(allTasks);
        }
        
        const index = this.tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        return updatedTask;
      } catch (apiError: unknown) {
        console.warn('API failed:', apiError);
        this.error = apiError instanceof Error ? apiError.message : 'Failed to edit task';
        throw apiError;
      } finally {
        this.loading = false;
      }
    },

    async removeTask(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await deleteTask(id);
        
        const allTasks = getTasksFromStorage();
        const filtered = allTasks.filter((t) => t.id !== id);
        saveTasksToStorage(filtered);
        
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.pagination.total = Math.max(0, this.pagination.total - 1);
        if (this.tasks.length === 0 && this.pagination.page > 1) {
          this.pagination.page -= 1;
          await this.fetchTasks();
        }
      } catch (apiError: unknown) {
        console.warn('API failed:', apiError);
        this.error = apiError instanceof Error ? apiError.message : 'Failed to remove task';
        
        const allTasks = getTasksFromStorage();
        const filtered = allTasks.filter((t) => t.id !== id);
        saveTasksToStorage(filtered);
        
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.pagination.total = Math.max(0, this.pagination.total - 1);
      } finally {
        this.loading = false;
      }
    },

    async toggleTask(id: number) {
      if (this.togglingTasks.has(id)) {
        return;
      }

      const index = this.tasks.findIndex((t) => t.id === id);
      if (index === -1) return;

      const task = this.tasks[index];
      if (!task) return;

      this.togglingTasks.add(id);

      const previousCompleted = task.completed;
      const newCompleted = !previousCompleted;

      this.tasks[index] = {
        ...task,
        completed: newCompleted,
        updatedAt: new Date().toISOString(),
      };

      try {
        const updatedTask = await updateTask(id, { completed: newCompleted });
        
        const allTasks = getTasksFromStorage();
        const storageIndex = allTasks.findIndex((t) => t.id === id);
        if (storageIndex !== -1) {
          allTasks[storageIndex] = updatedTask;
          saveTasksToStorage(allTasks);
        }
        
        const updatedIndex = this.tasks.findIndex((t) => t.id === id);
        if (updatedIndex !== -1) {
          this.tasks[updatedIndex] = updatedTask;
        }
      } catch (error: unknown) {
        console.warn('API update failed, keeping local change:', error);
      } finally {
        this.togglingTasks.delete(id);
      }
    },

    saveState() {
      saveStateToStorage({
        pagination: {
          page: this.pagination.page,
          limit: this.pagination.limit,
        },
        searchQuery: this.searchQuery,
        filterCompleted: this.filterCompleted,
      });
    },

    setPage(page: number) {
      this.pagination.page = page;
      this.saveState();
      void this.fetchTasks({ page });
    },

    setLimit(limit: number) {
      this.pagination.limit = limit;
      this.pagination.page = 1;
      this.saveState();
      void this.fetchTasks({ limit });
    },

    search(query: string) {
      this.searchQuery = query;
      this.pagination.page = 1;
      this.saveState();
      void this.fetchTasks();
    },

    filterByCompleted(completed?: boolean) {
      this.filterCompleted = completed;
      this.pagination.page = 1;
      this.saveState();
      void this.fetchTasks();
    },
  },
});