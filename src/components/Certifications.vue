<script setup>
import CertificationItem from './CertificationItem.vue';

import data from '../assets/static/cv_data.json'  
</script>

<template>
    <div class="header container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 w-200 page-break-before">
        <h1  class = "text-2xl font-bold underline underline-offset-4">Certifications</h1>
        <CertificationItem v-for="d in data.certifications" :data="d"></CertificationItem>
    </div>
</template>