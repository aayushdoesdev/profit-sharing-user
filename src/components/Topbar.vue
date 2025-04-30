<script setup>
import { useProfileStore } from "@/stores/profile";
import { storeToRefs } from "pinia";
import { ref, computed } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import {logout} from "@/requests/requests"

const route = useRoute();
const router = useRouter();
const showSidebar = ref(false);
const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

const isMenuopen = ref(false)

const toggleMenu = () => {
  isMenuopen.value = !isMenuopen.value
}

const handleLogout = async () => {
  await logout();
};

const routes = [
  {
    name: "Dashboard",
    path: "/",
    img: "/svg/dashboard.svg"
  },
  {
    name: "User Management",
    path: "/user-management",
    img: "/svg/user.svg"
  },
  {
    name: "Alerts",
    path: "/alerts",
    img: "/svg/bell.svg"
  },
  {
    name: "Strategies",
    path: "/strategies",
    img: "/svg/strategies.svg"
  },
  {
    name: "Calender",
    path: "/calender",
  },
  {
    name: "Trade History",
    path: "/trade-history",
    img: "/svg/chart.svg"
  },
  {
    name: "Reports",
    path: "/reports",
    img: "/svg/reports.svg"
  },
  {
    name: "Manual Orders",
    path: "/manual-orders",
    img: "/svg/manual-orders.svg"
  },
  {
    name: "Profile",
    path: "/profile",
  },
  {
    name: "Referrals",
    path: "/refer",
  },
];

const titleName = computed(() => {
  const matched = routes.find((r) => r.path === route.path);
  return matched?.name || "Page";
});
</script>

<template>
  <div class="font-geist py-2 px-4 flex items-center justify-between">
    <!-- <div class="flex items-center gap-4 xl:hidden">
      <button
        @click="showSidebar = true"
        class="pi pi-bars text-[20px]"
      ></button>
      <router-link to="/">
        <img src="/svg/logo.svg" alt="" class="w-[120px]" />
      </router-link>
    </div> -->

    <!-- <div class="hidden xl:block">
      <h2 class="heading-text">{{ titleName }}</h2>
    </div> -->
    <router-link to="/" class="">
      <img src="/svg/logo.svg" alt="" class="w-[80%]">
    </router-link>

    <div class="flex items-center gap-4">
      <div class="h-[40px] w-[40px] bg-slate-500"></div>
      <div class="flex items-center gap-4">
      
      <div @click="toggleMenu" class="cursor-pointer">
        <img class="h-[40px] w-[40px] rounded-full" :src="profile?.profile_pic_url" alt=""> 
      </div>

      <div v-if="isMenuopen" class="w-[200px] bg-white shadow-md absolute top-[50px] right-5 rounded-md z-30 flex flex-col gap-3">
        <router-link to="/profile" class="py-2 px-4 hover:bg-slate-300 w-full rounded-md transition-all">Profile</router-link>
        <button @click="handleLogout" class="py-2 px-4 hover:bg-slate-300 w-full text-left rounded-md transition-all">Logout</button>
      </div>
    </div>
    </div>
  </div>

  <!-- Sidebar Overlay -->
  <transition name="slide">
    <div
      v-if="showSidebar"
      class="fixed left-0 top-0 h-full w-[300px] bg-white shadow-lg z-50 p-6"
    >
      <div class="flex items-center justify-between">
        <h2 class="heading-text">Sidebar</h2>

        <button
          @click="showSidebar = false"
          class="pi pi-times text-[16px]"
        ></button>
      </div>

      <div
        v-for="items in routes.filter(
          (r) => r.name !== 'Calender' && r.name !== 'Profile'
        )"
        class="mt-4"
      >
        <button
          @click="router.push(items.path), (showSidebar = false)"
          class="hover:bg-custom-blue w-full py-2 hover:text-white hover:bg-opacity-80 transition-all rounded flex items-center gap-4 px-4 hover:scale-105 my-2"
          :class="items.path === route.path ? 'bg-custom-blue text-white' : ''"
        >
        <img :src="items.img" alt="" :class="items.path === route.path ? 'invert brightness-0' : '' ">
          <p>{{ items.name }}</p>
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0%);
}
.slide-leave-from {
  transform: translateX(0%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
</style>
