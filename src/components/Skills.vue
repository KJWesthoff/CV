

<script setup>

import data from '../assets/static/cv_data.json'
import SkillsPill from './SkillsPill.vue';
import SkillsBlobs from './SkillsBlobs.vue';


</script>

<template>
    <div class="header container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 w-200">

        <h1 class = "text-lg font-bold underline underline-offset-4">Skills</h1>
        <SkillsBlobs :data="data.skills" ></SkillsBlobs>
     
      
    </div>
</template>