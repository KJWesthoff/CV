<script setup>
import EducationTenureSection from './EducationTenureSection.vue';

import data from '../assets/static/cv_data.json'  
</script>

<template>
    <div class="header container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 w-200 break-after-page">
        <h1  class = "text-2xl font-bold underline underline-offset-4">Education</h1>
        <EducationTenureSection v-for="d in data.education" :data="d"></EducationTenureSection>
    </div>
</template>