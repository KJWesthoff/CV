<script setup>
import data from '../assets/static/cv_data.json'


</script>



<template>
    <div class="header container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 w-200">
        <h1 class="text-lg font-bold underline underline-offset-4">About Me</h1>
        <div class="mt-5">
            <div>
                <p class="font-bold">Other things i have done and what I learned</p>
                <ul class="list-disc">
                    <li class="ml-10 mb-1" v-for=" d in data.about.personal.learnings">
                        {{ d.item }} <br>
                        Taught me: <span class="italic">"{{ d.learned }}"</span>
                    </li>
                </ul>

                <p class="font-bold"> In my free time I enjoy</p>
                <ul>
                    <li class="ml-10" v-for="d in data.about.personal.interests">
                        {{ d }}
                    </li>
                </ul>


            </div>



            <!-- <div>
                <p>What others have said about me:</p>
                <ul>
                    <li v-for="d in data.about.quotes">
                        <p class="leading-3 mb-1">
                            <span class="italic text-xs">"{{ d.quote }}"</span><br>
                            <span class="text-xs">({{ d.by }})</span>
                        </p>
                    </li>
                </ul>
            </div> -->

        </div>

        <div class="text-xs flex flex-row mt-5">
            This page was built using
            <a class = "flex flex-row items-start ml-1" href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">Vue 
                <icon class="mr-1 ml-1" name="vue.svg"/>,
            </a>

            <a class = "flex flex-row items-start ml-1 mr-1" href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer"> Tailwind
                <icon class="mr-1 ml-1" name="tailwind.svg" />
            </a> and
            <a class = "flex flex-row items-start mr-1 ml-1" href="https://d3js.org/" target="_blank" rel="noopener noreferrer">D3
                <icon class="mr-1 ml-1" name="d3.svg" />
            </a> and is deployed on
            <a class = "flex flex-row items-start" href="https://kjwesthoff.github.io/CV/" target="_blank" rel="noopener noreferrer">Github Pages
                <icon class="mr-1 ml-1" name="github-mark.svg" />
                using actions
            </a>


        </div>
    </div>
        
</template>