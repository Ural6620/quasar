<script setup lang="ts">
defineProps<{
  to?: string | undefined
  icon?: string | undefined
  avatarColor?: string | undefined
  label: string
  badge?: string
  badgeColor?: string | undefined
}>()

</script>
<template>
  <q-item
  clickable
  :to="to ?? undefined"
  class="menu-item"
>
  <q-item-section avatar>
    <q-icon v-if="icon" v-bind="{ name: icon }" />
    <q-avatar v-else size="sm" :color="avatarColor ?? 'grey-3'" />
  </q-item-section>

  <q-item-section>
    <q-item-label>{{ label }}</q-item-label>
  </q-item-section>

  <q-item-section side v-if="badge">
    <q-badge :color="badgeColor" :label="badge" /> 
  </q-item-section>
</q-item>
</template>