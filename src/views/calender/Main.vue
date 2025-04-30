<script setup>
import { ref, computed, watchEffect } from "vue";
import { usePositionStore } from "@/stores/position";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import Popup from "@/components/Popup.vue";


const positionStore = usePositionStore();

const { positions } = storeToRefs(positionStore);

const currentDate = ref(dayjs());

// 🔥 New function: Convert userPositions.positions to the required format
const generateFormattedData = (positions) => {
  const result = {};

  if (!positions || positions.length === 0) return result;

  positions.forEach((position) => {
    const {
      id: position_id,
      strategy_id,
      strategy_name,
      strategy_script,
      created_at,
      updated_at,
      side,
      status,
      buy_price = 0,
      sell_price = 0,
      last_price = 0,
      buy_quantity = 0,
      sell_quantity = 0,
      admin_share_ratio = 0,
    } = position;

    const dateKey = dayjs(created_at).format("YYYY-MM-DD");

    let positionPnl = 0;

    if (status === "OPEN") {
      if (side === "BUY") {
        positionPnl = (last_price - buy_price) * buy_quantity;
      } else if (side === "SELL") {
        positionPnl = (sell_price - last_price) * sell_quantity;
      } else {
        console.warn(`Unknown side: ${side} in OPEN position`);
      }
    } else if (status === "CLOSED") {
      if (side === "BUY") {
        positionPnl = (sell_price - buy_price) * sell_quantity;
      } else if (side === "SELL") {
        positionPnl = (sell_price - buy_price) * buy_quantity;
      } else {
        console.warn(`Unknown side: ${side} in CLOSED position`);
      }
    } else {
      console.warn(`Unknown status: ${status} in position`);
    }

    const ratio = `${100 - admin_share_ratio}:${admin_share_ratio}`;

    if (!result[dateKey]) {
      result[dateKey] = {
        profit: positionPnl >= 0,
        amount: positionPnl,
        ratio: ratio,
        strategy: [],
      };
    } else {
      result[dateKey].amount += positionPnl;
      result[dateKey].profit = result[dateKey].amount >= 0;
    }

    // Find if strategy already exists
    let strategyObj = result[dateKey].strategy.find(s => s.strategy_id === strategy_id);

    if (!strategyObj) {
      strategyObj = {
        strategy_id,
        strategy_name: strategy_name || "Unknown Strategy",
        positions: [],
      };
      result[dateKey].strategy.push(strategyObj);
    }

    // Push current position into strategy's positions array
    strategyObj.positions.push({
      buy_price,
      sell_price,
      created_at,
      updated_at,
      side,
      strategy_script,
      pnl: positionPnl,
    });
  });

  // Now, after grouping all positions, calculate pnl for each strategy
  Object.values(result).forEach(dateData => {
    dateData.strategy.forEach(strategy => {
      strategy.pnl = strategy.positions.reduce((acc, pos) => acc + pos.pnl, 0);
    });
  });

  return result;
};


// 🆕 Ref: Stores formatted data in the same format as formattedData
const formattedData = ref({});

// Watch for changes in user positions and generate the formatted data
watchEffect(() => {
  formattedData.value = generateFormattedData(positions.value || []);
});

const daysInMonth = computed(() => {
  const start = currentDate.value.startOf("month");
  const end = currentDate.value.endOf("month");
  const startWeekDay = start.day();
  const days = [];

  for (let i = 0; i < startWeekDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= end.date(); day++) {
    days.push(day);
  }

  return days;
});

const monthYear = computed(() => currentDate.value.format("MMMM YYYY"));

const getDateKey = (day) => {
  return currentDate.value.date(day).format("YYYY-MM-DD");
};

const prevMonth = () => {
  currentDate.value = currentDate.value.subtract(1, "month");
};

const nextMonth = () => {
  currentDate.value = currentDate.value.add(1, "month");
};

const calculateShares = (amount, ratio) => {
  const [userRatio, adminRatio] = ratio.split(":").map(Number);
  const total = Math.abs(amount);
  const userShare = (total * userRatio) / 100;
  const adminShare = (total * adminRatio) / 100;
  return { userShare, adminShare };
};

