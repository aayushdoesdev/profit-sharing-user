<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";

const currentDate = ref(dayjs());

const mockData = {
  // 📅 March 2025
  "2025-03-25": { profit: false, amount: -320, ratio: "60:40" },
  "2025-03-27": { profit: true, amount: 450, ratio: "70:30" },
  "2025-03-28": { profit: true, amount: 680, ratio: "75:25" },
  "2025-03-30": { profit: false, amount: -210, ratio: "65:35" },

  // 📅 April 2025 (original)
  "2025-04-01": { profit: false, amount: -432, ratio: "60:40" },
  "2025-04-02": { profit: false, amount: -532, ratio: "75:25" },
  "2025-04-05": { profit: false, amount: -632, ratio: "70:30" },
  "2025-04-09": { profit: false, amount: -432, ratio: "85:15" },
  "2025-04-10": { profit: true, amount: 732, ratio: "80:20" },
  "2025-04-11": { profit: true, amount: 832, ratio: "60:40" },
  "2025-04-12": { profit: true, amount: 932, ratio: "75:25" },
  "2025-04-23": { profit: true, amount: 1232, ratio: "90:10" },
  "2025-04-26": { profit: false, amount: -232, ratio: "85:15" },
  "2025-04-27": { profit: false, amount: -132, ratio: "80:20" },
  "2025-04-29": { profit: true, amount: 132, ratio: "70:30" },

  // 📅 May 2025
  "2025-05-01": { profit: true, amount: 340, ratio: "60:40" },
  "2025-05-03": { profit: false, amount: -410, ratio: "65:35" },
  "2025-05-06": { profit: true, amount: 950, ratio: "85:15" },
  "2025-05-07": { profit: false, amount: -190, ratio: "75:25" },
};

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

const filteredMonthData = computed(() => {
  return Object.entries(mockData)
    .filter(([date]) => dayjs(date).isSame(currentDate.value, "month"))
    .sort(([a], [b]) => dayjs(a).diff(dayjs(b)));
});
</script>

<template>
  <main class="bg-white py-4 h-[70vh] overflow-y-auto">
    <div class="px-4">
      <div
        class="flex items-center gap-4 nrml-text mb-4 whitespace-nowrap"
      >
        <button
          @click="prevMonth"
          class="pi pi-angle-left border px-1 py-1 rounded-full"
        ></button>
        <h2 class="text-lg font-bold">{{ monthYear }}</h2>
        <button
          @click="nextMonth"
          class="pi pi-angle-right border px-1 py-1 rounded-full"
        ></button>
        <div class="flex items-center gap-2 ml-auto">
          <p>Profit</p>
          <div
            class="w-[20px] h-[20px] border border-green-500 bg-green-100 rounded"
          ></div>
        </div>
        <div class="flex items-center gap-2">
          <p>Loss</p>
          <div
            class="w-[20px] h-[20px] border border-red-500 bg-red-100 rounded"
          ></div>
        </div>
      </div>

      <div
        class="grid grid-cols-7 text-center nrml-text text-sm overflow-y-auto"
      >
        <div class="font-semibold mb-2">Mon</div>
        <div class="font-semibold">Tue</div>
        <div class="font-semibold">Wed</div>
        <div class="font-semibold">Thu</div>
        <div class="font-semibold">Fri</div>
        <div class="font-semibold">Sat</div>
        <div class="font-semibold">Sun</div>

        <template v-for="(day, index) in daysInMonth" :key="index">
          <div
            v-if="day === null"
            class="border min-h-[97px] max-h-[97px] bg-gray-50 rounded"
          ></div>
          <div
            v-else
            class="border min-h-[97px] max-h-[97px] p-1 text-left rounded relative px-2"
            :class="{
              'bg-green-100 border-green-500':
                mockData[getDateKey(day)]?.profit === true,
              'bg-red-100 border-red-500':
                mockData[getDateKey(day)]?.profit === false,
            }"
          >
            <div class="flex justify-between items-center font-bold">
              <span>{{ day }}</span>
              <template v-if="mockData[getDateKey(day)]">
                <span
                  :class="{
                    'text-custom-green': mockData[getDateKey(day)].amount > 0,
                    'text-custom-red': mockData[getDateKey(day)].amount < 0,
                  }"
                  class="hidden md:block text-xs font-semibold"
                >
                  ₹{{ mockData[getDateKey(day)].amount }}
                </span>
              </template>
            </div>

            <template v-if="mockData[getDateKey(day)]">
              <div
                class="hidden xl:block text-[12px] mt-2 leading-tight font-medium space-y-1"
              >
                <div class="flex items-center justify-between">
                  <p>Share ratio</p>
                  <p>{{ mockData[getDateKey(day)].ratio }}</p>
                </div>
                <div class="flex items-center justify-between">
                  <p>User share</p>
                  <p>
                    {{ mockData[getDateKey(day)].profit ? "+" : "-" }}₹{{
                      calculateShares(
                        mockData[getDateKey(day)].amount,
                        mockData[getDateKey(day)].ratio
                      ).userShare.toFixed(0)
                    }}
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <p>Admin share</p>
                  <p>
                    {{ mockData[getDateKey(day)].profit ? "+" : "-" }}₹{{
                      calculateShares(
                        mockData[getDateKey(day)].amount,
                        mockData[getDateKey(day)].ratio
                      ).adminShare.toFixed(0)
                    }}
                  </p>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>

      <div class="xl:hidden mt-4">
        <p>More details</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div
            v-for="([date, info], index) in filteredMonthData"
            :key="index"
            :class="[
              'p-2 rounded nrml-text space-y-2 mt-2',
              info.profit
                ? 'border border-green-500 bg-green-100'
                : 'border border-red-500 bg-red-100',
            ]"
          >
            <div class="flex items-center justify-between">
              <p>{{ dayjs(date).format("D MMM YYYY") }}</p>
              <p
                :class="
                  info.amount > 0 ? 'text-custom-green' : 'text-custom-red'
                "
              >
                {{ info.profit ? "Profit" : "Loss" }} - ₹{{ info.amount }}
              </p>
            </div>

            <div class="flex items-center justify-between">
              <p>
                Admin Share
                <span
                  :class="
                    info.amount > 0 ? 'text-custom-green' : 'text-custom-red'
                  "
                >
                  ₹{{
                    calculateShares(info.amount, info.ratio).adminShare.toFixed(
                      0
                    )
                  }}
                </span>
              </p>
              <p>
                User Share
                <span
                  :class="
                    info.amount > 0 ? 'text-custom-green' : 'text-custom-red'
                  "
                >
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
