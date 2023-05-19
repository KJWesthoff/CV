

<script setup>

import { onMounted } from 'vue';
import * as d3 from 'd3'
import { computed, defineProps } from 'vue'

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config'


// config paramates for "stage"
const width = 300;
const height = 200;

const minBlobRadius = 5
const maxBlobRadius = 12
const props = defineProps(['data'])

const viewBox = computed(() => {
    return `0 0 ${width} ${height}`
})

const radiusScale = computed(() => d3.scaleSqrt().domain([1, 5]).range([minBlobRadius, maxBlobRadius]));

const simulation = computed(() => d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(10))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => radiusScale.value(d.level)))
)

const simulation2 = computed(() => d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-1))
    .force("x", d3.forceX().x(d => {
       
        return xPos(d.group)
    }))
    .force("y", d3.forceY(1).y(height/2))
    //.force('collision', d3.forceCollide().radius(d => radiusScale.value(d.level)/4))
)


// Get the tailwind colors from config
const twConfig = resolveConfig(tailwindConfig)

// remove the relative color choises from the tw list
//const colorList = Object.keys(baseColors).filter(i => !['inherit', 'current', 'transparent', 'neutral','black','white','red','pink','rose','violet'].includes(i) ).reverse()
const colorList = ['green', 'blue', 'orange', 'zinc', 'slate','rose']



// bastard variable with a list of the top keys in data (for ordial scalig etc.)
const groups = props.data.map(d => d.group)


const twColor = d3.scaleOrdinal().domain(groups)
    .range(colorList);


// functon to set shading value based on item.level
const twValue = d3.scaleOrdinal().domain([1, 2, 3, 4, 5])
    .range([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]);


const xPos = d3.scaleOrdinal().domain(groups).range([...Array(groups.length).keys()].map(i => (i + 1) * width / (groups.length + 1)))

// Process the data into a flat structure
const data = props.data.reduce((a, c) => {
    const newItems = [...c.items]
    newItems.map(i => {
        i.name = c.name
        i.group = c.group
    })
    return a.concat(newItems)
}, [])


onMounted(() => {

    const icons = d3.selectAll(".icons")
        .data(data);
    const circles = d3.selectAll(".scircle")
        .data(data);


    simulation.value.nodes(data).on("tick", ticked)

    function ticked() {
        icons
            .attr('x', function (d) {
                return d.x - radiusScale.value(d.level) / 2;
            })
            .attr('y', function (d) {
                return d.y - radiusScale.value(d.level) / 2;
            })
            .attr('height', function (d) {
                return radiusScale.value(d.level);
            })
            .attr('width', function (d) {
                return radiusScale.value(d.level);
            })

        circles
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            })
            .attr('fill', function (d) {
                const cName = twColor(d.group)
                const cValue = twValue(d.level)
                return twConfig.theme.colors[cName][cValue];
            })
    }
})

const tidyUpClick = () => {
    const icons = d3.selectAll(".icons")
        .data(data);
    const circles = d3.selectAll(".scircle")
        .data(data);
    const texts = d3.selectAll(".group-text")
        .data(props.data)
        .text(d => d.name)
        .attr("x", d=>xPos(d.group))
        .attr("y", height/4)
        .style("text-anchor", "middle")
        .attr("font-size", 5)        
    

    
    simulation2.value.nodes(data).on("tick", ticked)

    function ticked() {
        icons
            .attr('x', function (d) {
                return d.x - radiusScale.value(d.level) / 2;
            })
            .attr('y', function (d) {
                return d.y - radiusScale.value(d.level) / 2;
            })


        circles
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            })

    }

}

</script>

<template>
    <button :onClick=" tidyUpClick ">Clean it up Johnny</button>
    <div id="bubbles" class="h-100">
        <svg :onClick="tidyUpClick" class="svg-holder" :viewBox="viewBox">
           <g v-for="g in props.data" :key = "g">
            <text class="group-text text-center" :id ="g">
                
            </text>    
        </g>     

            <g v-for="(d, i) in data" :key="d.title">
                <circle :name="d.title" :r="radiusScale(d.level)" class="scircle stroke-black stroke-1">

                </circle>

                <svg class="icons">
                    <icon :name=d.logo></icon>
                </svg>


            </g>
        </svg>
    </div>
</template>