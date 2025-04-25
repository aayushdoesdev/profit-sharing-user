<script setup>
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute()

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
        name: "Manual Orders",
        path: "/manual-orders",
        img: "/svg/manual-orders.svg"
    },
    {
        name: "Strategies",
        path: "/strategies",
        img: "/svg/strategies.svg"
    },
    {
        name: "Alerts",
        path: "/alerts",
        img: "/svg/bell.svg"
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
]
</script>

<template>
    <nav class="hidden xl:flex flex-col min-w-[250px] max-w-[250px] bg-black h-full text-white p-4 font-geist text-[14px] space-y-8">
        <router-link to="/">
            <img src="/svg/logo.svg" alt="" class="w-[90%]">
        </router-link>

        <div class="space-y-2">
            <router-link v-for="item in routes" :to="item.path"  class="hover:bg-custom-blue w-full py-2 hover:bg-opacity-80 transition-all rounded flex items-center gap-4 px-4 hover:scale-105" :class="item.path === route.path ? 'bg-custom-blue' : ''">
                <img :src="item.img" class="h-[30px] w-[30px]" :class="item.path === route.path ? 'invert brightness-0' : '' "></img>
                <p>{{ item.name }}</p>
            </router-link>
        </div>
    </nav>
</template>



