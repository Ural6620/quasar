<script setup lang="ts">
  import SidebarItem from 'src/components/SidebarItem.vue';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { listItems, menuItems } from 'src/constants/admin-layout';

  const router = useRouter();
  const searchQuery = ref('');
  const leftDrawerOpen = ref(true);

  function logout(): void {
    localStorage.removeItem('token');
    void router.push('/sign-in');
  }

   
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="admin-layout">
    <q-drawer 
      v-model="leftDrawerOpen" 
      :width="346"
      :breakpoint="0"
      class="menu-drawer"
      bordered
    >
      <div class="menu-header q-pa-md">
        <div class="row items-center justify-between">
          <div class="text-h5 text-weight-bold">ToDoList</div>
        </div>
      </div>

      <div class="q-pa-md">
        <q-input
          v-model="searchQuery"
          placeholder="Search..."
          outlined
          dense
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="q-pa-md">
        <div class="text-h6 text-weight-bold q-mb-md">Tasks</div>
        <q-list>
          <SidebarItem
            v-for="item in menuItems"
            :key="item.label"
            :to="item.to"
            :icon="item.icon"
            :label="item.label"
            :badge="item.badge ?? ''"
            :badgeColor="item.badgeColor ?? 'primary'"
          />
        </q-list>
      </div>

      <div class="q-pa-md">
        <div class="text-h6 text-weight-bold q-mb-md">Lists</div>        
        <q-list>
          <SidebarItem
            v-for="item in listItems"
            :key="item.label"
            :avatarColor="item.color"
            :icon="item.icon"
            :label="item.label"

          />
        </q-list>
      </div>

      <div class="menu-footer q-pa-md">
        <q-list>
          <SidebarItem
            icon="logout"
            label="Sign Out"
            @click="logout"
          />

          
        </q-list>
      </div>
    </q-drawer>

    <q-page-container class="content-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.admin-layout {
  background-color: $grey-3;
}

.menu-drawer {
  background-color: white;
  border-radius: 24px 0 0 24px;
}

.menu-header {
  border-bottom: 1px solid $grey-4;
}

.search-input {
  border-radius: 8px;
}

.menu-item-link {
  text-decoration: none;
  color: $dark;
}

.menu-item {
  border-radius: 8px;
  margin-bottom: 4px;
  
  &:hover {
    background-color: $grey-2;
  }
}

.menu-footer {
  margin-top: auto;
  border-top: 1px solid $grey-4;
}

.content-container {
  background-color: white;
  border-radius: 0 24px 24px 0;
  min-height: 100vh;
}
</style>

