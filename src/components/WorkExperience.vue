<script setup>
import WorkTenureSection from './WorkTenureSection.vue';

import data from '../assets/static/cv_data.json'  
</script>

<template>
    <div class="header container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 w-200">
        <h1>Work Experience</h1>
        <WorkTenureSection v-for="d in data.workexperience.items" :data="d"></WorkTenureSection>
    </div>
</template>