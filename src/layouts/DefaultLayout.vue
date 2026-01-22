<script setup lang="ts">  
import defaultBackground from '../assets/images/default-background.png'
</script>
<template>
  <q-layout view="hHh Lpr fFf" class="default-layout">   
    <q-page-container class="default-layout-container">    
      <div class="layout-wrapper">
        <div class="layout-container">
          <div class="left-column">
            <div class="left-card">
              <img
                :src="defaultBackground"
                alt="Background"
                class="background-image"
              />
            </div>
          </div>
          
          <div class="right-column">
            <div class="right-card">
              <router-view />
            </div>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.default-layout {
  background-color: $grey-3;
  height: 100vh;
  overflow: hidden;
}

.default-layout-container {
  height: 100%;
  padding: 0;
}

.layout-wrapper {
  height: 100%;
  padding: 2.5rem;
}

.layout-container {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 1.25rem;
}

.left-column {
  width: 50%;
  height: 100%;
  padding-right: 0.625rem;
}

.left-card {
  width: 100%;
  height: 100%;
  border-radius: 40px;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.right-column {
  width: 50%;
  height: 100%;
  padding-left: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:   #FFF9f9;
  border-radius: 40px;
}
.right-card {
  max-width: 60%;
  overflow: hidden;
}

</style>
