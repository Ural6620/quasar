import { ref, computed } from 'vue';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type TaskQueryParams,
} from 'src/services/taskApi';

const STORAGE_KEY = 'todopy_tasks';

function getTasksFromStorage(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

export function useTasks() {
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
  });
  const searchQuery = ref('');
  const filterCompleted = ref<boolean | undefined>(undefined);
  const togglingTasks = ref<Set<number>>(new Set());

  const filteredTasks = computed(() => {
    if (!Array.isArray(tasks.value)) {
      return [];
    }
    
    let result = [...tasks.value];
    
    if (filterCompleted.value !== undefined) {
      result = result.filter((task) => task.completed === filterCompleted.value);
    }
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }
    
    return result;
  });

  const paginatedTasks = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.limit;
    const end = start + pagination.value.limit;
    return filteredTasks.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(filteredTasks.value.length / pagination.value.limit);
  });

  const fetchTasks = async (params?: TaskQueryParams) => {
    loading.value = true;
    error.value = null;
    try {
      const queryParams: TaskQueryParams = {
        page: params?.page || pagination.value.page,
        limit: params?.limit || pagination.value.limit,
      };
      
      if (filterCompleted.value !== undefined) {
        queryParams.completed = filterCompleted.value;
      }
      
      if (searchQuery.value) {
        queryParams.search = searchQuery.value;
      }
      
      const response = await getTasks(queryParams);
      tasks.value = Array.isArray(response.items) ? response.items : [];
      pagination.value.total = response.meta?.total_items ?? 0;
      pagination.value.page = response.meta?.current_page ?? 1;
      pagination.value.limit = response.meta?.per_page ?? 10;
      if (Array.isArray(response.items)) {
        saveTasksToStorage(response.items);
      }
    } catch (apiError: unknown) {
      console.warn('API failed, using localStorage:', apiError);
      const storedTasks = getTasksFromStorage();
      tasks.value = storedTasks;
      pagination.value.total = storedTasks.length;
    } finally {
      loading.value = false;
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true;
    error.value = null;
    try {
      const newTask = await createTask(taskData);
      tasks.value.unshift(newTask);
      saveTasksToStorage(tasks.value);
      return newTask;
    } catch (apiError: unknown) {
      console.warn('API failed, using localStorage:', apiError);
      const newTask: Task = {
        ...taskData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tasks.value.unshift(newTask);
      saveTasksToStorage(tasks.value);
      return newTask;
    } finally {
      loading.value = false;
    }
  };

  const editTask = async (id: number, updates: Partial<Task>) => {
    loading.value = true;
    error.value = null;
    try {
      const updatedTask = await updateTask(id, updates);
      const index = tasks.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
        saveTasksToStorage(tasks.value);
      }
      return updatedTask;
    } catch (apiError: unknown) {
      console.warn('API failed, using localStorage:', apiError);
      const index = tasks.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        const existingTask = tasks.value[index];
        if (!existingTask) return;
        
        const updatedTask: Task = {
          title: updates.title ?? existingTask.title,
          completed: updates.completed ?? existingTask.completed,
          updatedAt: new Date().toISOString(),
        };
        
        if (existingTask.id !== undefined) {
          updatedTask.id = existingTask.id;
        }
        if (updates.description !== undefined) {
          updatedTask.description = updates.description;
        } else if (existingTask.description) {
          updatedTask.description = existingTask.description;
        }
        if (updates.dueDate !== undefined) {
          updatedTask.dueDate = updates.dueDate;
        } else if (existingTask.dueDate) {
          updatedTask.dueDate = existingTask.dueDate;
        }
        if (existingTask.createdAt !== undefined) {
          updatedTask.createdAt = existingTask.createdAt;
        }
        
        tasks.value[index] = updatedTask;
        saveTasksToStorage(tasks.value);
        return updatedTask;
      }
    } finally {
      loading.value = false;
    }
  };

  const removeTask = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await deleteTask(id);
      tasks.value = tasks.value.filter((t) => t.id !== id);
      saveTasksToStorage(tasks.value);
    } catch {
      tasks.value = tasks.value.filter((t) => t.id !== id);
      saveTasksToStorage(tasks.value);
    } finally {
      loading.value = false;
    }
  };

  const toggleTask = async (id: number) => {
    if (togglingTasks.value.has(id)) {
      return;
    }

    const index = tasks.value.findIndex((t) => t.id === id);
    if (index === -1) return;

    const task = tasks.value[index];
    if (!task) return;

    togglingTasks.value.add(id);

    const previousCompleted = task.completed;
    const newCompleted = !previousCompleted;
    
    tasks.value[index] = {
      ...task,
      completed: newCompleted,
      updatedAt: new Date().toISOString(),
    };
    saveTasksToStorage(tasks.value);

    try {
      const updatedTask = await updateTask(id, { completed: newCompleted });
      const updatedIndex = tasks.value.findIndex((t) => t.id === id);
      if (updatedIndex !== -1) {
        tasks.value[updatedIndex] = updatedTask;
        saveTasksToStorage(tasks.value);
      }
    } catch (error: unknown) {
      console.warn('API update failed, keeping local change:', error);
    } finally {
      togglingTasks.value.delete(id);
    }
  };

  const setPage = (page: number) => {
    pagination.value.page = page;
    void fetchTasks({ page });
  };

  const setLimit = (limit: number) => {
    pagination.value.limit = limit;
    pagination.value.page = 1;
    void fetchTasks({ limit });
  };

  const search = (query: string) => {
    searchQuery.value = query;
    pagination.value.page = 1;
    void fetchTasks();
  };

  const filterByCompleted = (completed?: boolean) => {
    filterCompleted.value = completed;
    pagination.value.page = 1;
    void fetchTasks();
  };

  return {
    tasks: paginatedTasks,
    allTasks: tasks,
    loading,
    error,
    pagination,
    totalPages,
    filterCompleted,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    toggleTask,
    setPage,
    setLimit,
    search,
    filterByCompleted,
  };
}
