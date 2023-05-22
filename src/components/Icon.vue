<script setup>
import { defineAsyncComponent } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});


const iconName = props.name.slice(0,-4)
console.log(iconName)


const icon = defineAsyncComponent(() =>
   
   import(`../assets/static/svg/${iconName}.svg`)
   
);
</script>

<template>
    
    <component :is="icon" class="fill-current" />
    
</template>

<style scoped>
    .fill-current {
       width: 1em;
       color: inherit;
    }
</style>