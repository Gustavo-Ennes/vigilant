<template>
    <section class='customDiv'>
        <b-row>
            <b-col cols='12'><h1>Vigilants</h1></b-col>
            <b-col cols='12'>
                <div v-if="vigilants">
                    <div v-for="vigilant in vigilants" :key="vigilant._id" >
                        <Vigilant :vigilant="vigilant"/>
                    </div> 
                </div>
                <div v-else>
                    <small>There's no vigilants to show.</small>
                </div>
            </b-col>            
        </b-row>
    </section>
</template>

<script>
import Vigilant from './Vigilant'

export default {
    name:"VigilantList",
    props:["vigilants"],
    components:{
        Vigilant
    }
}
</script>