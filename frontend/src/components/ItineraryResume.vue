<template>
  <section class="customDiv">
    <b-row align-h="center">
      <b-col cols="12"><h4 class='sectionTitle'>Resume</h4></b-col>
      <b-col v-if="currentItinerary">
        <div class='resumeWrapper'>
          <p>
            <i class='fas fa-info-circle text-secondary'></i> 
            <strong> Ref:</strong> {{ currentItinerary.month }}/{{
              currentItinerary.year
            }}
          </p>
          <p>
            <i class='fas fa-info-circle text-secondary'></i>  <strong>Days:</strong> {{ howManyDays }}
          </p>
          <b-row align-v='center'>
            <b-col cols='6'>
              <i class='fas fa-info-circle text-secondary'></i>  <strong>Shifts: </strong>
            </b-col>
            <b-col class='text-center'>
              <p><b-icon icon='calendar2-check-fill' variant="success"></b-icon></p>
              <p><b-icon icon='calendar2-x-fill' variant='danger'></b-icon></p>
              <p> 
                <i class='far fa-hand-paper text-danger' v-b-tooltip.hover title="Pending shifts"></i> {{ howManyToSchedule }}
              </p>
              <p>
                <i class='far fa-thumbs-up text-success' v-b-tooltip.hover title='Scheduled shifts'></i>  {{ howManyScheduled() }}
              </p>
            </b-col>
          </b-row>          
        </div>
      </b-col>
      <b-col v-else>There's no current itinerary.</b-col>
    </b-row>
  </section>
</template>

<script>
export default {
  name: "ItineraryResume",
  props: [
    "currentItinerary",
    "howManyShifts",
    "howManyDays",
    "howManyToSchedule",
  ],
  methods: {
    howManyScheduled() {
      return this.howManyShifts - this.howManyToSchedule;
    },
  },
};
</script>
