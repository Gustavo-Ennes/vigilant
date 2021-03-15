<template>    
  <b-overlay 
  :show='isLoading' 
  class='vh-100'
  :variant="'dark'"
  :bg-color="'rgba(66, 76, 127, 0.6)'"
  :spinner-variant="'light'"
  :blur="'5px'"
  :opacity="'0.9'">
    <b-container fluid>
      <section v-if="!isLoading" class='row justify-content-center'>

        <div class='col-12 col-lg-4'>
          <Places :places='places'/>
        </div>

        <div class='col-12 col-lg-6'>
          <Vigilants :vigilants="vigilants"/>
        </div>

        <div class='col-12 col-lg-2'>
          <ItineraryResume
          :currentItinerary='activeItinerary'
          :howManyDays='howManyDays'
          :howManyShifts='howManyShifts'
          :howManyToSchedule='howManyToSchedule(null)'
          />
        </div>

        <div class='col-12 col-lg-12'>
          <b-tabs 
          content-class="mt-3" 
          :justified="true"
          :value="actualTabOpened"
          >
            <b-tab 
            v-for="place in places" 
            :key='place._id' 
            :title="`${place.name}`"
            >
              <Calendar 
              :activeItinerary='activeItinerary' 
              :qtdDays='howManyDays'
              :howManyWeeks='howManyWeeks'
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

        <h1 class='col-12 text-center'>Loading {{loadingLabel}}...</h1>

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
  components:{
    Vigilants,
    Places,
    ItineraryResume,
    Calendar
  },
  data(){
    return{
      days: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'],
      actualTabOpened: 0
    }
  },
  computed:{
    vigilants(){
      return this.$store.state.vigilants
    },
    places(){
      return this.$store.state.places
    },
    itineraries(){
      return this.$store.state.itineraries
    },
    shifts(){
      return this.$store.state.shifts
    },
    activeItinerary(){
      return this.$store.state.activeItinerary
    },
    activeShifts(){
      return this.$store.state.activeShifts
    },
    isLoading(){
      return this.$store.state.isLoading
    },
    loadingLabel(){
      return this.$store.state.loadingLabel
    },
    howManyWeeks(){
      let weeks = this.isSunday(1) ? 0 : 1
      for(let day = 1; day <= this.howManyDays; day++){
        if(this.isSunday(day) && (day !== 1 && day !== this.howManyDays)){
          weeks++
        }
      }
      return weeks
    },
    howManyDays(){
      return new Date(this.activeItinerary['year'], this.activeItinerary['month'], 0).getDate()
    },
    howManyShifts(){
      return this.activeShifts.length
    },
    
    hasActiveItinerary(){
      return Object.keys(this.activeItinerary).length > 0 ? "Yes" : "No"
    },
  },
  methods:{
    isSunday(day){
      return (new Date(`${this.activeItinerary.month}/${day}/${this.activeItinerary.year}`).getDay() === 0)
    },
    // in case of day === null, it returns all pending shifts in active itinerary
    // 
    howManyToSchedule(day){ // of this active itinerary, of course
      let counter = 0
      for(let i = 0; i < this.shifts.length; i++){
        let shift = this.shifts[i]
        if(this.activeItinerary.shifts.includes(shift._id)){
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
    getShiftsByPlace(place){
      let shifts = []
      for(let i = 0; i < this.shifts.length; i++){
        if(this.shifts[i].placeID === place._id){
          shifts.push(this.shifts[i])
        }
      }
      return shifts
    },
    showData(){
      console.log(JSON.stringify(this.$store.state))
    }
  },
  async created(){
    await this.$store.dispatch('fetchAPI')
    // this.showData()
  }
}
</script>