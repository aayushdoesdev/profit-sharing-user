<script setup>
import { ref, watchEffect } from "vue";
import { useProfileStore } from "@/stores/profile";
import { storeToRefs } from "pinia";
import { PenIcon } from 'lucide-vue-next';

const profileStore = useProfileStore();

const { profile } = storeToRefs(profileStore);
const disableUserForm = ref(true);
const disableChangePasswordForm = ref(true);
const fileInput = ref(null);

const formData = ref({
  name: "",
  email: "",
  mobile: "",
  address: ""
});

const changePasswordFormData = ref({
  old_password: "",
  new_password: "",
  confirm_password: "",
});

watchEffect(() => {
  formData.value.name = profile.value.name;
  formData.value.email = profile.value.email;
  formData.value.mobile = profile.value.mobile;
  formData.value.address = profile.value.address
});

function checkForm() {
  // Check if any field is empty
  if (
    !formData.value.name.trim() ||
    !formData.value.email.trim() ||
    !formData.value.mobile.trim() ||
    !formData.value.address.trim()
  ) {
    return true;
  }

  // Check if formData is exactly same as profile
  const isSameAsProfile =
    formData.value.name === profile.value.name &&
    formData.value.email === profile.value.email &&
    formData.value.mobile === profile.value.mobile &&
    formData.value.address === profile.value.address;

  if (isSameAsProfile) {
    return true;
  }

  // If none of the above, form is valid and changed
  return false;
}

const handleSaveuser = async () => {
  if (!checkForm()) {
    await profileStore.updateProfile(formData.value);
  }

  disableUserForm.value = true;
};

const handleChangePassword = async () => {
  if (
    changePasswordFormData.value.old_password &&
    changePasswordFormData.value.new_password &&
    changePasswordFormData.value.confirm_password ===
      changePasswordFormData.value.new_password
  ) {
    await profileStore.changePassword({
      old_password: changePasswordFormData.value.old_password,
      new_password: changePasswordFormData.value.new_password,
    });

    // Reset form after successful submission
    changePasswordFormData.value.old_password = "";
    changePasswordFormData.value.new_password = "";
    changePasswordFormData.value.confirm_password = "";
    disableChangePasswordForm.value = true;
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Create FormData to send to the server
  const imageFormData = new FormData();
  imageFormData.append("profile_pic_url", file);

  try {
    await profileStore.updateProfile(imageFormData);
  } catch (error) {
    console.error("Error uploading profile picture:", error);
  }
};
</script>

<template>
  <main
    class="bg-white p-4 m-4 rounded-md flex flex-col md:flex-row items-start gap-4"
  >
    <div class="p-4 flex flex-col items-center w-full md:w-[20%] space-y-4">
      <div class="text-center">
        <div class="relative">
          <div
            class="w-[100px] h-[100px] bg-slate-500 rounded-full overflow-hidden"
          >
            <img
              v-if="profile?.profile_pic_url"
              :src="profile.profile_pic_url"
              alt="Profile Picture"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Edit icon and hidden file input -->
          <div
            @click="triggerFileInput"
            class="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md"
          >
            <PenIcon size="16" />
          </div>
          <input
            ref="fileInput"
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            class="hidden"
          />
        </div>
        <p class="capitalize">{{ profile.name }}</p>
        <!-- <p>Trader</p> -->
      </div>

      <div class="flex flex-col items-center nrml-text space-y-2">
        <div class="flex items-center gap-2">
          <i class="pi pi-phone"></i>
          <p>+91 {{ profile.mobile }}</p>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-envelope"></i>
          <p>{{ profile.email }}</p>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-map-marker"></i>
          <p>{{ profile.address }}</p>
        </div>
      </div>
    </div>

    <hr
      class="border border-dashed border-black border-opacity-10 w-full md:hidden"
    />

    <div class="border border-dashed hidden md:block h-[450px]"></div>

    <div class="w-full md:w-[80%] space-y-4">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="font-bold">Basic info</h2>
          <button v-if="disableUserForm" @click="disableUserForm = false" class="btn">Edit</button>
          <button v-else @click="handleSaveuser" class="btn">Save</button>
        </div>

        <div class="grid grid-cols-2 nrml-text gap-4 md:gap-8">
          <div class="space-y-1">
            <p>Username</p>
            <input
            v-model="formData.name" type="text" :disabled="disableUserForm"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2"
            />
          </div>
          <div class="space-y-1">
            <p>Email</p>
            <input
            v-model="formData.email" type="text" disabled
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2"
            />
          </div>
          <div class="space-y-1">
            <p>Number</p>
            <input
            v-model="formData.mobile" type="text" disabled
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2"
            />
          </div>
          <div class="space-y-1">
            <p>Address</p>
            <input
              v-model="formData.address" type="text" :disabled="disableUserForm"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-bold">Change password</h2>
          <button v-if="disableChangePasswordForm" @click="disableChangePasswordForm = false" class="btn">Edit</button>
          <div v-else class="flex items-center gap-2">
            <button @click="disableChangePasswordForm = true" class="btn">Cancel</button>
            <button @click="handleChangePassword" class="btn">Save</button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 md:gap-8 nrml-text">
          <div class="space-y-1">
            <p>Current Password</p>
            <input type="password" v-model="changePasswordFormData.old_password" :disabled="disableChangePasswordForm"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-900" />
          </div>
          <div class="space-y-1">
            <p>New password</p>
            <input type="password" v-model="changePasswordFormData.new_password" :disabled="disableChangePasswordForm"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-900" />
          </div>
          <div class="space-y-1">
            <p>Confirm New Password</p>
            <input type="password" v-model="changePasswordFormData.confirm_password" :disabled="disableChangePasswordForm"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-900" />
            <p class="text-custom-red" v-if="changePasswordFormData.new_password != changePasswordFormData.confirm_password">Password do not match</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
