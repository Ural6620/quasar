<script setup lang="ts">
  import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerUser } from 'src/services/loginApi';
  const router = useRouter();
  const email = ref<string>('');
  const password = ref<string>('');
  const firstName = ref<string>('');
  const lastName = ref<string>('');
  const confirmPassword = ref<string>('');
  const isPwd = ref(true);

  const handleSignIn = () => {
    void router.push('/sign-in')
  } 
 
  const loading = ref(false);
  const errorMessage = ref<string>('');

  const handleRegister = async () => {
      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match';
        return;
      }

      loading.value = true;
      errorMessage.value = '';
      
      try {
        const data = {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value
        }
        const response = await registerUser(data)
        console.log('User created:', response)
        void router.push('/sign-in')
      } catch (error) {
        console.error('Registration error:', error)
      } finally {
        loading.value = false;
      }
  }
  </script>
  
  <template>
    <div class="home-content text-center">
      <div class="text-h2 text-weight-bold q-mb-md text-left">
        Sign Up
      </div>
      
    <q-form class="q-mb-lg" @submit.prevent="handleRegister" autocomplete="off">   
      <q-input
        v-model.trim="firstName"
        label="First Name"
        type="text"
        required
        :rules="[val => !!val || 'First Name is required']"
        :disable="loading"
      />
      <q-input
        v-model.trim="lastName"
        label="Last Name"
        type="text"
        required
        :rules="[val => !!val || 'Last Name is required']"
        :disable="loading"
      />
      <q-input
        v-model.trim="email"
        label="Email"
        type="email"
        required
        :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Email must be valid']"
        :disable="loading"
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

     
      
      <q-input
        v-model.trim="confirmPassword"
        label="Confirm Password"
        type="password"
        required
        :rules="[val => !!val || 'Confirm Password is required', val => val === password || 'Passwords do not match']"
        :disable="loading"
      />
      
      <q-banner v-if="errorMessage" class="bg-negative text-white q-mb-md">
        {{ errorMessage }}
      </q-banner>

      <q-btn
        unelevated 
        push      
        size="lg"
        color="green-14"
        text-color="white"
        label="Sign Up"
        class="q-mb-lg text-capitalize full-width"
        type="submit"
        :loading="loading"
        :disable="loading"
      />
    </q-form>
      
      <div class="text-h6">
        Already have an account? <a href="#" @click.prevent="handleSignIn">Sign In</a>
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