

<script setup>
import { onMounted } from 'vue';
import data from '../assets/static/cv_data.json'
import SkillsPill from './SkillsPill.vue';
import * as d3 from 'd3'
import { computed } from 'vue'



const width = 300;
const height = 300;

const viewBox = computed(() => {
    return `0 0 ${width} ${height}`
})

const radtest = computed(()=>{
    return d3.scaleSqrt().domain([1, 5]).range([5, 15]);
})

// const radiusScale = computed(()=>{
//     return d3.scaleSqrt().domain([1, 5]).range([5, 15]);
// })    
// const circles = computed(()=> {
//     return svg.selectAll(".scircle")
//         .data(data.skills.software.webstack)
//         .enter()
//         .append("circle")
//         .attr("r", d => radiusScale(d.level))
//         .attr("class", "scircle fill-blue-300")

const radiusScale = d3.scaleSqrt().domain([1, 5]).range([5, 15]);

const simulation = computed(() => {
    return d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('ground', d3.forceY(height))
        .force('x', d3.forceX().x(width / 2))
        .force('collision', d3.forceCollide().radius(d => radiusScale(d.level)))
        .on('tick', ticked2)

}) 
//}) 

onMounted(() => {
    //const width = 900;
    //const height = 300;
    
        //.attr("width", width)
        //.attr("height", height)
        //.append("g")

    const svg = d3.select("svg g")

    const circles = svg.selectAll(".scircle")
        .data(data.skills.software.webstack)
        .enter()
        .append("circle")
        .attr("r", d => radiusScale(d.level))
        .attr("class", "scircle fill-blue-300")


    

    const text = svg.selectAll(".stext")
        .data(data.skills.software.webstack)
        .enter()
        .append("text")
        .attr("class", "stext text-center text-xs")
        .text(d => d.title)
        .append("icon")
        .attr("name", d => d.logo)



    const simulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('ground', d3.forceY(height))
        .force('x', d3.forceX().x(width / 2))
        .force('collision', d3.forceCollide().radius(d => radiusScale(d.level)))
        .on('tick', ticked2);



    simulation.nodes(data.skills.software.webstack).on("tick", ticked2)


    function ticked2() {
        svg.selectAll(".scircle")
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });
        svg.selectAll(".stext")
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
                    <circle class ="scircle"></circle>
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