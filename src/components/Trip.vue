<script>
import { getTrip, patchNewMember, patchMyVote, getAvailableRoom } from "../api";
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const tripId = route.params.tripId;
    const isLogin = ref(false);
    const userName = ref("");
    const isEditing = ref(false);
    const myVote = ref({});
    const tripInfo = reactive({
      tripName: "",
      availableDates: [],
      members: {},
      bnbs: {},
      memberList: computed(() => {
        return Object.keys(tripInfo.members).map((key) => ({
          userName: key,
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
        } else {
          throw new Error("資料不存在");
        }
      } catch (err) {
        alert(err.message);
        router.push("/");
      }
    });

    const datesPoll = computed(() => {
      const result = {};
      tripInfo.availableDates.forEach((date) => {
        result[date] = { O: 0, A: 0, X: 0 };
      });

      Object.keys(tripInfo.members).forEach((userName) => {
        const datesVote = { ...tripInfo.members[userName].datesVote };
        Object.keys(datesVote).forEach((date) => {
          const choice = datesVote[date];
          if (choice) {
            result[date][choice] += 1;
          }
        });
      });
      return result;
    });

    const submitName = async () => {
      if (userName.value in tripInfo.members) {
        myVote.value = tripInfo.members[userName.value].datesVote;
        isLogin.value = true;
      } else {
        try {
          const res = await patchNewMember(
            tripId,
            userName.value,
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

    const handleEditing = () => {
      isEditing.value = true;
    };

    const voteDate = (date, answer) => {
      myVote.value[date] = answer;
      console.log(myVote.value);
    };

    const submitVote = async () => {
      try {
        const res = await patchMyVote(tripId, userName.value, myVote.value);
        console.log(res);
        tripInfo.members[userName.value].datesVote = myVote.value;
        isEditing.value = false;
      } catch (err) {
        console.log(err);
      }
    };

    const bnbName = ref("宜蘭深圳驛站");
    const bnbUrl = ref(
      "https://twstay.com/RWD2/booking.aspx?BNB=shenzhou&OrderType=2"
    );

    const bnbCrawl = () => {
      tripInfo.bnbs[bnbName.value] = {};
      tripInfo.bnbs[bnbName.value].url = bnbUrl.value;
      tripInfo.bnbs[bnbName.value].rooms = {};
      tripInfo.availableDates.forEach(async (date) => {
        tripInfo.bnbs[bnbName.value].rooms[date] = [];
        try {
          const twstayDate = new Date(date).toLocaleDateString();
          const res = await getAvailableRoom(bnbUrl.value, twstayDate);
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
            tripInfo.bnbs[bnbName.value].rooms[date].push(roomInfo);
          });
          console.log(tripInfo.bnbs);
        } catch (err) {
          console.log(err);
        }
      });
    };

    return {
      isLogin,
      userName,
      isEditing,
      myVote,
      submitName,
      handleEditing,
      voteDate,
      tripInfo,
      datesPoll,
      submitVote,
      bnbCrawl,
      bnbName,
      bnbUrl,
    };
  },
};
</script>

<template lang="">
  <h4>{{ tripInfo.tripName }}</h4>
  <div class="flex justify-around w-full min-h-[30vh]">
    <!-- 出遊成員 -->
    <div id="members" class="bg-gray-200 p-2 w-[30vw]">
      <div v-if="!isLogin" class="p-2 bg-white m-1">
        <form @submit.prevent="submitName">
          <input
            type="text"
            v-model="userName"
            placeholder="請輸入名字"
            required
          />
          <button>確認</button>
        </form>
      </div>

      <div
        v-for="member in tripInfo.memberList"
        class="flex items-center justify-between p-2 bg-white m-1"
      >
        <div class="">{{ member.userName }}</div>
      </div>
    </div>
    <!-- 新增民宿 -->
    <div id="bnb" class="bg-gray-200 p-2 w-[30vw]">
      <input type="text" v-model="bnbName" required />
      <input type="text" v-model="bnbUrl" required />
      <button @click="bnbCrawl()">搜尋</button>
    </div>
  </div>
  <div class="flex justify-around w-full min-h-[50vh]">
    <!-- 日期投票 -->
    <div id="dates" class="bg-gray-200 p-2 w-[90vw]">
      <div
        v-for="date in tripInfo.availableDates"
        class="flex items-center justify-between p-2 bg-white m-1"
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
            class="px-2 py-1 rounded-full"
            :class="{ 'bg-green-200': myVote[date] === 'O' }"
          >
            <font-awesome-icon icon="fa-regular fa-circle" />
          </button>
          <button
            @click="voteDate(date, 'A')"
            class="px-2 py-1 rounded-full"
            :class="{ 'bg-green-200': myVote[date] === 'A' }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-triangle"
              viewBox="0 0 16 16"
            >
              <path
                d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
              />
            </svg>
          </button>
          <button
            @click="voteDate(date, 'X')"
            class="px-2 py-1 rounded-full"
            :class="{ 'bg-green-200': myVote[date] === 'X' }"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <div v-else class="flex items-center gap-x-2">
          <font-awesome-icon icon="fa-regular fa-circle" />
          {{ datesPoll[date].O }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-triangle"
            viewBox="0 0 16 16"
          >
            <path
              d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
            />
          </svg>
          {{ datesPoll[date].A }}
          <font-awesome-icon icon="fa-solid fa-xmark" />
          {{ datesPoll[date].X }}
        </div>
        <div v-for="bnbName in tripInfo.bnbList">
          {{ bnbName }}
          <p v-for="room in tripInfo.bnbs[bnbName].rooms[date]">
            {{ room.roomTitle }}
            {{ room.roomStatus }}
          </p>
        </div>
      </div>
      <button class="p-2" v-if="!isEditing && isLogin" @click="handleEditing()">
        編輯
      </button>
      <button class="p-2" v-if="isEditing" @click="submitVote()">完成</button>
    </div>
  </div>
</template>

<style lang=""></style>
