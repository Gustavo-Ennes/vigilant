<template>
  <div class="place">
    <b-row>
      <b-col cols='4'>
        <label >Name</label>
        <p>{{place.name}}</p>
      </b-col>

      <b-col cols='4'>
        <label >Address</label>
        <p>{{place.address}}</p>
      </b-col>

      <b-col cols='4' class='text-center'>
        <div>
          <b-row>
            <b-col>
              <i class='fas fa-pen text-secondary' v-b-tooltip.hover :title="`Edit this place`"></i>
            </b-col>
            <b-col>
              <i 
              class='fas fa-trash text-danger' 
              v-b-tooltip.hover
              :title="`Delete this place`"
              @click="deletePlace"></i>
            </b-col>
          </b-row>
        </div>
      </b-col>

    </b-row>
  </div>
</template>

<script>
export default {
  name: "Place",
  props: ["place"],
  methods: {
    async deletePlace(){
      await this.$store.dispatch('deletePlace', this.place._id)
    }
  }
};
</script>

<style scoped>
.place {
  padding: none !important;
}
</style>
