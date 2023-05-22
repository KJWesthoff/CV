<script setup>
import { defineAsyncComponent } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});

// cutaway icon suffix for import statement below to work
// also - if other suffixes lig .png are to be used other logic could be implemented
const iconName = props.name.slice(0,-4)

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