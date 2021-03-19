<template>
  <div class="vigilant">
    <b-row>

      <b-col cols='4'>
        <label >Name</label>
        <p>{{vigilant.name}}</p>
      </b-col>

      <b-col cols='4'>
        <label >Contact</label>
        <p>{{vigilant.contact}}</p>
      </b-col>

      <b-col cols='4' class='text-center'>
        <div>
          <b-row>
            <b-col>
              <i class='fas fa-pen text-secondary' v-b-tooltip.hover :title="`Edit ${vigilantFirstName}`"></i>
            </b-col>
            <b-col>
              <i 
              class='fas fa-trash text-danger' 
              v-b-tooltip.hover 
              :title="`Delete ${vigilantFirstName}`"
              @click="handleDelete"></i>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "Vigilant",
  props: ["vigilant"],
  computed:{
    vigilantFirstName(){
      return this.vigilant['name'].split(" ")[0]
    }
  },
  methods:{
    async handleDelete(){
      await this.$store.dispatch("deleteVigilant", this.vigilant._id)
    }
  }
};
</script>

<style scoped>
.vigilant {
  margin: 5px;
  padding: 5px;
}
</style>
