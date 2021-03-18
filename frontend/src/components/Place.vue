<template>
  <div class="place">
    <b-row>
      <b-col cols="6"><small>Name</small></b-col>
      <b-col cols="6"><small>Address</small></b-col>
      <b-col cols="6"
        ><p>{{ place.name }}</p></b-col
      >
      <b-col cols="6"
        ><p>{{ place.address }}</p></b-col
      >
    </b-row>
  </div>
</template>

<script>
export default {
  name: "Place",
  props: ["place"],
};
</script>

<style scoped>
.place {
  margin: 5px;
  padding: 5px;
}
</style>
