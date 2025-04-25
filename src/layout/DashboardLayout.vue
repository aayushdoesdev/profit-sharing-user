<script setup>
import { RouterView } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue'
import Topbar from '@/components/Topbar.vue';
</script>

<template>
    <main class="flex md:mt-2 xl:mt-0 min-h-screen h-fit md:h-screen w-full 3xl:max-w-[85%] mx-auto overflow-y-hidden">
        <!-- <Sidebar/> -->
        <div class="w-full">
            <Topbar/>
            <RouterView/>
        </div>
    </main>
</template>


