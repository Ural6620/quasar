<script setup lang="ts">
  import { loginUser } from 'src/services/loginApi';
  import type { AxiosError } from 'axios';  
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const email = ref<string>('');
  const password = ref<string>('');
  const loading = ref(false);
  const errorMessage = ref<string>('');
  const isPwd = ref(true);

  const handleSignUp = () => {
    void router.push('/sign-up')
  }

  const handleSignIn = async () => {
    loading.value = true;
    errorMessage.value = '';
    
    try {
      const credentials = {
        email: email.value,
        password: password.value
      };
      
      const response = await loginUser(credentials);
      localStorage.setItem('token', response.token);
      
      void router.push('/admin');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      errorMessage.value = axiosError?.response?.data?.message || axiosError?.message || 'Invalid email or password';
    } finally {
      loading.value = false;
    }
  }
</script>
  
<template>
    <div class="home-content text-center">
      <div class="text-h2 text-weight-bold q-mb-md text-left">
        Sign In
      </div>
      
    <q-form class="q-mb-lg" @submit.prevent="handleSignIn">
      <q-input
        v-model.trim="email"
        label="Email"
        type="email"
        required
         :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Email must be valid']"
      />
      <q-input 
        v-model.trim="password" 
        :type="isPwd ? 'password' : 'text'"
        label="Password"
        required
        :rules="[val => !!val || 'Password is required', val => val.length >= 6 || 'Password must be at least 6 characters']"
        :disable="loading"
      >
        <template v-slot:append>
          <q-btn
            flat
            dense
            round
            :icon="isPwd ? 'visibility_off' : 'visibility'"
            @click="isPwd = !isPwd"
            tabindex="-1"
          />
        </template>
      </q-input>
      <q-banner v-if="errorMessage" class="bg-negative text-white q-mb-md">
        {{ errorMessage }}
      </q-banner>

      <q-btn
        unelevated 
        push      
        size="lg"
        color="green-14"
        text-color="white"
        label="Sign In"
        class="q-mb-lg text-capitalize full-width"
        type="submit"
        :loading="loading"
        :disable="loading"
      />
    </q-form> 
     
      
      <div class="text-h6">
        Don't have an account? <a href="#" @click.prevent="handleSignUp">Sign Up</a>
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