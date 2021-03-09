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
          :howManyDays='howManyDays()'
          :howManyShifts='howManyShifts()'
          :howManyToSchedule='howManyToSchedule(null)'
          />
        </div>

        <div class='col-12 col-lg-12'>
          <Calendar 
          :activeItinerary='activeItinerary' 
          :qtdDays='31'
          :howManyWeeks='6'
          />
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
  props:['url'],
  components:{
    Vigilants,
    Places,
    ItineraryResume,
    Calendar
  },
  data(){
    return{
      vigilants: [],
      places: [],
      itineraries: [],
      isLoading: false,
      loadingLabel: '',
      activeItinerary: {},
      days: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']
    }
  },
  methods:{
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
      return (new Date(`${this.activeItinerary.month}/${day}/${this.activeItinerary.year}`).getDay() === 0)
    },
    howManyDays(){
      let date = new Date()
      return new Date(date.getFullYear(), date.getMonth(), 0).getDate()
    },
    howManyShifts(){
      return this.activeItinerary['shifts'].length
    },
    // in case of day === null, it returns all pending shifts in active itinerary
    // 
    howManyToSchedule(day){ // of this active itinerary, of course
      let counter = 0
      console.log("Active itinerary:\n" + JSON.stringify(this.activeItinerary))
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
    showData(){
      console.log("\n\nshowData():::\n")
      console.log(`\n\nVigilants:\n${JSON.stringify(this.vigilants)}`)
      console.log(`\n\nPlaces:\n${JSON.stringify(this.places)}`)
      console.log(`\n\nQtd. of itineraries:\n${JSON.stringify(this.itineraries.length)}`)
      console.log(`\n\nHas active itinerary?:\n${this.hasActiveItinerary()}`)
    },
    hasActiveItinerary(){
      return Object.keys(this.activeItinerary).length > 0 ? "Yes" : "No"
    },
    async fetchAPI(type){

      let res = null

      switch(type){
        case 's':
          this.loadingLabel = 'shifts'
          res = await fetch(this.url + '/shifts')
          res = await res.json()
          res = res.shifts
          break
        case "v":
          this.loadingLabel = 'vigilants'
          res = await fetch(this.url + '/vigilant')
          res = await res.json()
          res = res.vigilants
          break
        case "i":
          this.loadingLabel = 'itineraries'
          res = await fetch(this.url + '/itinerary')
          res = await res.json()
          res = res.itineraries
          break
        case "p":
          this.loadingLabel = 'places'
          res = await fetch(this.url + '/place')
          res = await res.json()
          res = res.places
          break
        case 'ai':
          this.loadingLabel = 'actual itinerary'
          res = await fetch(this.url + '/itinerary/active')
          res = await res.json()
          res = res.activeItinerary
          break
        default:break
      }
      return res;
    }
  },
  async created(){
    this.isLoading = true
    this.vigilants = await this.fetchAPI('v')
    this.places =  await this.fetchAPI('p')
    this.itineraries =  await this.fetchAPI('i')
    this.shifts = await this.fetchAPI('s')
    this.activeItinerary =  await this.fetchAPI('ai')
    this.isLoading = false
    this.loadingLabel = ''
    // this.showData()
  }
}
</script>