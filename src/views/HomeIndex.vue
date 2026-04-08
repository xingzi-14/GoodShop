<template>
    <div class="homeIndex">
        <HomeIndexNav/>
        <Card />
        <div class="Card">
        <Echart/>
        <Goods />  
        </div>

    </div>
</template>
<script setup>
import Card from '../components/Card.vue';
import Echart from '../components/Echart.vue';
import Goods from '../components/Goods.vue';
import HomeIndexNav from '../components/HomeIndexNav.vue';
</script>
<style>
.Card{
    display: flex;
    gap: 150px;
}
.homeIndex{
    height: 750px;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>