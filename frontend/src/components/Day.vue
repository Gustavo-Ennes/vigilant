<template>
  <div v-if='day > 0' class='dayDiv m-2 p-2 text-center'>
    <b-row>
      <b-col></b-col>
      <b-col> 
        <h1>{{day}}</h1>
      </b-col>
      <b-col></b-col>
      <b-col cols='12'>
        {{ label }} <br/>
        <small v-if='shifts'>{{shifts.length}} shifts</small>
        <small v-if='pending'><span class='text-danger'>{{pending.length}} pending</span></small>
      </b-col>
      <b-col>
        <b-row>
          <b-col cols='6' v-for='ref in place.references' :key='`${place.name}${ref}`'>
            <ShiftIcon
            :reference="ref"
            :isPending="isPending(ref)"
            :day='day'
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
  <div v-else class='nonDay m-2'></div>
</template>

<script>
import ShiftIcon from './ShiftIcon'

export default {
  name:"Day",
  components: {
    ShiftIcon
  },
  props:['day', 'label', 'shifts', 'pending', 'place'],
  methods:{
    isPending(ref){
      if(this.place.references.includes(ref)){
        for(let i = 0; i < this.shifts.length; i++){
          if(this.shifts[i]['reference'] === ref){
            return this.shifts[i]['vigilantID'] === null
          }
        }
        return false
      }
      return null
    }
  }
}
</script>

<style scoped>
  .dayDiv{
    border-radius:10px;
    border:1px solid #444;
    background-color: #ddd;
    height: 95%;
  }
  .nonDay{
    border-radius:10px;
    background-color: #777;
    border:1px solid #444;
    height: 95%;
  }

</style>