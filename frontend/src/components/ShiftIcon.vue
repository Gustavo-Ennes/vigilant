<template>
<b-row>
  <b-col 
  cols='12' 
  v-if="isNigth(reference)" 
  class='text-center'
  v-b-tooltip.hover.bottom="`Click to schedule a vigilant to ${reference}`"
  @click="handleClick">
    <i class="fas fa-moon text-success dayIcon" v-bind:class="{'text-danger': isPending}"></i><br/>
    <small class='text-success referenceIcon' v-bind:class="{'text-danger': isPending}">{{reference}}</small>
  </b-col>
  <b-col 
  cols='12' 
  v-if="isDay(reference)" 
  class='text-center' 
  v-b-tooltip.hover.top="`Click to schedule a vigilant to ${reference}`"
  @click="handleClick">
    <i class="fas fa-sun text-success dayIcon" v-bind:class="{'text-danger' : isPending}"></i><br/>
    <small class='text-success referenceIcon' v-bind:class="{'text-danger': isPending}">{{reference}}</small>
  </b-col>
</b-row>
</template>

<script>
export default {
  name: "ShiftIcon",
  props: ['reference', 'isPending', 'day'],
  methods:{
    async handleClick(){
      let payload = {
        reference: this.reference,
        isPending: this.isPending,
        day: this.day
      }
      await this.$emit("scheduleAVigilant", payload)
    },
    isNigth(ref){
      return (ref === 'Evening' || ref === 'Dawn')
    },
    isDay(ref){
      return !(ref === 'Evening' || ref === 'Dawn')
    }
  }
}
</script>

<style>
  .dayIcon{
    font-size:20px;
  }
  .referenceIcon{
    font-size:12px;
  }

</style>