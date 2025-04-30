<script setup>
import { ref } from "vue";
import { useProfileStore } from "@/stores/profile";
import { storeToRefs } from "pinia";

const profileStore = useProfileStore()
const {profile} = storeToRefs(profileStore)

const steps = [
  {
    title: "Share Your Referral Link",
    description:
      "Copy your unique link and share it with friends through email or social media — as many times as you want!",
  },
  {
    title: "Your Friend Joins & Trades",
    description:
      "When your friend joins using your link and starts trading or using the platform, their activity gets tracked.",
  },
  {
    title: "Earn 2% Profit – Always!",
    description:
      "You earn 2% of their profit every time they make one — for as long as they keep using the platform. No limits!",
  },
];

const payouts = ref([
  {
    id: 1,
    date: "12 Mar 2025",
    user: "Roshni Chandra",
    strategy: "Most profitable plan",
    totalProfit: 1200,
    ratio: "70:30",
    userShare: 840,
    adminShare: 360,
  },
  {
    id: 2,
    date: "13 Mar 2025",
    user: "Aarav Mehta",
    strategy: "Scalping King",
    totalProfit: 950,
    ratio: "60:40",
    userShare: 570,
    adminShare: 380,
  },
  {
    id: 3,
    date: "14 Mar 2025",
    user: "Meera Raj",
    strategy: "BankNifty Slayer",
    totalProfit: 2100,
    ratio: "80:20",
    userShare: 1680,
    adminShare: 420,
  },
  {
    id: 4,
    date: "15 Mar 2025",
    user: "Dev Patel",
    strategy: "Intraday Blitz",
    totalProfit: 700,
    ratio: "75:25",
    userShare: 525,
    adminShare: 175,
  },
]);

const copied = ref(false);

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      copied.value = true;
      setTimeout(() => copied.value = false, 2000); // Hide after 2s
    })
    .catch(() => {
      copied.value = false;
    });
}
</script>

<template>
  <main>
    <div class="grid md:grid-cols-5 gap-4 mt-4">
      <!-- Left Section -->
      <section
        class="md:col-span-3 bg-custom-blue py-6 px-8 rounded-r-md text-white"
      >
        <p class="heading-text mb-4">How it works</p>

        <div class="grid md:grid-cols-3 gap-8 text-sm">
          <div v-for="(step, index) in steps" :key="index" class="space-y-2">
            <div class="flex items-center gap-4">
              <span
                class="bg-white text-black px-3 py-1 rounded-full font-bold"
                >{{ index + 1 }}</span
              >
              <hr class="border-dashed border-white w-full hidden md:flex" />
            </div>
            <div>
              <p class="font-semibold text-white text-base">{{ step.title }}</p>
              <p class="text-white text-xs">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Section -->
      <section class="md:col-span-2 bg-white p-6 rounded-l-md space-y-6">
        <div
          class="border border-custom-blue bg-custom-blue bg-opacity-20 rounded-md px-4 py-3 text-custom-blue text-sm"
        >
          <p class="font-semibold">
            Earn up to 2% profit bonus for every friend who signs up
          </p>
          <p>
            Get extra 2% profit boost every time someone you refer purchases a
            plan.
          </p>
        </div>

        <div class="space-y-2">
          <p class="heading-text">Invite Link</p>
          <div
            class="flex items-center justify-between px-4 py-2 border border-black border-opacity-30 rounded-md text-sm"
            
          >
            <span>{{ profile.refere_by }}</span>
            <button @click="copyToClipboard(profile.refere_by)" class="pi pi-clipboard"></button>
          </div>
          <p v-if="copied" class="text-green-600 text-xs mt-1">Copied!</p>
        </div>
      </section>
    </div>

    <div class="mt-4 bg-white">
      <h2 class="heading-text p-4">Referrals</h2>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr
              class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
            >
              <th class="min-w-[50px] w-[5%] font-medium">S.NO</th>
              <th class="min-w-[150px] w-[10%] font-medium">Name</th>
              <th class="min-w-[200px] w-[15%] font-medium">Referral Id</th>
              <th class="min-w-[150px] w-[20%] font-medium">Profit%</th>
              <th class="min-w-[100px] text-right w-[10%] font-medium">
                Profit 
              </th>
              <th class="min-w-[100px] text-right w-[10%] font-medium">
                Date
              </th>
              <th class="min-w-[100px] text-right w-[10%] font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(payout, index) in payouts"
              :key="payout.id"
              class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium"
            >
              <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
              <td class="min-w-[150px] w-[10%]">{{ payout.date }}</td>
              <td class="min-w-[200px] w-[15%]">{{ payout.user }}</td>
              <td class="min-w-[150px] w-[20%]">{{ payout.strategy }}</td>
              <td class="min-w-[100px] text-custom-green text-right w-[10%]">
                +₹{{ payout.totalProfit }}
              </td>
              <td class="min-w-[100px] text-right w-[10%]">
                {{ payout.ratio }}
              </td>
              <td class="min-w-[100px] text-right w-[10%]">
                ₹{{ payout.userShare }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
