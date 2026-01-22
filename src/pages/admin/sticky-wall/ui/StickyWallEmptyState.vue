<script setup lang="ts">
defineEmits<{
  addNote: [];
}>();
</script>

<template>
  <div class="empty-state text-center q-pa-xl">
    <q-icon name="note" size="64px" color="grey-5" />
    <div class="text-h6 text-grey-6 q-mt-md">No sticky notes yet</div>
    <q-btn
      color="primary"
      label="Add your first note"
      class="q-mt-md"
      @click="$emit('addNote')"
    />
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  margin-top: 4rem;
}
</style>
