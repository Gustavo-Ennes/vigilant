<template>
  <div v-if="day > 0" class="dayDiv m-2 p-2 text-center">
    <b-row>
      <b-col></b-col>
      <b-col>
        <h1 class='display-4 text-center'>{{ day }}</h1>
      </b-col>
      <b-col></b-col>
      <b-col cols="12">
        <b-row>
          <b-col cols='12'>            
            <p class='m-0 p-0'>{{ label }}</p>
          </b-col>
          <b-col cols='6'>         
            <small v-if="shifts" class='pt-0'>{{ shifts.length }} shifts</small>
          </b-col>
          <b-col cols='6'>
            <small v-if="pending"><span class="text-danger">{{ pending.length }} pending</span></small>
          </b-col>          
        </b-row>
      </b-col>
      <b-col>
        <b-row>
          <b-col
            cols="6"
            v-for="shift in shifts"
            :key="`${shift.day}-${shift.reference}-${place._id}`"
          >
            <ShiftIcon
              :reference="shift.reference"
              :isPending="isPending(shift)"
              :day="shift.day"
              :place="place"
              :shift="shift"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
  <div v-else class="nonDay m-2"></div>
</template>

<script>
import ShiftIcon from "./ShiftIcon";

export default {
  name: "Day",
  components: {
    ShiftIcon,
  },
  props: ["day", "label", "shifts", "pending", "place"],
  methods: {
    isPending(shift) {
      if (this.place.references.includes(shift.reference)) {
        return shift.vigilantID === null;
      }
      return null;
    },
  },
};
</script>

<style scoped>
.dayDiv {
  border-radius: 10px;
  border: 1px solid #444;
  background-color: #ddd;
  height: 95%;
}
.nonDay {
  border-radius: 10px;
  background-color: #777;
  border: 1px solid #444;
  height: 95%;
}
small{
  font-size: 10px;
}
</style>
