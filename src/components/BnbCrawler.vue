<script setup>
import { ref } from "vue";
defineEmits(["bnbCrawl"]);
const bnbName = ref("宜蘭深圳驛站");
const bnbUrl = ref(
  "https://twstay.com/RWD2/booking.aspx?BNB=shenzhou&OrderType=2"
);
</script>

<template>
  <h5>新增民宿</h5>
  <div
    id="bnb-crawler"
    class="bg-gray-200 p-3 w-full flex gap-x-3 justify-between"
  >
    <div class="bg-gray-200 flex gap-x-3 w-full">
      <div class="flex flex-col gap-y-1 w-3/5">
        <span>
          您可以從
          <a
            class="text-blue-800"
            href="https://yilantravel.com.tw/"
            target="_blank"
            rel="noreferrer noopenner"
            >樂活宜蘭民宿網</a
          >
          選擇民宿，並將訂房頁面的網址貼入
        </span>
        <input
          type="text"
          v-model="bnbName"
          required
          class="w-full border-gray-300 border-2"
        />
        <input
          type="text"
          v-model="bnbUrl"
          required
          class="w-full border-gray-300 border-2"
        />
      </div>
      <button
        @click="$emit('bnbCrawl', bnbName, bnbUrl)"
        class="bg-blue-300 rounded-xl px-3"
      >
        新增民宿
      </button>
    </div>
  </div>
</template>
