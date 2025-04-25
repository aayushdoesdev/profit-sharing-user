<script setup>
import { ref } from "vue";
import Popup from "@/components/Popup.vue";
import Calender from '@/views/calender/Main.vue';

const isOpen = ref(null); // null means no open row

const toggle = (index) => {
  isOpen.value = isOpen.value === index ? null : index;
};

const showSidebar = ref(false);

const isPopupOpen = ref(false);

const togglePopup = (button) => {
  isPopupOpen.value = button;
};

// Mock Data
const positions = ref([
  {
    name: "Britex Superhero",
    openCount: 3,
    buyPrice: 8329.89,
    sellPrice: 8329.89,
    pnl: "+5473",
    status: "Open",
    script: "GHEY368WI2WY62WSH2",
  },
  {
    name: "Alpha Momentum",
    openCount: 2,
    buyPrice: 9124.23,
    sellPrice: 9154.11,
    pnl: "+3021",
    status: "Open",
    script: "AJSD8293JKLQWEHJSA",
  },
  {
    name: "Bear Trap",
    openCount: 1,
    buyPrice: 4300.0,
    sellPrice: 4275.5,
    pnl: "-245",
    status: "Closed",
    script: "BDHF28374DFWE84HD",
  },
  {
    name: "Quantum Edge",
    openCount: 4,
    buyPrice: 6750.0,
    sellPrice: 6815.0,
    pnl: "+650",
    status: "Open",
    script: "QEHD823HFD823FD",
  },
  {
    name: "Speedster",
    openCount: 2,
    buyPrice: 7230.25,
    sellPrice: 7255.9,
    pnl: "+103",
    status: "Closed",
    script: "SPDTRH823HRF823",
  },
]);
</script>

<template>
  <main class="font-geist">
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 px-4 py-2 gap-2">
      <div class="bg-white p-4 space-y-4 rounded-md">
        <div class="flex items-center justify-between">
          <p class="nrml-text">Overall Profit</p>
          <img src="/svg/dash1.svg" class="h-[30px] w-[30px]"></img>
        </div>
        <hr class="border border-dashed" />
        <div class="flex items-center justify-between">
          <p class="heading-text">
            1658 <span class="small-text">active</span>
          </p>
          <p class="nrml-text">
            <i class="pi pi-arrow-up text-[12px]"></i>
            1.5%
          </p>
        </div>
      </div>

      <div class="bg-white p-4 space-y-4 rounded-md">
        <div class="flex items-center justify-between">
          <p class="nrml-text">Avg profit</p>
          <img src="/svg/dash2.svg" class="h-[30px] w-[30px]"></img>
        </div>
        <hr class="border border-dashed" />
        <div class="flex items-center justify-between">
          <p class="heading-text">
            1658 <span class="small-text">active</span>
          </p>
          <p class="nrml-text">
            <i class="pi pi-arrow-up text-[12px]"></i>
            1.5%
          </p>
        </div>
      </div>
      
      <div class="bg-white p-4 space-y-4 rounded-md">
        <div class="flex items-center justify-between">
          <p class="nrml-text">Total Trades</p>
          <img src="/svg/dash4.svg" class="h-[30px] w-[30px]"></img>
        </div>
        <hr class="border border-dashed" />
        <div class="flex items-center justify-between">
          <p class="heading-text">460</p>
          <p class="nrml-text">
            <i class="pi pi-arrow-up text-[12px]"></i>
            1.5%
          </p>
        </div>
      </div>

      <div class="bg-white p-4 space-y-4 rounded-md col-span-1">
        <div class="flex items-center justify-between">
          <p class="nrml-text">Brokers</p>
          <img src="/svg/dash5.svg" class="h-[30px] w-[30px]"></img>
        </div>
        <hr class="border border-dashed" />
        <div class="flex items-center justify-between">
          <p class="heading-text">46589</p>
          <button @click="showSidebar = true" class="text-custom-blue flex items-center font-bold underline underline-offset-4 text-[14px]">
            <p>+ Connect</p>
          </button>
        </div>
      </div>

      <div class="bg-gradient-to-r from-white overflow-hidden via-white to-custom-blue p-4 rounded-md col-span-2 relative">
        <img src="/svg/abstract.svg" alt="" class="absolute top-0 right-0 w-56 ">
        <div class="flex flex-col ">
          <h2 class="text-custom-black font-[800] text-[16px] max-w-xs">Invite your friends to join and enjoy rewards together</h2>
          <button class=" mt-4 btn max-w-36">
            Invite Now
          </button>
        </div>
      </div>

      
    </div>
    <div class="px-4">
      <Calender/>

    </div>

    <transition name="slide">
      <div
        v-if="showSidebar"
        class="fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg z-50 p-6"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            Add Broker
          </h2>
          <div class="">
            <button
              @click="showSidebar = false"
              class="text-[16px] border border-custom-blue text-custom-blue px-4 py-1 rounded"
            >
              Cancel
            </button>
            
          </div>
        </div>

        
        

        <!-- Form -->
        <div class="nrml-text space-y-4 mt-4">
         
            <div>
              <label class="opacity-70">Select Broker</label>
              <input type="text" class="custom-input" />
            </div>
            <div>
              <label class="opacity-70">Broker User ID</label>
              <input type="text" class="custom-input" />
            </div>
            <div>
              <label class="opacity-70">Broker Password</label>
              <input type="text" class="custom-input" />
            </div>
            <div>
              <label class="opacity-70">Broker QR Key</label>
              <input type="password" class="custom-input" />
            </div>
            <div>
              <label class="opacity-70">Broker API</label>
              <input type="text" class="custom-input" />
            </div>
            <div>
              <label class="opacity-70">Broker API Secret</label>
              <input type="text" class="custom-input" />
            </div>
          
        </div>
      </div>
    </transition>
  </main>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0%);
  opacity: 1;
}
.slide-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