// 🆕 Computed: Use formattedData for current month data
const filteredMonthData = computed(() => {
  return Object.entries(formattedData.value)
    .filter(([date]) => dayjs(date).isSame(currentDate.value, "month"))
    .sort(([a], [b]) => dayjs(a).diff(dayjs(b)));
});

//details modal logics
const showDetailsModal = ref(false);
const openDetailsModalToggle = ref(false);
const dataToShow = ref(null);
const selectedDate = ref(null); 

const openDetailsModal = (data , date) => {
  showDetailsModal.value = true;
  dataToShow.value = data;
  selectedDate.value = date;
}

</script>


<template>
  
  <main class="bg-white py-4 h-[70vh] overflow-y-auto">
    <div class="px-4">
      <div class="flex items-center gap-4 nrml-text mb-4 whitespace-nowrap">
        <button @click="prevMonth" class="pi pi-angle-left border px-1 py-1 rounded-full"></button>
        <h2 class="text-lg font-bold">{{ monthYear }}</h2>
        <button @click="nextMonth" class="pi pi-angle-right border px-1 py-1 rounded-full"></button>
        <div class="flex items-center gap-2 ml-auto">
          <p>Profit</p>
          <div class="w-[20px] h-[20px] border border-green-500 bg-green-100 rounded"></div>
        </div>
        <div class="flex items-center gap-2">
          <p>Loss</p>
          <div class="w-[20px] h-[20px] border border-red-500 bg-red-100 rounded"></div>
        </div>
      </div>

      <div class="grid grid-cols-7 text-center nrml-text text-sm overflow-y-auto">
        <div class="font-semibold mb-2">Mon</div>
        <div class="font-semibold">Tue</div>
        <div class="font-semibold">Wed</div>
        <div class="font-semibold">Thu</div>
        <div class="font-semibold">Fri</div>
        <div class="font-semibold">Sat</div>
        <div class="font-semibold">Sun</div>

        <template v-for="(day, index) in daysInMonth" :key="index">
          <div v-if="day === null" class="border min-h-[115px] max-h-[115px] bg-gray-50 rounded"></div>
          <div v-else class="border min-h-[115px] max-h-[115px] p-1 text-left rounded relative px-2" :class="{
            'bg-green-100 border-green-500':
              formattedData[getDateKey(day)]?.profit === true,
            'bg-red-100 border-red-500':
              formattedData[getDateKey(day)]?.profit === false,
          }">
            <div class="flex justify-between items-center font-bold">
              <span>{{ day }}</span>
              <template v-if="formattedData[getDateKey(day)]">
                <span :class="{
                  'text-custom-green': formattedData[getDateKey(day)].amount > 0,
                  'text-custom-red': formattedData[getDateKey(day)].amount < 0,
                }" class="hidden md:block text-xs font-semibold">
                  ₹{{ formattedData[getDateKey(day)].amount }}
                </span>
              </template>
            </div>

            <template v-if="formattedData[getDateKey(day)]">
              <div class="hidden xl:block text-[12px] mt-2 leading-tight font-medium space-y-1">
                <div class="flex items-center justify-between">
                  <p>Share ratio</p>
                  <p>{{ formattedData[getDateKey(day)].ratio }}</p>
                </div>
                <div class="flex items-center justify-between">
                  <p>User share</p>
                  <p>
                    {{ formattedData[getDateKey(day)].profit ? "+" : "-" }}₹{{
                      calculateShares(
                        formattedData[getDateKey(day)].amount,
                        formattedData[getDateKey(day)].ratio
                      ).userShare.toFixed(0)
                    }}
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <p>Admin share</p>
                  <p>
                    {{ formattedData[getDateKey(day)].profit ? "+" : "-" }}₹{{
                      calculateShares(
                        formattedData[getDateKey(day)].amount,
                        formattedData[getDateKey(day)].ratio
                      ).adminShare.toFixed(0)
                    }}
                  </p>
                </div>

                <div class="flex items-center justify-between">
                  <p>Strategies &nbsp;<span>&nbsp;03</span></p>
                  <button @click="openDetailsModal(formattedData[getDateKey(day)] , getDateKey(day))" class="rounded px-1" :class="{
                    'bg-green-100 border border-green-500': formattedData[getDateKey(day)]?.profit === true,
                    'bg-red-100 border border-red-500': formattedData[getDateKey(day)]?.profit === false,
                  }">
                    info
                  </button>
                  
                </div>
              </div>
            </template>
          </div>


        </template>
      </div>
      <!-- // 🆕 Details Modal -->
      <Popup :isOpen="showDetailsModal" @close="showDetailsModal = false">
        <div class="min-w-[350px] max-w-[500px]">

          <div class="flex justify-between items-center border-b">
            <p class="font-semibold" :class="{'text-custom-green' : dataToShow.profit , 'text-custom-red' : !dataToShow.profit}">₹{{ dataToShow.amount }}</p>
            <p class="font-semibold">{{ selectedDate }}</p>
          </div>

          <div>
            <div class="flex justify-between items-center py-2 ">
              <p class="font-semibold">Strategies</p>
              <p class="font-semibold">PNL</p>
            </div>

            <div class="flex gap-1 flex-col h-96 overflow-auto">
              <div v-for="strat in dataToShow.strategy" class="bg-custom-grey p-2 rounded ">
                <div class="flex justify-between items-center">

                  <div>
                    <p class="font-semibold">{{ strat.strategy_name }}</p>
                    <div class="bg-[#1C1D221A] text-[12px] font-[500] px-1 rounded text-[#737171] w-fit">
                      <p>{{ strat.positions.length }} Strikes</p>
                    </div>
                  </div>

                  <div class="flex gap-2 items-center">
                    <p class="font-bold" :class="{'text-custom-green' : strat.pnl >= 0 , 'text-custom-red' : strat.pnl < 0 }">₹{{ strat.pnl }}</p>
                    <button @click="openDetailsModalToggle = !openDetailsModalToggle">
                      <img src="/svg/dropdown.svg" alt="" class="w-3 transition-all duration-150"
                        :class="{ 'rotate-180': openDetailsModalToggle }" />
                    </button>
                  </div>
                </div>

                <div v-if="openDetailsModalToggle" class="mt-4">
                  <div v-for="pos in strat.positions" class="border-b border-dashed pb-2">
                    <div class="flex justify-between items-center">
                      <p>{{ pos.strategy_script }}</p>
                      <p class="font-semibold" :class="{'text-custom-green' : pos.pnl >= 0 , 'text-custom-red' : pos.pnl < 0 }">₹{{ pos.pnl }}</p>
                    </div>
                    <div class="flex flex-col gap-1 mt-2">
                      <div class="flex gap-2 items-center">
                        <p class="text-custom-green font-bold bg-custom-green/10 rounded-full text-[12px] px-1.5">B
                        </p>
                        <p>{{ pos.buy_price }}</p>
                        <p class="text-[12px] text-custom-dark-grey">09:09AM</p>
                      </div>
                      <div class="flex gap-2 items-center">
                        <p class="text-custom-red font-bold bg-custom-red/10 rounded-full text-[12px] px-1.5">S</p>
                        <p>{{ pos.sell_price }}</p>
                        <p class="text-[12px] text-custom-dark-grey">09:09AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Popup>
      <div class="xl:hidden mt-4">
        <p>More details</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div v-for="([date, info], index) in filteredMonthData" :key="index" :class="[
            'p-2 rounded nrml-text space-y-2 mt-2',
            info.profit
              ? 'border border-green-500 bg-green-100'
              : 'border border-red-500 bg-red-100',
          ]">
            <div class="flex items-center justify-between">
              <p>{{ dayjs(date).format("D MMM YYYY") }}</p>
              <p :class="info.amount > 0 ? 'text-custom-green' : 'text-custom-red'
                ">
                {{ info.profit ? "Profit" : "Loss" }} - ₹{{ info.amount }}
              </p>
            </div>

            <div class="flex items-center justify-between">
              <p>
                Admin Share
                <span :class="info.amount > 0 ? 'text-custom-green' : 'text-custom-red'
                  ">
                  ₹{{
                    calculateShares(info.amount, info.ratio).adminShare.toFixed(
                      0
                    )
                  }}
                </span>
              </p>
              <p>
                User Share
                <span :class="info.amount > 0 ? 'text-custom-green' : 'text-custom-red'
                  ">
                  ₹{{
                    calculateShares(info.amount, info.ratio).userShare.toFixed(
                      0
                    )
                  }}
                </span>
              </p>
              <p>Share ratio {{ info.ratio }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
