<script setup>
import {
  getTrip,
  patchNewMember,
  patchMyVote,
  getAvailableRooms,
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

const bnbCrawl = async (bnbId) => {
  try {
    if (bnbId in tripInfo.bnbs) {
      tripInfo.bnbs[bnbId].rooms = null;
    }
    const res = await getAvailableRooms(bnbId, tripInfo.availableDates);
    tripInfo.bnbs[bnbId] = res.data;

    await patchBnbInfo(tripId, bnbId, tripInfo.bnbs[bnbId]);
  } catch (error) {
    console.log(error);
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
