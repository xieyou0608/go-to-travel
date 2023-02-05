<script setup>
import { ref } from "vue";
defineProps(["isLogin", "tripInfo", "username"]);
defineEmits(["submitName"]);

const inputName = ref("");
</script>

<template>
  <h5>成員</h5>
  <div id="members" class="bg-gray-200 p-2 flex w-full">
    <div v-if="!isLogin" class="p-2 w-full">
      <form
        @submit.prevent="$emit('submitName', inputName)"
        class="flex flex-col gap-y-4 lg:flex-row"
      >
        <input
          type="text"
          v-model="inputName"
          placeholder="請輸入名字"
          required
          class="border-gray-300 border-2 p-2 w-full lg:w-auto"
        />
        <button class="bg-green-300 rounded-xl py-2 px-5 ml-3">確認</button>
      </form>
    </div>
    <div v-else class="flex">
      <div
        v-for="member in tripInfo.memberList"
        class="p-2 m-1 rounded-3xl"
        :class="{
          'bg-white': member.username !== username,
          'bg-green-800': member.username === username,
          'text-white': member.username === username,
        }"
      >
        {{ member.username }}
      </div>
    </div>
  </div>
</template>
