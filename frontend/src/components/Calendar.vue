<template>
  <section class='customDiv'>
    <b-row>
      <b-col cols=12>
        <h1 class='mb-5'>Itinerary</h1>
      </b-col>
      <b-col v-for='label in daysLabel' :key='`label-${label}`'>
        <h3 class='text-center'>{{ label }}</h3>
      </b-col>
    </b-row>
    <b-row v-for='week in getMonthMatrix()' :key='`week-${week.number}`'>
      <b-col v-for='day in week.days' :key='`day-${day.number}`'>
        <Day v-if="day" :day='day.number' :label='day.label'/>
      </b-col>
    </b-row>
  </section>
  
</template>

<script>
import Day from './Day'

export default {
  name: "Calendar",
  props:['qtdDays', 'activeItinerary', 'howManyWeeks'],
  components: {
    Day
  },
  data(){
    return {
      daysLabel: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    }
  },
  methods:{

    //  please do not touch this
    getMonthMatrix(){
      const weeks = this.getWeeks()
      let matrix = []
      let negativeNumbers = -1
      console.log("Weeks before loop: " + JSON.stringify(weeks))
      for(let i = 0; i < this.howManyWeeks; i++){
        let week = {
          number: i + 1,
          days: []
        }
        let days = weeks[i].days
        let daysLabelInd = 0
        let dayInd = 0
        for(let j = 0; j < 7; j++){
          if(days[dayInd]){
            if(days[dayInd]['label'] === this.daysLabel[daysLabelInd]){
              week.days.push(days[dayInd++])
              daysLabelInd++
              if(dayInd > 6){
                dayInd = 0
              }if(daysLabelInd > 6){
                daysLabelInd = 0
              }
            }else{
              daysLabelInd++
              if(daysLabelInd > 6){
                daysLabelInd = 0
              }
              week.days.push({
                number: negativeNumbers--,
                label: ''
              })
            }
          }else{
            week.days.push({
              number: negativeNumbers--,
              label: ''
            })
          }
        }
        console.log(`Matrix week ${i + 1} added =  ${JSON.stringify(week)}`)
        matrix.push(week)
      }
      return matrix
    },
    getDaysOfWeek(weekNumber){
      let weeks = this.getWeeks()
      let week = weeks[weekNumber]
      return week.days
    },
    getWeeks(){
      let weeks = []
      let week = []
      let weekCounter = 1
      for(let day = 1; day <= this.qtdDays; day++){
        if(this.getDayName(day) === "Sunday" && day !== 1){
          weeks.push({
            number: weekCounter++,
            days: week
          })
          week = []
        }
        week.push({
          number: day,
          label: this.getDayName(day)
        })
        if(day === this.qtdDays && week.length > 0){
          weeks.push({
            number: weekCounter++,
            days: week
          })
        }
      }
      return weeks
    },
    getDayName(day){
      const d = new Date(this.getDateString(day));
      return this.daysLabel[d.getDay()]

    },
    getDateString(day){
      return `05/${day}/${this.activeItinerary.year}`
    },
    showData(){
      console.log("Day name if day == 1: " + this.getDayName(1))
      console.log("Date string if day == 1: " + this.getDateString(1))
      console.log("Weeks: " + JSON.stringify(this.getWeeks()))
      console.log("Days of week if week == 1: " + JSON.stringify(this.getDaysOfWeek(1)))
      console.log("How many weeks? " + this.howManyWeeks)
      console.log("Month Matrix:\n" + this.getMonthMatrix())
    }
  },
  mounted(){
    // this.showData()
  }
}
</script>

<style>

</style>