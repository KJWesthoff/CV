<script setup>
import { defineAsyncComponent } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});

const icon = defineAsyncComponent(() =>
   import(`CV/public/assets/svg/${props.name}`)
   
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