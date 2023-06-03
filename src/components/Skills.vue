

<script setup>

import data from '../assets/static/cv_data.json'
import SkillsBlobs from './SkillsBlobs.vue';
import { ref } from 'vue';


// change the heading according to the animation page
const page = ref(1)
function pageChange(s) {
    page.value = s
}


</script>

<template>
    <div class="header container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 w-200">

        <div>
            <div v-if="page == 0">
                <h1 class="text-lg font-bold underline underline-offset-4">Skills</h1>
                <span class = "italic">(Hover for details Click to clean it up)</span>
            </div>
            <div v-if="page == 1">
                <h1 class="text-lg font-bold underline underline-offset-4">Skills Categorized</h1>
                <span class = "italic">(Click again to show the connections)</span>
            </div>
            <div v-if="page == 2" class="flex justify-around">
                <h1 class="text-lg font-bold underline underline-offset-4">Work Timeline</h1>

                <h1 class="text-lg font-bold underline underline-offset-4">Experience</h1>
                
            </div>
        </div>
        <SkillsBlobs @page-change="(n) => pageChange(n)" :data="data"></SkillsBlobs>


    </div>
</template>