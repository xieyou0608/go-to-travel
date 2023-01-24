<template>
  <div class="flex justify-center gap-x-40 flex-wrap">
    <div class="bg-gray-200 p-10 rounded-xl">
      <form action="" class="flex flex-col gap-y-3">
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
    <!-- <div>
      <ul>
        <li v-for="date in sortedDates">
          {{
            new Intl.DateTimeFormat("zh-tw", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            }).format(date)
          }}
        </li>
      </ul>
    </div> -->
  </div>
</template>
<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  components: { Datepicker },
  data() {
    return {
      newTripName: "",
      dates: [],
    };
  },
  //   computed: {
  //     sortedDates() {
  //       console.log(this.dates);
  //       return [...this.dates].sort((a, b) => a - b);
  //     },
  //   },
};
</script>
<style lang=""></style>
