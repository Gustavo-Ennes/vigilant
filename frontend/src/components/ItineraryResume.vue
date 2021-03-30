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
              <p><b-icon icon='calendar2-check-fill' variant="success" v-b-tooltip.hover title="Scheduled"></b-icon> {{ howManyScheduled }}</p>
              <p><b-icon icon='calendar2-x-fill' variant='danger' v-b-tooltip.hover title="Missed"></b-icon> {{ howManyMissed }}</p>
              <p> 
                <i class='far fa-hand-paper text-danger' v-b-tooltip.hover title="Active pending"></i> {{ howManyPending }}
              </p>
              <p>
                <i class='far fa-thumbs-up text-success' v-b-tooltip.hover title='Active scheduled'></i>  {{ howManyActive }}
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
    "howManyDays",
    'howManyScheduled',
    'howManyMissed',
    'howManyPending',
    'howManyActive'
  ]
};
</script>
