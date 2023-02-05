<script setup>
import { ref, computed } from "vue";
import TriangleIcon from "./svgIcon/TriangleIcon.vue";
// ref 的值不能直接從 props 用 ES6 解構出來，會失去響應性
const props = defineProps(["isLogin", "tripInfo", "username"]);
const { tripInfo } = props;
const emit = defineEmits(["submitVote"]);

const isEditing = ref(false);
const myVote = ref({});

const handleEditing = () => {
  isEditing.value = true;
  myVote.value = tripInfo.members[props.username].datesVote;
};

const voteDate = (date, answer) => {
  myVote.value[date] = answer;
};

const handleSubmitVote = () => {
  emit("submitVote", myVote.value);
  isEditing.value = false;
};

const datesPoll = computed(() => {
  const result = {};
  tripInfo.availableDates.forEach((date) => {
    result[date] = { O: 0, A: 0, X: 0 };
  });

  Object.keys(tripInfo.members).forEach((username) => {
    const datesVote = { ...tripInfo.members[username].datesVote };
    Object.keys(datesVote).forEach((date) => {
      const choice = datesVote[date];
      if (choice) {
        result[date][choice] += 1;
      }
    });
  });
  return result;
});
</script>

<template>
  <!-- 下方投票結果 -->
  <div class="flex items-center gap-x-2">
    <h5>日期及民宿狀況</h5>
    <button
      class="bg-green-300 rounded-xl py-3 px-4"
      v-if="!isEditing && isLogin"
      @click="handleEditing()"
    >
      日期投票
    </button>
    <button
      class="bg-green-300 rounded-xl py-3 px-4"
      v-if="isEditing"
      @click="handleSubmitVote()"
    >
      完成投票
    </button>
  </div>
  <div id="dates" class="bg-gray-200 p-2 w-full flex-grow">
    <div
      v-for="date in tripInfo.availableDates"
      class="flex items-center justify-between p-2 bg-white m-1 overflow-auto gap-x-5"
    >
      <div>
        {{
          new Intl.DateTimeFormat("zh-tw", {
            month: "long",
            day: "numeric",
            weekday: "short",
          }).format(new Date(date))
        }}
      </div>
      <div v-if="isEditing" class="flex items-center gap-x-2">
        <button
          @click="voteDate(date, 'O')"
          class="w-8 h-8 rounded-full flex justify-center items-center"
          :class="{ 'bg-green-200': myVote[date] === 'O' }"
        >
          <font-awesome-icon icon="fa-regular fa-circle" />
        </button>
        <button
          @click="voteDate(date, 'A')"
          class="w-8 h-8 rounded-full flex justify-center items-center"
          :class="{ 'bg-green-200': myVote[date] === 'A' }"
        >
          <TriangleIcon />
        </button>
        <button
          @click="voteDate(date, 'X')"
          class="w-8 h-8 rounded-full flex justify-center items-center"
          :class="{ 'bg-green-200': myVote[date] === 'X' }"
        >
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
      </div>
      <div v-else class="flex items-center gap-x-2">
        <font-awesome-icon icon="fa-regular fa-circle" />
        {{ datesPoll[date].O }}
        <TriangleIcon />
        {{ datesPoll[date].A }}
        <font-awesome-icon icon="fa-solid fa-xmark" />
        {{ datesPoll[date].X }}
      </div>

      <div v-for="bnbName in tripInfo.bnbList" class="min-w-[20vw]">
        {{ bnbName }}
        <p v-for="room in tripInfo.bnbs[bnbName].rooms[date]">
          {{ room.roomTitle }}
          {{ room.roomStatus }}
        </p>
      </div>
    </div>
  </div>
</template>
