<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTasks } from 'src/composables/useTasks';
import type { Task } from 'src/services/taskApi';
import TaskHeader from './ui/TaskHeader.vue';
import TaskFilters from './ui/TaskFilters.vue';
import TaskList from './ui/TaskList.vue';
import TaskEmptyState from './ui/TaskEmptyState.vue';
import TaskPagination from './ui/TaskPagination.vue';
import AddTaskDialog from './ui/AddTaskDialog.vue';
import EditTaskDialog from './ui/EditTaskDialog.vue';

const {
  tasks,
  loading,
  pagination,
  totalPages,
  filterCompleted,
  fetchTasks,
  addTask,
  editTask,
  removeTask,
  toggleTask,
  setPage,
  search,
  filterByCompleted,
} = useTasks();

const editingTask = ref<Task | null>(null);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const searchInput = ref('');

onMounted(() => {
  void fetchTasks();
});

const handleAddTask = async (taskData: { title: string; description?: string }) => {
  await addTask({
    ...taskData,
    completed: false,
  });
};

const handleEditTask = (task: Task) => {
  editingTask.value = task;
  showEditDialog.value = true;
};

const handleUpdateTask = async (id: number, updates: { title: string; description?: string }) => {
  await editTask(id, updates);
  showEditDialog.value = false;
  editingTask.value = null;
};

const handleDeleteTask = async (id: number) => {
  await removeTask(id);
};

const handleSearch = () => {
  search(searchInput.value);
};

const handleFilterChange = (completed?: boolean) => {
  filterByCompleted(completed);
};

const handlePageChange = (page: number) => {
  setPage(page);
};
</script>

<template>
  <div class="tasks-page q-pa-lg">
    <TaskHeader @add-task="showAddDialog = true" />

    <TaskFilters
      v-model:search-input="searchInput"
      v-model:filter-completed="filterCompleted"
      @search="handleSearch"
      @update:filter-completed="handleFilterChange"
    />

    <TaskList
      :tasks="tasks"
      :loading="loading"
      @toggle="toggleTask"
      @edit="handleEditTask"
      @delete="handleDeleteTask"
    />

    <TaskEmptyState
      v-if="!loading && tasks.length === 0"
      @add-task="showAddDialog = true"
    />

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <TaskPagination
      :page="pagination.page"
      :total-pages="totalPages"
      @update:page="handlePageChange"
    />

    <AddTaskDialog
      v-model="showAddDialog"
      @submit="handleAddTask"
    />

    <EditTaskDialog
      v-model="showEditDialog"
      :task="editingTask"
      @submit="handleUpdateTask"
    />
  </div>
</template>

<style scoped lang="scss">
.tasks-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
