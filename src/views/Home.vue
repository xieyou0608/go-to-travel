<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { createTrip } from "../api";
export default {
  components: { Datepicker },
  data() {
    return {
      newTripName: "",
      dates: [],
    };
  },
  computed: {
    transformedDates() {
      return [...this.dates]
        .sort((a, b) => a - b)
        .map((date) => date.toJSON().split("T")[0]);
    },
  },
  methods: {
    async submitForm() {
      try {
        const res = await createTrip(this.newTripName, this.transformedDates);
        if (this.dates.length === 0) {
          throw new Error("請選擇至少一天");
        }
        console.log(res);
        const tripId = res.data.mongoId;
        this.$router.push("/trip/" + tripId);
      } catch (err) {
        alert(err.message);
      }
    },
  },
};
</script>

<template>
  <div class="flex justify-center gap-x-40 flex-wrap">
    <div class="bg-gray-200 p-10 rounded-xl">
      <form @submit.prevent="submitForm" class="flex flex-col gap-y-3">
        <input
          type="text"
          v-model="newTripName"
          placeholder="New Trip Name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          required
        />
        <Datepicker
          v-model="dates"
          multi-dates
          :enable-time-picker="false"
          inline
          auto-apply
        />
        <button>新增</button>
      </form>
    </div>
  </div>
</template>

<style lang=""></style>
