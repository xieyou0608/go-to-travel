<script setup>
import { ref, computed } from "vue";
defineEmits(["bnbCrawl"]);
const bnbUrl = ref("https://twstay.com/RWD2/index.aspx?bnb=memorycastle");

const getBnbIdFromUrl = (inputUrl) => {
  const parsedUrl = new URL(inputUrl.toLowerCase());
  return parsedUrl.searchParams.get("bnb");
};

const bnbId = computed(() => {
  return getBnbIdFromUrl(bnbUrl.value);
});
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
          v-model="bnbUrl"
          required
          class="w-full border-gray-300 border-2"
        />
      </div>
      <button
        @click="$emit('bnbCrawl', bnbId)"
        class="bg-blue-300 rounded-xl px-3"
      >
        搜尋空房
      </button>
    </div>
  </div>
</template>
