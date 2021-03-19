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
          font-scale="4"
          :variant="'light'"
          :rotate="'180'"
        ></b-icon>
      </b-col>
    </b-row>
  </template>



    <section class="customDiv">
      <b-row align-h="center">
        <b-col cols="12" class="sectionTitle"><h4 class='py-2'>Places</h4></b-col>
        <b-col cols="12" v-if="places">
          <div v-for="place in places" :key="place._id">
            <Place :place="place" />
          </div>
        </b-col>
        <b-col>
          <AddButton :type="'place'" />
        </b-col>
      </b-row>
    </section>
  </b-overlay>
</template>

<script>
import Place from "./Place";
import AddButton from "./AddButton";

export default {
  name: "Places",
  props: ["places"],
  computed: {
    isLoading(){
      return this.$store.state.isAComponentLoading === true && this.$store.state.loadingComponent === 'place'
    },
    loadingLabel(){
      return this.$store.state.loadingLabel
    }
  },
  components: {
    Place,
    AddButton,
  },
};
</script>

<style scoped>
.placesList {
  border-radius: 15px;
  box-shadow: 1px 1px 2px rgba(22, 17, 17, 0.2);
  margin: 10px;
  padding: 10px;
}
</style>
