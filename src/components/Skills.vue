

<script setup>
import { onMounted, watchEffect } from 'vue';
import data from '../assets/static/cv_data.json'
import SkillsPill from './SkillsPill.vue';
import * as d3 from 'd3'
import { computed } from 'vue'



const width = 300;
const height = 300;

const viewBox = computed(() => {
    return `0 0 ${width} ${height}`
})

const radiusScale = computed(() => d3.scaleSqrt().domain([1, 5]).range([5, 15]));

const simulation = computed(() => d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(5))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('ground', d3.forceY(height))
    .force('x', d3.forceX().x(width / 2))
    .force('collision', d3.forceCollide().radius(d => radiusScale.value(d.level)))
)



// svg.selectAll(".stext")
//     .attr('x', function (d) {
//         return d.x;
//     })
//     .attr('y', function (d) {
//         return d.y;
//     });





onMounted(() => {
    const baf = data.skills.software.webstack

    const circles = d3.selectAll("svg g").selectAll(".scircle")
        .data(baf);

    const logos = d3.selectAll("svg g").selectAll(".icons")
        .data(baf);

    const text = d3.selectAll("svg g").selectAll(".stext")
        .data(baf);

    simulation.value.nodes(data.skills.software.webstack).on("tick", ticked)

    function ticked() {
        circles
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            })
        logos
            .attr('x', function (d) {
                console.log("d:", d)
                return d.x;
            })
            .attr('y', function (d) {
                return d.y;
            })
        text
            .attr('x', function (d) {
                return d.x;
            })
            .attr('y', function (d) {
                return d.y;
            });
    }
})




</script>

<template>
    <div class="header container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 w-200">

        <h1>Skills</h1>

        <div>
            <h1>test</h1>
            <p>{{ radiusScale(3) }}</p>
        </div>
        <div id="bubbles" class="h-100">
            <svg class="svg-holder" :viewBox="viewBox">
                
                <g>
                    <circle v-for="(d, i) in data.skills.software.webstack" :key="d.title" :level="d.level" :name="d.title"
                        :r="radiusScale(d.level)" class="scircle fill-blue-300">
                    </circle>
                </g>
                <g>
                    <text v-for="(d, i) in data.skills.software.webstack" class="stext text-center text-s">
                        {{ d.title }}
                    </text>
                </g>
                <g>
                    <svg v-for="(d, i) in data.skills.software.webstack" class="icons" :key="d.title">
                        <icon width="10" height="10" :name=d.logo></icon>
                    </svg>

                </g>
            </svg>
        </div>



        <div class="flex flex-wrap justify-center items-cente">
            <div v-for="skill in data.skills.software.webstack">
                <SkillsPill class="bg-green-300" key="skill.title" :title=skill.title :logo=skill.logo></SkillsPill>
            </div>
            <div v-for="skill in data.skills.software.programming">
                <SkillsPill class="bg-blue-300" key="skill.title" :title=skill.title :logo=skill.logo></SkillsPill>
            </div>
        </div>
    </div>
</template>