<template lang="">
  <div>trip page {{ tripName }}</div>
  <div>
    trip date
    <p v-for="date in availableDates">{{ date }}</p>
  </div>
</template>
<script>
import { getTrip } from "../api";
import { ref } from "vue";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const tripId = route.params.tripId;
    const tripName = ref("");
    const availableDates = ref([]);
    onMounted(async () => {
      console.log(tripId);
      try {
        const res = await getTrip(tripId);
        if (res.data) {
          console.log(res.data);
          tripName.value = res.data.tripName;
          availableDates.value = res.data.availableDates;
        } else {
          throw new Error("資料不存在");
        }
      } catch (err) {
        alert(err.message);
        router.push("/");
      }
    });
    return { tripName, availableDates };
  },
};
</script>
<style lang=""></style>
