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
.Card {
  display: flex;
  gap: 20px;
  padding: 0 10px;
  margin-top: 10px;
}

.homeIndex {
  height: calc(100vh - 120px);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 16px 10px 20px 10px;
  background-color: #f0f2f5;
}
</style>