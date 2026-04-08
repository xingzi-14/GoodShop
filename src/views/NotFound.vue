<script setup>
import { useRouter } from 'vue-router';
const router =useRouter();
const goAdminIndex =()=>{
  router.push({name:'AdminIndex'})
}
</script>
<template>
    <h1>NotFound</h1>
      <el-button type="primary" @click="goAdminIndex">返回首页</el-button>

</template>
