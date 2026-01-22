<script setup lang="ts">
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-content">
      <h1>Wellcome to ToDoPy</h1>
      
      <p>
        A to-do app is a simple, user-friendly digital tool designed to help individuals and teams organize tasks and manage their daily activities efficiently. Users can create, edit, and prioritize tasks, set deadlines or reminders, categorize items, and track their progress, all within an intuitive and accessible interface. These apps are essential for improving productivity, reducing stress, and ensuring that important responsibilities are not forgotten.
      </p>
      
      <q-btn
        unelevated
        push
        size="lg"
        color="green-14"
        text-color="white"
        label="Go to tasks"
        class="go-to-tasks-btn"
        to="/admin/tasks"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.dashboard-content {
  text-align: center;
  max-width: 800px;
  h1{
    font-size: 2.5rem;
    font-weight: bold;
    color: $dark;
    margin-bottom: 2rem;
  }
  p{
    font-size: 1rem;
    line-height: 1.6;
    color: $grey-8;
    margin-bottom: 2rem;
    text-align: center;   
  }
}

.go-to-tasks-btn {
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  text-transform: capitalize;
}
</style>
