<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleGetStarted = () => {
  void router.push('/sign-Up')
}

const handleSignIn = () => {
  void router.push('/sign-in')
}
</script>

<template>
  <div class="home-content text-center">
    <div class="text-h2 text-weight-bold q-mb-md">
      ToDo Py
    </div>
    
    <div class="text-h5 text-weight-medium   text-left">
      Stay Organized, Get Things Done: Your Ultimate To-Do List App.
    </div>
    
    <div class="text-h5 q-mb-md text-left ">
      A todo list app is a digital task management tool designed to help users organize and prioritize their daily activities and responsibilities.
    </div>
    
    <q-btn
      unelevated 
      push      
      size="lg"
      color="green-14"
      text-color="white"
      label="Get Started"
      class="q-mb-lg text-capitalize full-width"
      @click="handleGetStarted"
    />
    
    <div class="text-h6">
      Already have an account? 
      <a href="#" @click.prevent="handleSignIn">Sign In</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-content {
  max-width: 100%;
}
a{
    text-decoration: none;
    color: $primary;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

</style>