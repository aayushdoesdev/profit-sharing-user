<script setup>
import { ref } from "vue";
import Popup from "@/components/Popup.vue";

const showSidebar = ref(false);
const currentStep = ref(1); // 1 = Add User, 2 = Add Broker

const isDeletePopupOpen = ref(false);
const isSqoffPopupOpen = ref(false);

const toggleSqoffPopup = (button) => {
  isSqoffPopupOpen.value = button;
};
const toggleDeletePopup = (button) => {
  isDeletePopupOpen.value = button;
};

const strategies = ref([
  {
    id: 1,
    name: "Most profitable plan",
    expiry: "12 Mar 2025",
    exchange: "NFO",
    pnl: "+₹1,200",
    status: "Open",
    pnlColor: "text-custom-green",
    statusColor: "bg-green-100 text-custom-green",
  },
  {
    id: 2,
    name: "Scalping 15min",
    expiry: "25 Apr 2025",
    exchange: "BSE",
    pnl: "-₹850",
    status: "Closed",
    pnlColor: "text-custom-red",
    statusColor: "bg-red-100 text-custom-red",
  },
  {
    id: 3,
    name: "Options Intraday",
    expiry: "02 May 2025",
    exchange: "NSE",
    pnl: "+₹3,400",
    status: "Open",
    pnlColor: "text-custom-green",
    statusColor: "bg-green-100 text-custom-green",
  },
]);
</script>

<template>
  <main class="bg-white py-2">
    <div class="flex items-center justify-between px-4 nrml-text">
      <div class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md">
        <i class="pi pi-search opacity-50"></i>
        <input
          type="text"
          class="bg-transparent py-2 outline-none"
          placeholder="Search for user"
        />
      </div>

      <div>
        <button @click="showSidebar = true" class="flex items-center gap-2 btn">
          <p>Add New Strategy</p>
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>

    <div class="mt-4 overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-3 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
          >
            <th class="min-w-[50px] w-[5%] font-medium">S.NO</th>
            <th class="min-w-[200px] w-[20%] font-medium">Strategy Name</th>
            <th class="min-w-[150px] w-[10%] font-medium">Expiry</th>
            <th class="min-w-[100px] w-[10%] font-medium">Exchange</th>
            <th class="min-w-[100px] w-[10%] font-medium">PNL</th>
            <th class="min-w-[150px] w-[10%] font-medium">Status</th>
            <th class="min-w-[150px] text-right w-[15%] font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(strategy, index) in strategies"
            :key="strategy.id"
            class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10"
          >
            <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
            <td class="min-w-[200px] flex items-center gap-2 w-[20%]">
              <p class="font-medium">{{ strategy.name }}</p>
            </td>
            <td class="min-w-[150px] flex flex-col gap-2 font-medium w-[10%]">
              <p>{{ strategy.expiry }}</p>
            </td>
            <td class="min-w-[100px] font-medium w-[10%]">
              {{ strategy.exchange }}
            </td>
            <td class="min-w-[100px] w-[10%]">
              <p :class="`${strategy.pnlColor} font-bold`">
                {{ strategy.pnl }}
              </p>
            </td>
            <td class="min-w-[150px] w-[10%]">
              <p
                :class="`${strategy.statusColor} font-bold px-2 py-[2px] rounded w-fit`"
              >
                {{ strategy.status }}
              </p>
            </td>
            <td
              class="min-w-[150px] w-[15%] flex items-center justify-end gap-4"
            >
              <button @click="toggleSqoffPopup(true)" class="sq-off-btn">
                <i class="pi pi-sync"></i>
                <p>Square Off</p>
              </button>
              <button
                class="pi pi-pen-to-square text-custom-blue text-[20px]"
              ></button>
              <button
                @click="toggleDeletePopup(true)"
                class="pi pi-trash text-custom-red text-[20px]"
              ></button>
            </td>
          </tr>
        </tbody>
      </table>

      <transition name="slide">
        <div
          v-if="showSidebar"
          class="fixed right-0 top-0 h-full w-[400px] md:w-[600px] bg-white shadow-lg z-50 p-6"
        >
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Add Strategy</h2>
            <div class="flex gap-4">
              <button
                @click="showSidebar = false"
                class="text-[16px] border border-custom-blue text-custom-blue px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                class="text-[16px] bg-custom-blue text-white font-semibold px-4 py-1 rounded"
              >
                Done
              </button>
            </div>
          </div>

          <!-- Form -->
          <div class="nrml-text space-y-4 mt-4">
            <!-- Step 1: Add User Form -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="opacity-70">Strategy name</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Strategy Type</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Expiry Date</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Exchange</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Side</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Script</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Risk</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Stop Loss</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Target</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">ATM / OTM</label>
                <input type="text" class="custom-input" />
              </div>
              <div>
                <label class="opacity-70">Trailing Active</label>
                <input type="text" class="custom-input" />
              </div>
            </div>

            <!-- <button class="bg-custom-blue text-white px-4 py-2 rounded-md">
              Save
            </button> -->
          </div>
        </div>
      </transition>

      <Popup :isOpen="isSqoffPopupOpen" @close="toggleSqoffPopup(false)">
        <img src="/svg/sq-off-img.svg" alt="" class="w-[200px] mx-auto" />

        <div
          class="flex flex-col items-center justify-center text-center gap-4 w-full mt-4"
        >
          <div class="">
            <h2 class="heading-text">Are you sure you want to square off?</h2>
            <p class="nrml-text">
              Once confirmed, this action cannot be reversed
            </p>
          </div>

          <div class="flex items-center gap-2 w-full">
            <button
              @click="toggleSqoffPopup(false)"
              class="w-full border border-custom-blue text-custom-blue py-1 rounded-full"
            >
              Cancel
            </button>
            <button class="w-full bg-custom-blue text-white py-1 rounded-full">
              Sq Off
            </button>
          </div>
        </div>
      </Popup>

      <Popup :isOpen="isDeletePopupOpen" @close="toggleDeletePopup(false)">
        <img src="/svg/delete-img.svg" alt="" class="w-[350px] mx-auto" />

        <div
          class="flex flex-col items-center justify-center text-center gap-4 w-full mt-4"
        >
          <div class="">
            <h2 class="heading-text">Are you sure you want to delete?</h2>
            <p class="nrml-text">
              Once confirmed, this action cannot be reversed
            </p>
          </div>

          <div class="flex items-center gap-2 w-full">
            <button
              @click="toggleDeletePopup(false)"
              class="w-full border border-custom-blue text-custom-blue py-1 rounded-full"
            >
              Cancel
            </button>
            <button class="w-full bg-custom-red text-white py-1 rounded-full">
              Delete
            </button>
          </div>
        </div>
      </Popup>
    </div>
  </main>
</template>

<style scoped>
.clip-right-arrow {
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-enter-to {
  transform: translateX(0%);
}
.slide-leave-from {
  transform: translateX(0%);
}
.slide-leave-to {
  transform: translateX(100%);
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
</style>
