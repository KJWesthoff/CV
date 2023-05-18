

<script setup>

import { onMounted } from 'vue';
import * as d3 from 'd3'
import { computed, defineProps } from 'vue'




const width = 300;
const height = 200;

const minBlobRadius = 5
const maxBlobRadius = 15
const iconSize = minBlobRadius*2;
const props = defineProps(['data'])




const viewBox = computed(() => {
    return `0 0 ${width} ${height}`
})

const radiusScale = computed(() => d3.scaleSqrt().domain([1, 5]).range([minBlobRadius, maxBlobRadius]));

const simulation = computed(() => d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(5))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('ground', d3.forceY(height))
    .force('x', d3.forceX().x(width / 2))
    .force('collision', d3.forceCollide().radius(d => radiusScale.value(d.level)))
)




// Process the data into a flat structure
const data = props.data.reduce((a,c) => {
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
                return d.x- radiusScale.value(d.level)/2;
            })
            .attr('y', function (d) {
                return d.y- radiusScale.value(d.level)/2;
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
    }
})
</script>

<template>
         <div id="bubbles" class="h-100">
            <svg class="svg-holder" :viewBox="viewBox">
               <g v-for="(d, i) in data" :key="d.title">
                        <circle :name="d.title" :r="radiusScale(d.level)" class="scircle fill-none stroke-black stroke-1">

                        </circle>
                        
                        <svg class = "icons">
                            <icon :name=d.logo></icon>
                        </svg>
                    
                
            </g>
            </svg>
        </div>



</template>