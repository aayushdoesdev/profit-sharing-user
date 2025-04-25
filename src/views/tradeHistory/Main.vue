<script setup>
import { ref } from "vue";
import Popup from "@/components/Popup.vue";

const activeSection = ref("orders");
const isPopupOpen = ref(false);

const toggleSections = (button) => {
  activeSection.value = button;
};

const togglePopup = (button) => {
  isPopupOpen.value = button;
};

const positions = ref([
  {
    tradeId: "FER527SJ2SJ2929",
    strategy: "Most profitable source",
    trades: [
      { type: "B", price: 8329.89 },
      { type: "S", price: 8329.89 },
    ],
    broker: "32",
    profit: "+5473",
  },
  {
    tradeId: "RTY83929JS2A838",
    strategy: "BankNifty Beast",
    trades: [
      { type: "B", price: 7400.12 },
      { type: "S", price: 7650.5 },
    ],
    broker: "Zerodha",
    profit: "+250.38",
  },
]);

const orders = ref([
  {
    strategy: "Hunter Matrix NFT",
    script: "BTC/USD 54368OOCE",
    side: { type: "B", price: 8329.89, time: "09:09AM/12 Mar" },
    broker: "Dhan",
    brokerId: "DHAN4368HDW9E",
    qty: "0/25",
    status: "Successful",
  },
  {
    strategy: "Intraday Swing",
    script: "ETH/USD 84930XTDS",
    side: { type: "S", price: 4230.45, time: "10:21AM/13 Mar" },
    broker: "Zerodha",
    brokerId: "ZERO8383JSK2",
    qty: "15/15",
    status: "Pending",
  },
]);
</script>

<template>
  <main class="bg-white py-4">
    <div class="border-b border-black border-opacity-10">
      <div class="flex items-center gap-8 px-4">
        <button
          @click="toggleSections('orders')"
          class="px-4 py-1"
          :class="{
            'border-b-2 border-custom-blue text-custom-blue':
              activeSection === 'orders',
          }"
        >
          Orders
        </button>
        <button
          @click="toggleSections('positions')"
          class="px-4 py-1"
          :class="{
            'border-b-2 border-custom-blue text-custom-blue':
              activeSection === 'positions',
          }"
        >
          Positions
        </button>
      </div>
    </div>

    <div class="mt-4">
      <!-- !POSITIONS TABLE -->
      <div v-if="activeSection === 'positions'" class="">
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
                <th class="min-w-[50px] w-[5%]">S.NO</th>
                <th class="min-w-[200px] w-[20%]">Trade ID</th>
                <th class="min-w-[200px] w-[20%]">Strategy</th>
                <th class="min-w-[200px] w-[20%]">Trade Type</th>
                <th class="min-w-[100px] w-[10%]">Broker</th>
                <th class="min-w-[100px] w-[10%]">Profit</th>
                <th class="min-w-[200px] text-right w-[15%]">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(pos, index) in positions"
                :key="pos.tradeId"
                class="flex items-center justify-between text-left w-full px-4 py-2 transition-all nrml-text tracking-wider border-b border-black border-opacity-10"
              >
                <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
                <td class="min-w-[200px] flex items-center gap-2 w-[20%]">
                  <p class="font-medium">{{ pos.tradeId }}</p>
                </td>
                <td
                  class="min-w-[200px] flex flex-col gap-2 font-medium w-[20%]"
                >
                  <p>{{ pos.strategy }}</p>
                </td>
                <td
                  class="min-w-[200px] flex flex-col gap-2 font-semibold w-[20%]"
                >
                  <div
                    v-for="trade in pos.trades"
                    :key="trade.type"
                    class="flex items-center gap-2"
                  >
                    <p
                      :class="[
                        'px-1 rounded font-bold',
                        trade.type === 'B'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600',
                      ]"
                    >
                      {{ trade.type }}
                    </p>
                    <p>{{ trade.price }}</p>
                  </div>
                </td>
                <td class="min-w-[100px] w-[10%]">
                  <p class="font-bold rounded w-fit">{{ pos.broker }}</p>
                </td>
                <td class="min-w-[100px] w-[10%]">
                  <p class="text-green-600 font-bold rounded w-fit">
                    {{ pos.profit }}
                  </p>
                </td>
                <td
                  class="min-w-[200px] w-[15%] flex justify-end items-center gap-4"
                >
                  <button @click="togglePopup(true)" class="sq-off-btn">
                    <i class="pi pi-sync"></i>
                    <p>Square Off</p>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- !ORDERS TABLE -->
      <div v-if="activeSection === 'orders'" class="">
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
                <th class="min-w-[200px] w-[20%] font-medium">Strategy / Script</th>
                <th class="min-w-[200px] w-[20%] font-medium">Side / Price</th>
                <th class="min-w-[200px] w-[20%] font-medium">Broker / ID</th>
                <th class="min-w-[100px] w-[10%] font-medium">QTY</th>
                <th class="min-w-[200px] text-right w-[10%] font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(order, index) in orders"
                :key="order.script"
                class="flex items-center justify-between text-left w-full p-4 transition-all nrml-text tracking-wider border-b border-black border-opacity-10 font-medium"
              >
                <td class="min-w-[50px] w-[5%]">{{ index + 1 }}</td>
                <td class="min-w-[200px] w-[20%]">
                  <p>{{ order.strategy }}</p>
                  <p>{{ order.script }}</p>
                </td>
                <td class="min-w-[200px] w-[20%]">
                  <div class="flex items-center gap-2">
                    <p
                      :class="[
                        'px-1 rounded font-bold',
                        order.side.type === 'B'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600',
                      ]"
                    >
                      {{ order.side.type }}
                    </p>
                    <p>
                      {{ order.side.price }}
                      <span class="text-[10px]"> {{ order.side.time }} </span>
                    </p>
                  </div>
                </td>
                <td class="min-w-[200px] w-[20%]">
                  <p>{{ order.broker }}</p>
                  <p>{{ order.brokerId }}</p>
                </td>
                <td class="min-w-[100px] w-[10%]">
                  <p>{{ order.qty }}</p>
                </td>
                <td class="min-w-[200px] w-[10%] flex justify-end text-[12px]">
                  <p
                    :class="[
                      'px-4 py-[2px] rounded w-fit',
                      order.status === 'Successful'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-700',
                    ]"
                  >
                    {{ order.status }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Popup :isOpen="isPopupOpen" @close="togglePopup(false)">
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
            @click="togglePopup(false)"
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
  </main>
</template>
