<template>
    <div class="vigilant">
        <div class="row justify-content-center">
            <small class='col-6'>Name</small>
            <small class='col-6'>Contact</small>
            <div class='col-6'>{{ vigilant.name }}</div>
            <div class='col-6'>{{ vigilant.contact }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name:"Vigilant",
    props:['vigilant']        
}
</script>

<style scoped>
    .vigilant{
        margin:5px;
        padding:5px
    }
</style>