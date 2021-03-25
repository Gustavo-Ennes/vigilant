<template>  
  <b-overlay
    :show="isLoading"
    :variant="'dark'"
    :blur="'5px'"
    :opacity="'0.9'"
  >

    <template #overlay>
      <b-row align-v="center" align-h="center">
        <b-col cols="12">
          <h5 class="text-center text-light my-5">
            {{ loadingLabel }}
          </h5>
        </b-col>
        <b-col cols="12">
          <b-icon
            class="w-100 text-center"
            icon="binoculars"
            animation="fade"
            font-scale="5"
            :variant="'light'"
            :rotate="'180'"
          ></b-icon>
        </b-col>
      </b-row>
    </template>


    <section>
      <b-row>

        <b-col cols="6" lg='4' class="sectionTitle py-2">
          <h4 class="mb-1 mt-0">
            {{ label }}
          </h4>
          <p class="mb-4">
            - {{ getDayShifts(-1).length }} shifts total
            <br />
            - {{ getPendingShifts(-1).length }} shifts pending
          </p>
        </b-col>

        <b-col cols='6' lg='8'>
          <div class='p-2'>
            <b-row align-h='center' class='text-center text-secondary'>

              <b-col :class='{"text-warning": hovering("01")}'>
                <div :class='hovering("01") ? "darkBg" : ""'>
                  <p :class='{"lead": hovering("01")}'>
                    <i class='far fa-clock'></i> 01
                  </p>
                  <p>00:00 ~ 06:00</p>
                </div>
              </b-col>

              <b-col :class='{"text-warning": hovering("02")}'>
                <div :class='hovering("02") ? "darkBg" : ""'>
                  <p :class='{"lead": hovering("02")}'>
                    <i class='far fa-clock'></i> 02
                  </p>
                  <p>00:06 ~ 12:00</p>
                </div>
              </b-col>

              <b-col :class='{"text-warning": hovering("03")}'>
                <div :class='hovering("03") ? "darkBg" : ""'>
                  <p :class='{"lead": hovering("03")}'>
                    <i class='far fa-clock'></i> 03
                  </p>
                  <p>12:00 ~ 18:00</p>
                </div>
              </b-col>

              <b-col :class='{"text-warning": hovering("04")}'>
                <div :class='hovering("04") ? "darkBg" : ""'>
                  <p :class='{"lead": hovering("04")}'> <i class='far fa-clock'></i> 04
                  </p>
                  <p>18:00 ~ 24:00</p>
                </div>
              </b-col>
            </b-row>
          </div>
        </b-col>

        <b-col v-for="label in daysLabel" :key="`label-${label}`">
          <h4 class="text-center">{{ label }}</h4>
        </b-col>  

      </b-row>


      <b-row v-for="week in getMonthMatrix" :key="`week-${week.number}`">

        <b-col v-for="day in week.days" :key="`day-${day.number}`">
          <Day
            v-if="day"
            :day="day.number"
            :label="day.label"
            :shifts="getDayShifts(day.number)"
            :pending="getPendingShifts(day.number)"
            :place="place"
            :past='isDayInPast(day.number)'
          />
        </b-col>
      </b-row>
    </section>
  </b-overlay>
</template>

<script>
import Day from "./Day";

export default {
  name: "Calendar",
  props: [
    "qtdDays",
    "activeItinerary",
    "howManyWeeks",
    "type",
    "label",
    "shifts",
    "place",
  ],
  components: {
    Day,
  },
  data() {
    return {
      daysLabel: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    };
  },
  computed: {
    loadingLabel(){
      return this.$store.state.loadingLabel
    },
    isLoading(){
      return this.$store.state.isAComponentLoading === true && this.$store.state.componentLoading === 'calendar'
    },
    //  please do not touch this
    getMonthMatrix() {
      const weeks = this.getWeeks();
      let matrix = [];
      let negativeNumbers = -1;
      for (let i = 0; i < this.howManyWeeks; i++) {
        let week = {
          number: i + 1,
          days: [],
        };
        let days = weeks[i].days;
        let daysLabelInd = 0;
        let dayInd = 0;
        for (let j = 0; j < 7; j++) {
          if (days[dayInd]) {
            if (days[dayInd]["label"] === this.daysLabel[daysLabelInd]) {
              week.days.push(days[dayInd++]);
              daysLabelInd++;
              if (dayInd > 6) {
                dayInd = 0;
              }
              if (daysLabelInd > 6) {
                daysLabelInd = 0;
              }
            } else {
              daysLabelInd++;
              if (daysLabelInd > 6) {
                daysLabelInd = 0;
              }
              week.days.push({
                number: negativeNumbers--,
                label: "",
              });
            }
          } else {
            week.days.push({
              number: negativeNumbers--,
              label: "",
            });
          }
        }
        matrix.push(week);
      }
      return matrix;
    }
  },
  methods: {
    isDayInPast(day){
      return day < new Date().getDate()
    },
    hovering(ref){
      return this.$store.state.shiftLabelHover === ref
    },
    // a negative day parameter will return the entire month pending shifts
    getPendingShifts(day) {
      if (day === null || 0) {
        day = 1;
      }
      let shifts = [];
      for (let i = 0; i < this.shifts.length; i++) {
        if (
          (this.shifts[i].day === day &&
            this.shifts[i].placeID &&
            this.shifts[i].vigilantID === null )
          ||
          (this.shifts[i].vigilantID === null && day < 0 && !this.isDayInPast(this.shifts[i].day))
        ) {
          shifts.push(this.shifts[i]);
        }
      }
      return shifts;
    },
    getDayShifts(day) {
      // let payload = {
      //   day: day,
        
      // }
      // return this.$store.getters.getShifts()

      if (day === null || 0) {
        day = 1;
      }
      let shifts = [];
      for (let i = 0; i < this.shifts.length; i++) {
        if (this.shifts[i].day === day || day < 0 && !this.isDayInPast(this.shifts[i].day)) {
          shifts.push(this.shifts[i]);
        }
      }
      return shifts;
    },

   
    getDaysOfWeek(weekNumber) {
      let weeks = this.getWeeks();
      let week = weeks[weekNumber];
      return week.days;
    },
    getWeeks() {
      let weeks = [];
      let week = [];
      let weekCounter = 1;
      for (let day = 1; day <= this.qtdDays; day++) {
        if (this.getDayName(day) === "Sunday" && day !== 1) {
          weeks.push({
            number: weekCounter++,
            days: week,
          });
          week = [];
        }
        week.push({
          number: day,
          label: this.getDayName(day),
        });
        if (day === this.qtdDays && week.length > 0) {
          weeks.push({
            number: weekCounter++,
            days: week,
          });
        }
      }
      return weeks;
    },
    getDayName(day) {
      const d = new Date(this.getDateString(day));
      return this.daysLabel[d.getDay()];
    },
    getDateString(day) {
      return `${this.activeItinerary.month}/${day}/${this.activeItinerary.year}`;
    },
    showData() {
      console.log("Day name if day == 1: " + this.getDayName(1));
      console.log("Date string if day == 1: " + this.getDateString(1));
      console.log("Weeks: " + JSON.stringify(this.getWeeks()));
      console.log(
        "Days of week if week == 1: " + JSON.stringify(this.getDaysOfWeek(1))
      );
      console.log("How many weeks? " + this.howManyWeeks);
      console.log("Month Matrix:\n" + this.getMonthMatrix());
    },
  },
  mounted() {
    // this.showData()
  },
};
</script>
