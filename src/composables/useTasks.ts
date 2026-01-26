import { storeToRefs } from 'pinia';
import { useTaskStore } from '../stores/taskStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = ((...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  }) as T & { cancel: () => void };

  debouncedFn.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFn;
}

export function useTasks() {
  const taskStore = useTaskStore();
  
  const {
    tasks,
    loading,
    error,
    pagination,
    totalPages,
    filterCompleted,
    searchQuery,
  } = storeToRefs(taskStore);

  const debouncedSearch = useDebounceFn((query: string) => {
    taskStore.search(query);
  }, 500);

  const searchImmediate = (query: string) => {
    debouncedSearch.cancel();
    taskStore.search(query);
  };

  const searchDebounced = (query: string) => {
    debouncedSearch(query);
  };

  return {
    tasks,
    loading,
    error,
    pagination,
    totalPages,
    filterCompleted,
    searchQuery,
    fetchTasks: taskStore.fetchTasks.bind(taskStore),
    addTask: taskStore.addTask.bind(taskStore),
    editTask: taskStore.editTask.bind(taskStore),
    removeTask: taskStore.removeTask.bind(taskStore),
    toggleTask: taskStore.toggleTask.bind(taskStore),
    setPage: taskStore.setPage.bind(taskStore),
    setLimit: taskStore.setLimit.bind(taskStore),
    search: searchDebounced,
    searchImmediate,
    filterByCompleted: taskStore.filterByCompleted.bind(taskStore),
  };
}
