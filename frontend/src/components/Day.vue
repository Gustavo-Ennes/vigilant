<template>
  <div v-if="day > 0" class="dayDiv text-center" :class='[{"evtNone": past}, {"pastDay": past}]'>

    <div class='overlay' v-if='past'></div>


    <b-row>
      <b-col cols='12'>
        <h1 class='display-4 text-center' :class='{"text-secondary": past}'>{{ day }}</h1>
      </b-col>
      <b-col cols="12">
        <b-row>
          <b-col cols='12'>            
            <small :class='{"text-secondary": past}' >{{ label }}</small>
          </b-col>
          <b-col cols='6'>         
            <small v-if="shifts && !past" class='pt-0' :class='{"text-secondary": past}'>{{ shifts.length }} shifts</small>
          </b-col>
          <b-col cols='6'>
            <small v-if="pending && !past"><span class="text-danger" :class='{"text-secondary": past}'>{{ pending.length }} pending</span></small>
          </b-col>    
          <b-col v-if='past'><small>{{shifts.length}} scheduled, {{pending.length}} missed</small></b-col>      
        </b-row>
      </b-col>
      <b-col v-if='!past'>
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
              :past="past"
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
  props: ["day", "label", "shifts", "pending", "place", 'past'],
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
    getRef(ref){
      return this.$store.getters.referenceNumber(ref)
    },
    getName(id){
      let v = this.$store.getters.getVigilantByID(id)
      return  v != null ? v.name.split(" ")[0] : "anyone"

    },
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
  min-height: 165px;
}
small{
  font-size: 10px;
}
.pastDay{
  background-color:#888 !important;
}
p{
  margin:0 !important;
}
.evtNone{
  pointer-events: none;
}
.text-secondary{
  color:#bbb !important;
}
</style>
