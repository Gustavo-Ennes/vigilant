<template>
  <b-overlay
    :show="isLoading"
    class="vh-100"
    :variant="'dark'"
    :blur="'5px'"
    :opacity="'0.9'"
  >
    <template #overlay>
      <b-row align-v="center" align-h="center">
        <b-col cols="12">
          <h1 class='display-1'>vigilant</h1>
        </b-col>
        <b-col cols="12">
          <h5 class="text-center text-light my-5">
            Loading {{ loadingLabel }}... .
          </h5>
        </b-col>
        <b-col cols="12">
          <b-icon
            class="w-100 text-center"
            icon="binoculars"
            animation="fade"
            font-scale="10"
            :variant="'light'"
            :rotate="'180'"
          ></b-icon>
        </b-col>
      </b-row>
    </template>

    <b-container fluid>
      <section v-if="!isLoading" class="row justify-content-center">
        <div class="col-12 col-lg-4">
          <Places :places="places" />
        </div>

        <div class="col-12 col-lg-6">
          <Vigilants :vigilants="vigilants" />
        </div>

        <div class="col-12 col-lg-2">
          <ItineraryResume
            :currentItinerary="activeItinerary"
            :howManyDays="howManyDays"
            :howManyShifts="howManyShifts"
            :howManyToSchedule="howManyToSchedule(null)"
          />
        </div>

        <div class="col-12 col-lg-12">
          <b-tabs
            content-class="mt-3"
            :justified="true"
            :value="actualTabOpened"
          >
            <b-tab
              v-for="place in places"
              :key="place._id"
              :title="`${place.name}`"
            >
              <Calendar
                :activeItinerary="activeItinerary"
                :qtdDays="howManyDays"
                :howManyWeeks="howManyWeeks"
                :type="'place'"
                :label="place.name"
                :shifts="getShifts(place)"
                :place="place"
              />
            </b-tab>
          </b-tabs>
        </div>
      </section>
      <section
        v-else
        class="vh-100 row justify-content-center align-items-center"
      >
        <b-col class="bg-dark"></b-col>
      </section>
    </b-container>
  </b-overlay>
</template>

<script>
import Vigilants from "./Vigilants.vue";
import Places from "./Places.vue";
import ItineraryResume from "./ItineraryResume";
import Calendar from "./Calendar";

export default {
  name: "Dashboard",
  components: {
    Vigilants,
    Places,
    ItineraryResume,
    Calendar,
  },
  data() {
    return {
      days: ["su", "mo", "tu", "we", "th", "fr", "sa"],
      actualTabOpened: 0
    };
  },
  computed: {
    vigilants() {
      return this.$store.state.vigilants;
    },
    places() {
      return this.$store.state.places;
    },
    itineraries() {
      return this.$store.state.itineraries;
    },
    shifts() {
      return this.$store.state.shifts
    },
    activeItinerary() {
      return this.$store.state.activeItinerary;
    },
    activeShifts() {
      return this.$store.state.activeShifts;
    },
    isLoading() {
      return this.$store.state.isLoading;
    },
    loadingLabel() {
      return this.$store.state.loadingLabel;
    },
    howManyWeeks() {
      let weeks = this.isSunday(1) ? 0 : 1;
      for (let day = 1; day <= this.howManyDays; day++) {
        if (this.isSunday(day) && day !== 1 && day !== this.howManyDays) {
          weeks++;
        }
      }
      return weeks;
    },
    howManyDays() {
      return new Date(
        this.activeItinerary["year"],
        this.activeItinerary["month"],
        0
      ).getDate();
    },
    howManyShifts() {
      return this.activeShifts.length;
    },

    hasActiveItinerary() {
      return Object.keys(this.activeItinerary).length > 0 ? "Yes" : "No";
    },
    // this will return an array for each place containing the respective shifts
    
  },
  methods: {
    getShifts(place){
      let shifts = []
      for(let i = 0; i < this.shifts.length; i++){
        if(this.shifts[i].placeID === place._id){
          shifts.push(this.shifts[i])
        }
      }
      return shifts
    },
    isSunday(day) {
      return (
        new Date(
          `${this.activeItinerary.month}/${day}/${this.activeItinerary.year}`
        ).getDay() === 0
      );
    },
    // in case of day === null, it returns all pending shifts in active itinerary
    //
    howManyToSchedule(day) {
      // of this active itinerary, of course
      let counter = 0;
      for (let i = 0; i < this.shifts.length; i++) {
        let shift = this.shifts[i];
        if (this.activeItinerary.shifts.includes(shift._id)) {
          if (shift.vigilantID === null) {
            if (day === null) {
              counter++;
            } else {
              if (day === shift.day) {
                counter++;
              }
            }
          }
        }
      }
      return counter;
    },
    showData() {
      console.log(JSON.stringify(this.$store.state));
    },
  },
  async created() {
    this.$store.commit("setLoading");
    await this.$store.dispatch("fetchAPI");
    this.$store.commit("unsetLoading");
    // this.showData()
  },
};
</script>

<style lang="scss">
  @import '../assets/global.scss';  
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');

  .display-1{
    font-family: 'DotGothic16', sans-serif;
    color:#eee;
    text-align: center;
  }
</style>
