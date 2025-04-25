<script setup>
import { ref, computed } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const showSidebar = ref(false);

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
];

const titleName = computed(() => {
  const matched = routes.find((r) => r.path === route.path);
  return matched?.name || "Page";
});
</script>

<template>
  <div class="font-geist py-2 px-4 flex items-center justify-end">
    <!-- <div class="flex items-center gap-4 xl:hidden">
      <button
        @click="showSidebar = true"
        class="pi pi-bars text-[20px]"
      ></button>
      <router-link to="/">
        <img src="/svg/logo.svg" alt="" class="w-[120px]" />
      </router-link>
    </div> -->

    <div class="hidden xl:block">
      <h2 class="heading-text">{{ titleName }}</h2>
      <p v-if="route.path === '/calender'" class="nrml-text opacity-60">
        Home > User management > Calender
      </p>
    </div>

    <div class="flex items-center gap-4">
      <div class="h-[40px] w-[40px] bg-slate-500"></div>
      <router-link to="/profile">
        <div class="h-[40px] w-[40px] bg-slate-500 rounded-full"></div>
      </router-link>
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
