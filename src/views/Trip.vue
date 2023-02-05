<script setup>
import {
  getTrip,
  patchNewMember,
  patchMyVote,
  getAvailableRoom,
  patchBnbInfo,
} from "../api";
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Members from "../components/Members.vue";
import BnbCrawler from "../components/BnbCrawler.vue";
import PollResult from "../components/PollResult.vue";
const router = useRouter();
const route = useRoute();
const tripId = route.params.tripId;
const isLogin = ref(false);
const username = ref("");
const tripInfo = reactive({
  tripName: "",
  availableDates: [],
  members: {},
  bnbs: {},
  memberList: computed(() => {
    return Object.keys(tripInfo.members).map((key) => ({
      username: key,
      datesVote: tripInfo.members[key].datesVote,
    }));
  }),
  bnbList: computed(() => {
    return Object.keys(tripInfo.bnbs);
  }),
});

onMounted(async () => {
  try {
    const res = await getTrip(tripId);
    if (res.data) {
      console.log(res.data);
      const tripData = res.data;
      tripInfo.tripName = tripData.tripName;
      tripInfo.availableDates = tripData.availableDates || [];
      tripInfo.members = tripData.members || {};
      tripInfo.bnbs = tripData.bnbs || {};
    } else {
      throw new Error("資料不存在");
    }
  } catch (err) {
    alert(err.message);
    router.push("/");
  }
});

const submitName = async (inputName) => {
  username.value = inputName;
  if (inputName in tripInfo.members) {
    isLogin.value = true;
  } else {
    try {
      const res = await patchNewMember(
        tripId,
        username.value,
        tripInfo.availableDates
      );
      console.log(res.data);
      isLogin.value = true;
      tripInfo.members = { ...tripInfo.members, ...res.data };
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }
};

const bnbCrawl = async (bnbName, bnbUrl) => {
  tripInfo.bnbs[bnbName] = {};
  tripInfo.bnbs[bnbName].url = bnbUrl;
  tripInfo.bnbs[bnbName].rooms = {};
  await Promise.all(
    tripInfo.availableDates.map(async (date) => {
      tripInfo.bnbs[bnbName].rooms[date] = [];
      try {
        const twstayDate = new Date(date).toLocaleDateString();
        const res = await getAvailableRoom(bnbUrl, twstayDate);
        const data = res.data;
        data.forEach((room) => {
          const roomInfo = {};
          roomInfo.roomTitle = room.roomTitle;
          if (room.hasNoRoom) {
            roomInfo.roomStatus = "沒有空房";
          } else {
            roomInfo.roomStatus =
              room.roomPrice + "元" + room.roomRemain + "間";
          }
          tripInfo.bnbs[bnbName].rooms[date].push(roomInfo);
        });
        console.log(tripInfo.bnbs);
      } catch (err) {
        console.log(err);
      }
    })
  );
  addNewBnb(bnbName, tripInfo.bnbs[bnbName]);
};

const addNewBnb = async (newBnbName, newBnbInfo) => {
  console.log(newBnbInfo);
  try {
    const res = await patchBnbInfo(tripId, newBnbName, newBnbInfo);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

const submitVote = async (myVote) => {
  try {
    const res = await patchMyVote(tripId, username.value, myVote);
    console.log(res);
    tripInfo.members[username.value].datesVote = myVote;
  } catch (err) {
    console.log(err);
  }
};
</script>

<template lang="">
  <div class="w-[90vw] min-h-[80vh] flex flex-col gap-y-3">
    <h4 class="text-center">{{ tripInfo.tripName }}</h4>
    <!-- 出遊成員 -->
    <Members
      :is-login="isLogin"
      :trip-info="tripInfo"
      :username="username"
      @submit-name="submitName"
    />

    <BnbCrawler @bnb-crawl="bnbCrawl" />

    <PollResult
      :is-login="isLogin"
      :trip-info="tripInfo"
      :username="username"
      @submit-vote="submitVote"
    />
  </div>
</template>

<style lang=""></style>
