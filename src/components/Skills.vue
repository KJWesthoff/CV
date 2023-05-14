

<script setup>

import data from '../assets/static/cv_data.json'
import SkillsPill from './SkillsPill.vue';
import SkillsBlobs from './SkillsBlobs.vue';


const sdata = [[...data.skills.webstack] ] 


</script>

<template>
    <div class="header container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 w-200">

        <h1>Skills</h1>
        <SkillsBlobs :data ="[...data.skills.webstack, ...data.skills.programming, ...data.skills.project_management]" ></SkillsBlobs>
     
        <div class="flex flex-wrap justify-center items-cente">
            <div v-for="skill in data.skills.webstack">
                <SkillsPill class="bg-green-300" key="skill.title" :title=skill.title :logo=skill.logo></SkillsPill>
            </div>
            <div v-for="skill in data.skills.programming">
                <SkillsPill class="bg-blue-300" key="skill.title" :title=skill.title :logo=skill.logo></SkillsPill>
            </div>
        </div>
    </div>
</template>