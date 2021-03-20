<template>
  <div v-if="day > 0" class="dayDiv text-center">
    <b-row>
      <b-col cols='12'>
        <h1 class='display-4 text-center'>{{ day }}</h1>
      </b-col>
      <b-col cols="12">
        <b-row>
          <b-col cols='12'>            
            <small >{{ label }}</small>
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
            cols='3'
            v-for="shift in reorderedShifts"
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
  computed: {    
    reorderedShifts(){
      let s = []
      let aux = null

      aux = this.hasRef('Dawn')
      if(aux != null){
        s.push(aux)
      }
      aux = this.hasRef('Morning')
      if(aux != null){
        s.push(aux)
      }
      aux = this.hasRef('Afternoon')
      if(aux != null){
        s.push(aux)
      }
      aux = this.hasRef('Evening')
      if(aux != null){
        s.push(aux)
      }
      return s
    }
  },
  methods: {
    hasRef(ref){
      for(let i = 0; i < this.shifts.length; i++){
        if(this.shifts[i].reference === ref){
          return this.shifts[i]
        }
      }
      return false
    },
    isPending(shift) {
      if (this.place.references.includes(shift.reference)) {
        return shift.vigilantID === null;
      }
      return null;
    },
  },
};
</script>

<style lang='scss' scoped>
.dayDiv{
  border-radius: 10px;
  border: 1px solid #444;
  background-color: #ddd;
  margin-top:3px;
  margin-bottom:3px;
  margin-right: 1px !important;
  margin-left: 1px !important;
}
small{
  font-size: 10px;
}
</style>
