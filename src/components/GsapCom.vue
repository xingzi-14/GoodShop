<template>
<div>{{ data.num.toFixed(1) }}</div>
</template>
<script setup>
import gsap from 'gsap';
import { reactive, watch} from 'vue';
let data=reactive({
    num :0
})
const props =defineProps({
    propval :{
        type :Number,
        default :0
    }
})
function AnimateFn(){
    gsap.to(data,{
        duration :1,
        num : props.propval
    })
}
AnimateFn();
watch(()=>props.propval,()=>AnimateFn)
</script>