<template>    
  <b-overlay 
  :show='$store.state.isLoading' 
  class='vh-100'
  :variant="'dark'"
  :bg-color="'rgba(66, 76, 127, 0.6)'"
  :spinner-variant="'light'"
  :blur="'5px'"
  :opacity="'0.9'">
    <b-container fluid>
      <section v-if="!$store.state.isLoading" class='row justify-content-center'>

        <div class='col-12 col-lg-4'>
          <Places :places='$store.state.places'/>
        </div>

        <div class='col-12 col-lg-6'>
          <Vigilants :vigilants="$store.state.vigilants"/>
        </div>

        <div class='col-12 col-lg-2'>
          <ItineraryResume
          :currentItinerary='$store.state.activeItinerary'
          :howManyDays='howManyDays()'
          :howManyShifts='howManyShifts()'
          :howManyToSchedule='howManyToSchedule(null)'
          />
        </div>

        <div class='col-12 col-lg-12'>
          <b-tabs content-class="mt-3">
            <b-tab v-for="place in $store.state.places" :key='place._id' :title="`${place.name}`" active>
              <Calendar 
              :activeItinerary='$store.state.activeItinerary' 
              :qtdDays='howManyDays()'
              :howManyWeeks='howManyWeeks()'
              :type="'place'"
              :label="place.name"
              :shifts='getShiftsByPlace(place)'
              :place='place'
              />              
            </b-tab>
          </b-tabs>
        </div>

      </section>    
      <section v-else class='vh-100 row justify-content-center align-items-center'>

        <h1 class='col-12 text-center'>Loading {{$store.state.loadingLabel}}...</h1>

      </section>
    </b-container>
  </b-overlay>
</template>

<script>
import Vigilants from './Vigilants.vue'
import Places from './Places.vue'
import ItineraryResume from './ItineraryResume'
import Calendar from './Calendar'

export default {
  name: "Dashboard",
  props:['url'],
  components:{
    Vigilants,
    Places,
    ItineraryResume,
    Calendar
  },
  data(){
    return{
      days: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']
    }
  },
  methods:{
    getShiftsByPlace(place){
      let shifts = []
      for(let i = 0; i < this.$store.state.shifts.length; i++){
        if(this.$store.state.shifts[i].placeID === place._id){
          shifts.push(this.$store.state.shifts[i])
        }
      }
      return shifts
    },
    howManyWeeks(){
      let weeks = this.isSunday(1) ? 0 : 1
      for(let day = 1; day <= this.howManyDays(); day++){
        if(this.isSunday(day) && (day !== 1 && day !== this.howManyDays())){
          weeks++
        }
      }
      return weeks
    },
    isSunday(day){
      return (new Date(`${this.$store.state.activeItinerary.month}/${day}/${this.$store.state.activeItinerary.year}`).getDay() === 0)
    },
    howManyDays(){
      return new Date(this.$store.state.activeItinerary['year'], this.$store.state.activeItinerary['month'], 0).getDate()
    },
    howManyShifts(){
      return this.$store.state.activeShifts.length
    },
    // in case of day === null, it returns all pending shifts in active itinerary
    // 
    howManyToSchedule(day){ // of this active itinerary, of course
      let counter = 0
      for(let i = 0; i < this.$store.state.shifts.length; i++){
        let shift = this.$store.state.shifts[i]
        if(this.$store.state.activeItinerary.shifts.includes(shift._id)){
          if(shift.vigilantID === null ){
            if(day === null){
              counter++
            }else{
              if(day === shift.day){
                counter++
              }
            }
          }
        }
      }
      return counter
    },
    showData(){
      console.log(JSON.stringify(this.$store.state))
    },
    hasActiveItinerary(){
      return Object.keys(this.$store.state.activeItinerary).length > 0 ? "Yes" : "No"
    }
  },
  async mounted(){
    await this.$store.dispatch('fetchAPI', this.url)
    this.showData()
  }
}
</script>