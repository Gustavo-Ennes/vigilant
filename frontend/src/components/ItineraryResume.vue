<template>
  <section class='customDiv'>
    <b-row align-v='center' align-h='center'>
      <b-col cols='12'><h3>Resume</h3></b-col>
      <b-col v-if='currentItinerary'>
        <p><strong>Ref:</strong> {{currentItinerary.month}}/{{currentItinerary.year}}</p>
        <p><strong>Days:</strong> {{howManyDays}}</p>
        <p><strong>Shifts: </strong>{{howManyShifts}}</p>
        <p> - {{howManyToSchedule}} pending</p>
        <p> - {{ howManyScheduled() }} scheduled</p>
      </b-col>
      <b-col v-else>There's no current itinerary.</b-col>
    </b-row>
  </section>
</template>

<script>
export default {
  name:'ItineraryResume',
  props:['currentItinerary','howManyShifts', 'howManyDays', 'howManyToSchedule'],
  methods: {
    howManyScheduled(){
      return this.howManyShifts - this.howManyToSchedule
    }
  }
}
</script>