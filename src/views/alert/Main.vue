<script setup>
import { ref } from "vue";

const alerts = ref([
  {
    id: 1,
    alertId: "GT38932JSY82JKS",
    strategy: "Best from the rest",
    dataId: "DEH9384F3293JF",
    createdAt: "24 Mar 2025",
  },
  {
    id: 2,
    alertId: "ALR92384KSJDFK2",
    strategy: "Intraday Master",
    dataId: "KD84KDJF83838DK",
    createdAt: "25 Mar 2025",
  },
  {
    id: 3,
    alertId: "RTY3829DJDK38DK",
    strategy: "Gap Up Breakout",
    dataId: "HF74DJ29DKDI33F",
    createdAt: "26 Mar 2025",
  },
  {
    id: 4,
    alertId: "JDKD8823DJDK293",
    strategy: "Options Momentum",
    dataId: "KDJF3838DJDK394",
    createdAt: "27 Mar 2025",
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
            <th class="min-w-[200px] w-[15%] font-medium">Alert ID</th>
            <th class="min-w-[200px] w-[15%] font-medium">Strategies</th>
            <th class="min-w-[200px] w-[20%] font-medium">Data</th>
            <th class="min-w-[150px] text-right w-[10%] font-medium">Created At</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(alert, index) in alerts"
            :key="alert.alertId"
            class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium"
          >
            <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
            <td class="min-w-[200px] w-[15%]">{{ alert.alertId }}</td>
            <td class="min-w-[200px] w-[15%]">{{ alert.strategy }}</td>
            <td class="min-w-[200px] flex items-center gap-2 w-[20%]">
              <p>{{ alert.dataId }}</p>
              <button class="pi pi-copy text-[20px]"></button>
            </td>
            <td class="min-w-[150px] flex justify-end w-[10%]">{{ alert.createdAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
