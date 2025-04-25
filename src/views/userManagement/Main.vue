<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Popup from "@/components/Popup.vue";

const router = useRouter();
const showSidebar = ref(false);
const currentStep = ref(1); // 1 = Add User, 2 = Add Broker

const isDeletePopup = ref(false);

const toggleDeletePopup = (button) => {
  isDeletePopup.value = button;
};

const users = ref([
  {
    id: 1,
    name: "Roshni Chandra",
    gst: "GST5849JD893KS9W2",
    profitSharing: "80:20 (80-user & 20-Admin)",
    broker: "Dhan",
    status: "Connected",
  },
  {
    id: 2,
    name: "Aakash Mehta",
    gst: "GST1245AA982KS8W2",
    profitSharing: "70:30 (80-user & 20-Admin)",
    broker: "Zerodha",
    status: "Disconnected",
  },
  {
    id: 3,
    name: "Neha Verma",
    gst: "GST7531BB764KS3L9",
    profitSharing: "85:15 (80-user & 20-Admin)",
    broker: "Upstox",
    status: "Connected",
  },
  {
    id: 4,
    name: "Rajat Kapoor",
    gst: "GST9923CC213KS6Z8",
    profitSharing: "75:25 (80-user & 20-Admin)",
    broker: "Fyers",
    status: "Disconnected",
  },
]);
</script>

<template>
  <main class="bg-white py-4">
    <!-- Top bar -->
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
        <button
          @click="showSidebar = true"
          class="flex items-center gap-2 btn"
        >
          <p>Add new user</p>
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="mt-4 overflow-x-auto">
      <table class="w-full ">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-3 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey whitespace-nowrap"
          >
            <th class="min-w-[50px] w-[5%] font-medium">S.NO</th>
            <th class="min-w-[200px] w-[20%] font-medium">User Name</th>
            <th class="min-w-[250px] w-[20%] font-medium">Profit Sharing</th>
            <th class="min-w-[100px] w-[10%] font-medium">Broker</th>
            <th class="min-w-[150px] w-[10%] font-medium">Status</th>
            <th class="min-w-[100px] text-right w-[15%] font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(user, index) in users"
            :key="user.id"
            class="flex items-center justify-between text-left w-full px-4 py-2 transition-all nrml-text tracking-wider border-b border-black border-opacity-10"
          >
            <td class="min-w-[50px] w-[5%]">{{ String(index + 1).padStart(2, "0") }}</td>
            <td class="min-w-[200px] flex flex-col items-start w-[20%]">
              <p class="font-medium">{{ user.name }}</p>
              <p class="font-medium">{{ user.gst }}</p>
            </td>
            <td class="min-w-[250px] flex flex-col gap-2 font-medium w-[20%]">
              <p>{{ user.profitSharing }}</p>
            </td>
            <td class="min-w-[100px] font-medium w-[10%]">{{ user.broker }}</td>
            <td class="min-w-[150px] w-[10%]">
              <p
                :class="[
                  'font-semibold px-2 py-[2px] rounded w-fit',
                  user.status === 'Connected'
                    ? 'bg-green-100 text-custom-green'
                    : 'bg-[#1C1D221F] text-custom-dark-grey',
                ]"
              >
                {{ user.status }}
              </p>
            </td>
            <td class="min-w-[100px] w-[15%] flex justify-end items-center gap-4">
              <button
                @click="router.push('/calender')"
                class="pi pi-calendar text-[20px]"
              ></button>
              <button class="pi pi-pen-to-square text-custom-blue text-[20px]"></button>
              <button
                @click="toggleDeletePopup(true)"
                class="pi pi-trash text-custom-red text-[20px]"
              ></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sidebar Overlay -->
    <transition name="slide">
      <div
        v-if="showSidebar"
        class="fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg z-50 p-6"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            {{ currentStep === 1 ? "Add User" : "Add Broker" }}
          </h2>
          <div class="flex gap-4">
            <button
              @click="showSidebar = false"
              class="text-[16px] border border-custom-blue text-custom-blue px-4 py-1 rounded"
            >
              Cancel
            </button>
            <button
              @click="currentStep = currentStep === 1 ? 2 : 1"
              class="text-[16px] bg-custom-blue text-white font-semibold px-4 py-1 rounded"
            >
              {{ currentStep === 1 ? "Next" : "Back" }}
            </button>
          </div>
        </div>

        <!-- Step Indicator -->
        <div class="flex w-full max-w-md text-sm font-medium">
          <!-- Step 1 -->
          <div
            class="relative flex items-center px-4 py-3 rounded-l-md w-full"
            :class="
              currentStep === 1
                ? 'bg-blue-100 text-custom-blue'
                : 'bg-white text-gray-400 border'
            "
          >
            <div class="flex items-center gap-2">
              <div
                :class="[
                  'w-6 h-6 flex items-center justify-center rounded-full text-xs',
                  currentStep === 1
                    ? 'bg-custom-blue text-white'
                    : 'border border-gray-400 text-gray-400',
                ]"
              >
                ✓
              </div>
              <span>Add user</span>
            </div>
            <!-- Right Arrow -->
            <div
              class="absolute right-0 top-0 h-full w-4 bg-inherit clip-right-arrow"
            ></div>
          </div>

          <!-- Step 2 -->
          <div
            class="relative flex items-center px-4 py-3 rounded-r-md w-full"
            :class="
              currentStep === 2
                ? 'bg-blue-100 text-custom-blue'
                : 'bg-white text-gray-400 border border-l-0'
            "
          >
            <div class="flex items-center gap-2">
              <div
                :class="[
                  'w-6 h-6 flex items-center justify-center rounded-full text-xs',
                  currentStep === 2
                    ? 'bg-custom-blue text-white'
                    : 'border border-gray-400 text-gray-400',
                ]"
              >
                ✓
              </div>
              <span>Add Broker</span>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="nrml-text space-y-4 mt-4">
          <!-- Step 1: Add User Form -->
          <template v-if="currentStep === 1">
            <div>
              <label class="opacity-70">Username</label>
              <input type="text" class="custom-input" />
            </div>
            <div>
              <label class="opacity-70">Number</label>
              <input type="text" class="custom-input" />
            </div>
            <div>
              <label class="opacity-70">Email</label>
              <input type="text" class="custom-input" />
            </div>
            <div>
              <label class="opacity-70">PAN Number</label>
              <input type="text" class="custom-input" />
            </div>
            <div>
              <label class="opacity-70">DOB</label>
              <input type="date" class="custom-input" />
            </div>
          </template>

          <!-- Step 2: Add Broker Form -->
          <template v-else>
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
          </template>
        </div>
      </div>
    </transition>

    <Popup :isOpen="isDeletePopup" @close="toggleDeletePopup(false)">
      <img src="/svg/delete-img.svg" alt="" class="w-[350px] mx-auto">

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
