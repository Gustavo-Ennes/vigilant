<template>
  <div v-if='day > 0' class='dayDiv m-2 p-2'>
    <h2>{{day}}</h2>
    <small>{{ label }}</small>
  </div>
  <div v-else class='nonDay m-2'></div>
</template>

<script>
export default {
  name:"Day",
  props:['day', 'label'],
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