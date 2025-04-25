<script setup>
import { makeRequest } from '@/requests/requests';
import useVuelidate from '@vuelidate/core';
import { required, email, minLength } from "@vuelidate/validators";
import { reactive, ref } from 'vue';

const isForgotPassword = ref(false);

const isSendOtp = ref(false);

// Forgot password form data and validation
const forgotPasswordFormData = reactive({
  "email": "",
});

const forgotPasswordRules = {
  email: {
    required,
    email,
  }
};

const validateEmail = useVuelidate(forgotPasswordRules, forgotPasswordFormData);

// OTP and new password form data and validation
const enterOtpPasswordData = reactive({
  "email": "",
  "otp": "",
  "password": "",
});

const enterOtpPasswordRules = {
  otp: {
    required,
    minLength: minLength(6),
  },
  password: {
    required,
    minLength: minLength(6),
  },
};
const validateOtpPassword = useVuelidate(enterOtpPasswordRules, enterOtpPasswordData);


// Send OTP for password reset
const sendOTPForgot = async () => {
  validateEmail.value.$touch();
  if (!validateEmail.value.$invalid) {
    const responseOtp = await makeRequest("sendForgotOTP", "POST", forgotPasswordFormData);
    
    if (responseOtp) {
      isSendOtp.value = true;
    } else {
      error.value = "Failed to send OTP. Please check your email and try again.";
    }
  }
};

// Submit password reset
const submitForgotPassword = async () => {
  validateOtpPassword.value.$touch();
  if (!validateOtpPassword.value.$invalid) {
    enterOtpPasswordData.email = forgotPasswordFormData.email;
    const responseForgot = await makeRequest("forgot", "POST", enterOtpPasswordData);
    
    if (responseForgot) {
      error.value = '';
      isForgotPassword.value = false;
      isSendOtp.value = false;
      
      // Show success notification (implement your notification system)
      alert("Password reset successful! You can now login with your new password.");
    } else {
      error.value = "Failed to reset password. Please check your OTP and try again.";
    }
  }
};

</script>

<template>
  <section class="flex items-center min-h-screen font-geist">
    <div class="w-[50%] bg-gray-700 h-screen"></div>
    <div class="w-[50%] flex flex-col items-start justify-start py-10 px-32">
      <router-link to="/login"
        class="border border-black border-opacity-20 px-2 py-2 rounded-full flex items-center justify-center">
        <i class="pi pi-angle-left text-[25px]"></i>
      </router-link>

      <div class="text-left">
        <h1 class="font-semibold text-[40px]">Forgot Password</h1>
        <p class="text-[14px] opacity-50">Please enter your email to reset the password</p>
      </div>

      <!-- Forgot Password - Email Form -->

      <div v-if="!isSendOtp" class="w-full mt-6 space-y-4">
        <div class="space-y-1">
          <p>Email</p>
          <input type="text" id="forgot-email" name="email" v-model.trim="forgotPasswordFormData.email"
            placeholder="Enter your registered email" :class="{ 'border-red-500': validateEmail.email.$error }"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent" />
          <div v-if="validateEmail.email.$error" class="text-red-500 text-sm">
            Please enter a valid email address
          </div>
        </div>

        <div class="flex ">
          <button @click="sendOTPForgot" class="bg-[#387ED1] w-full text-white py-2 rounded-md">
            Send OTP
          </button>
          
        </div>
      
      </div>

      <!-- Forgot Password - OTP and New Password Form -->

      <div v-else class="w-full mt-6 space-y-4">
        <div class="text-center mb-4">
          Please check your registered email for the OTP
        </div>
        
        <div class="space-y-1">
          <p>OTP</p>
          <input
            type="text"
            id="otp"
            name="otp"
            v-model.trim="enterOtpPasswordData.otp"
            placeholder="Enter your 6 digit email OTP"
            :class="{ 'border-red-500': validateOtpPassword.otp.$error }"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
          <div v-if="validateOtpPassword.otp.$error" class="text-red-500 text-sm">
            Please enter a valid 6-digit OTP
          </div>
        </div>
        
        <div class="space-y-1 relative">
          <p>New Password</p>
          <input
            :type="passwordFields.showOTPPassword ? 'text' : 'password'"
            id="new-password"
            name="password"
            v-model.trim="enterOtpPasswordData.password"
            placeholder="Enter your new password"
            :class="{ 'border-red-500': validateOtpPassword.password.$error }"
            class="w-full border border-black border-opacity-40 py-2 rounded-md outline-none px-4 bg-transparent"
          />
          <span @click="togglePasswordVisibility('showOTPPassword')" class="absolute right-4 top-11 cursor-pointer">
            <EyeOffIcon v-if="passwordFields.showOTPPassword" class="w-5 h-5" />
            <EyeIcon v-else class="w-5 h-5" />
          </span>
          <div v-if="validateOtpPassword.password.$error" class="text-red-500 text-sm">
            Password must be at least 6 characters
          </div>
        </div>
        
        <button @click="submitForgotPassword" class="bg-[#387ED1] w-full text-white py-2 rounded-md">
          Submit
        </button>
        
        <button @click="isForgotPassword = false; isSendOtp = false" class="border border-[#387ED1] text-[#387ED1] w-full py-2 rounded-md">
          Back to Login
        </button>
      </div>
    </div>
  </section>
</template>
