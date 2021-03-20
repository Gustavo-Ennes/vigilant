<template>
  <div class="vigilant">
    <b-row>

      <b-col cols='4' lg='6'>
        <p><i class="far fa-id-badge text-secondary"></i> {{vigilant.name}}</p>
      </b-col>

      <b-col cols='4' lg='4'>
        <p><i class='fas fa-phone text-secondary'></i> {{vigilant.contact}}</p>
      </b-col>

      <b-col cols='4' lg='2' class='text-center'>
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
