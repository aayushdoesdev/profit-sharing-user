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
  "brokerId": '',
  "password": '',
});

const loginFormRules = {
  brokerId: {
    required,
    minLength: minLength(6),
  },
  password: {
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
        localStorage.setItem('token', response.data.access_token);
        
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
    <div class="w-[50%] bg-gray-700 h-screen"></div>
    
    <!-- Right side login form -->
    <div class="w-[50%] flex flex-col items-center justify-start py-10 px-32">
      <h1 class="font-semibold text-[40px]">
        Sign In
      </h1>

      <!-- Display error message if exists -->
      <div v-if="error" class="text-red-500 flex items-center mt-4 w-full">
        <AlertTriangleIcon class="w-4 h-4 mx-2" /> {{ error }}
      </div>

      <!-- Login Form -->
      <div class="w-full mt-6 space-y-4">
        <div class="space-y-1">
          <p>Broker ID</p>
          <input
            type="text"
            id="brokerId"
            name="brokerId"
            v-model.trim="loginFormData.brokerId"
            placeholder="Enter your Broker ID"
            :class="{ 'border-red-500': validateLogin.brokerId.$error }"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
          <div v-if="validateLogin.brokerId.$error" class="text-red-500 text-sm">
            Please enter a valid Broker ID
          </div>
        </div>
        
        <div class="space-y-1 relative">
          <p>Password</p>
          <input
            :type="passwordFields.showLoginPassword ? 'text' : 'password'"
            id="password"
            name="password"
            v-model.trim="loginFormData.password"
            placeholder="Enter your password"
            :class="{ 'border-red-500': validateLogin.password.$error }"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
          <span @click="togglePasswordVisibility('showLoginPassword')" class="absolute right-4 top-9 cursor-pointer">
            <EyeOffIcon v-if="passwordFields.showLoginPassword" class="w-5 h-5" />
            <EyeIcon v-else class="w-5 h-5" />
          </span>
          <div v-if="validateLogin.password.$error" class="text-red-500 text-sm">
            Password is required
          </div>
        </div>
        
        <div class="flex items-center justify-between text-[12px]">
          <div class="flex items-center gap-2">
            <input type="checkbox" id="agree" required />
            <label for="agree">I agree the XYZ T&C and privacy policy</label>
          </div>

          <router-link to="/forgot-password" class="text-blue-500 font-semibold">Forget Password</router-link>
        </div>

        <button @click="login" class="bg-[#387ED1] w-full text-white py-2 rounded-md">
          Submit
        </button>

        <p class="text-center opacity-50">
          Don't have an account?
          <RouterLink class="opacity-100 text-blue-500 font-semibold" to="/register">Register</RouterLink>
        </p>
      </div>

    </div>
  </section>
</template>