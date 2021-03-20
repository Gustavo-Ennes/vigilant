<template>  
  <b-overlay
    :show="isLoading"
    :variant="'dark'"
    :blur="'5px'"
    :opacity="'0.9'"
  >

  <template #overlay>
    <b-row align-v="center" align-h="center">
      <b-col cols="12">
        <h5 class="text-center text-light my-5">
          {{ loadingLabel }}
        </h5>
      </b-col>
      <b-col cols="12">
        <b-icon
          class="w-100 text-center"
          icon="binoculars"
          animation="fade"
          font-scale="3"
          :variant="'light'"
          :rotate="'180'"
        ></b-icon>
      </b-col>
    </b-row>
  </template>


    <section class="customDiv">
      <b-row>
        <b-col cols="12"><h4  class="sectionTitle">Vigilants</h4></b-col>
        <b-col cols="12">
          <div v-if="vigilants">
            <div class='vigilantsWrapper' v-for="vigilant in vigilants" :key="vigilant._id">
              <Vigilant :vigilant="vigilant" />
            </div>
          </div>
          <div v-else>
            <small>There's no vigilants to show.</small>
          </div>
        </b-col>
        <b-col>
          <AddButton :type="'vigilant'" />
        </b-col>
      </b-row>
    </section>
  </b-overlay>
</template>

<script>
import Vigilant from "./Vigilant";
import AddButton from "./AddButton";

export default {
  name: "VigilantList",
  props: ["vigilants"],
  components: {
    Vigilant,
    AddButton,
  },
  computed: {
    isLoading(){
      return this.$store.state.isAComponentLoading === true && this.$store.state.loadingComponent === 'vigilant'
    },
    loadingLabel(){
      return this.$store.state.loadingLabel
    }
  },
};
</script>

<style lang='css' scoped>

</style>
