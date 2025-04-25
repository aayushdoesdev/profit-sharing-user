<script setup>
import { ref } from "vue";

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
</script>

<template>
  <main class="bg-white py-2">
    <div class="flex items-center justify-between px-4">
      <div
        class="bg-custom-grey flex items-center gap-2 w-fit px-4 rounded-md nrml-text"
      >
        <i class="pi pi-search opacity-50"></i>
        <input
          type="text"
          class="bg-transparent py-2 outline-none"
          placeholder="Search for user"
        />
      </div>
    </div>

    <div class="mt-4 overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr
            class="flex items-center justify-between w-full text-left px-4 py-2 text-[14px] font-bold tracking-wide bg-custom-grey text-custom-dark-grey"
          >
            <th class="min-w-[50px] w-[5%] font-medium">S.NO</th>
            <th class="min-w-[150px] w-[10%] font-medium">Date</th>
            <th class="min-w-[200px] w-[15%] font-medium">User Name</th>
            <th class="min-w-[150px] w-[20%] font-medium">Strategy name</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">Total Profit</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">Sharing Ratio</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">User Share</th>
            <th class="min-w-[100px] text-right w-[10%] font-medium">Admin Share</th>
            <th class="min-w-[200px] text-right w-[10%] font-medium">Action</th>
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
            <td class="min-w-[100px] text-custom-green text-right w-[10%]">+₹{{ payout.totalProfit }}</td>
            <td class="min-w-[100px] text-right w-[10%]">{{ payout.ratio }}</td>
            <td class="min-w-[100px] text-right w-[10%]">₹{{ payout.userShare }}</td>
            <td class="min-w-[100px] text-right w-[10%]">₹{{ payout.adminShare }}</td>
            <td class="min-w-[200px] flex justify-end w-[10%]">
              <button class="pi pi-download text-[20px]"></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
