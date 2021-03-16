<template>
  <section class='customDiv'>
    <b-row align-h='center'>
      <b-col cols='12'><h1>Places</h1></b-col>
      <b-col cols='12' v-if='places'>
        <div v-for="place in places" :key="place._id">
          <Place :place='place'/>
        </div>
      </b-col>
      <b-col>
          <AddButton :type='"place"' />
      </b-col>  
    </b-row>
  </section>
</template>

<script>
import Place from './Place'
import AddButton from './AddButton'

export default {
  name:'Places',
  props:['places'],
  components: {
    Place,
    AddButton
  }
}
</script>

<style scoped>
  .placesList{
    border-radius:15px;
    box-shadow: 1px 1px 2px rgba(22, 17, 17, 0.2);
    margin: 10px;
    padding: 10px;
  }
</style>