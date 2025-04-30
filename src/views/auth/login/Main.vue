<script setup>
import { ref, reactive, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { EyeIcon, EyeOffIcon, AlertTriangleIcon } from "lucide-vue-next";
import { makeRequest } from "@/requests/requests";

// Router
const router = useRouter();

// Check if user is already logged in
if (localStorage.getItem('token')) {
  router.push({ name: 'home' });
}

// State variables
const error = ref("");
const checkTnC = ref(false);

// Password visibility toggle
const passwordFields = reactive({
  showLoginPassword: false,
  showOTPPassword: false,
});

function togglePasswordVisibility(field) {
  passwordFields[field] = !passwordFields[field];
}

// Login form data and validation
const loginFormData = reactive({
  "broker_userid": '',
  "broker_password": '',
});

const loginFormRules = {
  broker_userid: {
    required,
    minLength: minLength(6),
  },
  broker_password: {
    required
  },
};

const validateLogin = useVuelidate(loginFormRules, loginFormData);

// Login function
const login = async () => {
  try {
    validateLogin.value.$touch();
    if (!validateLogin.value.$invalid) {
      const response = await makeRequest("login", "POST", loginFormData);

      if (response) {
        console.log(response);
        localStorage.setItem('token', `Bearer ${response.token}`);
        
        // Redirect to dashboard
        router.push({ name: 'home' });
      } else {
        error.value = "Invalid broker ID or password. Please try again.";
      }
    }
  } catch (err) {
    error.value = "An error occurred during login. Please try again.";
  }
};


</script>

<template>
  <section class="flex items-center min-h-screen font-geist">
    <!-- Left side background -->
    <div class="hidden md:block md:w-1/2 bg-[#1A1919] min-h-[50vh] md:h-screen text-center px-4 py-8 md:py-10">
      <div class="flex items-center justify-center">
        <img src="/svg/logo.svg" alt="Logo" class="h-10 md:h-auto">
      </div>
      
      <div class="flex items-center flex-col gap-2 mt-6 md:mt-10">
        <h2 class="leading-tight text-transparent bg-clip-text text-2xl md:text-[38.2px] max-w-xl font-semibold bg-gradient-to-r from-[#387ED1] to-[#ffffff]">
          One platform. Multiple brokers. Infinite opportunities
        </h2>
        <p class="text-sm md:text-[18px] text-[#ADB2B9] font-[400] px-4">
          Seamlessly manage users, monitor performance, and earn smarter every day.
        </p>
      </div>
      
      <div class="mt-6 md:mt-10">
        <img src="/login.png" alt="login" class="max-w-full mx-auto" />
      </div>
    </div>
    
    <!-- Right side login form -->
    <div class="w-full md:w-1/2 flex flex-col items-center justify-start py-8 md:py-10 px-6 md:px-10 lg:px-20 xl:px-32">
      <div class="flex md:hidden items-center justify-center py-4">
        <img src="/svg/logo.svg" alt="Logo" class="">
      </div>
      <h1 class="font-semibold text-2xl md:text-[40px] mt-4">
        Sign In
      </h1>

      <!-- Display error message if exists -->
      <div v-if="error" class="text-red-500 flex items-center mt-4 w-full">
        <AlertTriangleIcon class="w-4 h-4 mx-2" /> {{ error }}
      </div>

      <!-- Login Form -->
      <form @submit.prevent="login" @keydown.enter.prevent="handleEnterKey" class="w-full mt-6 space-y-4">
        <div class="space-y-1">
          <p>Broker ID</p>
          <input
            type="text"
            id="broker_userid"
            name="broker_userid"
            v-model.trim="loginFormData.broker_userid"
            placeholder="Enter your Broker ID"
            :class="{ 'border-red-500': validateLogin.broker_userid.$error }"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
          <div v-if="validateLogin.broker_userid.$error" class="text-red-500 text-sm">
            Please enter a valid Broker ID
          </div>
        </div>
        
        <div class="space-y-1 relative">
          <p>Password</p>
          <input
            :type="passwordFields.showLoginPassword ? 'text' : 'password'"
            id="password"
            name="password"
            v-model.trim="loginFormData.broker_password"
            placeholder="Enter your password"
            :class="{ 'border-red-500': validateLogin.broker_password.$error }"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
          <span @click="togglePasswordVisibility('showLoginPassword')" class="absolute right-4 top-9 cursor-pointer">
            <EyeOffIcon v-if="passwordFields.showLoginPassword" class="w-5 h-5" />
            <EyeIcon v-else class="w-5 h-5" />
          </span>
          <div v-if="validateLogin.broker_password.$error" class="text-red-500 text-sm">
            Password is required
          </div>
        </div>
        
        <div class="flex items-center justify-between text-[12px]">
          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="checkTnC" class="h-4 w-4"/>
            <p>I agree the <a href="#" class="hover:underline text-custom-blue">XYZ T&C</a> and <a href="#" class="hover:underline text-custom-blue">Privacy Policy</a></p>
          </div>

          <!-- <router-link to="/forgot-password" class="text-blue-500 font-semibold">Forget Password</router-link> -->
        </div>

        <button 
          type="submit" 
          :disabled="!checkTnC" 
          :class="['w-full py-2 rounded-md', checkTnC ? 'bg-[#387ED1] text-white' : 'bg-gray-300 text-gray-500']"
        >
          Submit
        </button>
      </form>

    </div>
  </section>
</template>