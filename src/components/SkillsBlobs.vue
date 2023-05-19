

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


// Get the tailwind colors from config
const twConfig = resolveConfig(tailwindConfig)
console.log(twConfig.theme.colors.green[200])
const baseColors = twConfig.theme.colors

// remove the relative color choises from the tw list
//const colorList = Object.keys(baseColors).filter(i => !['inherit', 'current', 'transparent', 'neutral','black','white','red','pink','rose','violet'].includes(i) ).reverse()
const colorList = ['green', 'indigo', 'fuchsia','zinc','blue']
console.log(colorList)


const groups = props.data.map(d => d.group)
const twColor = d3.scaleOrdinal().domain(groups)
  .range(colorList);


const twValue = d3.scaleOrdinal().domain([1,5])
  .range([50,100,200,300,400,500,600,700,800,900]);





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
            .attr('fill', function (d) {
                const cName = twColor(d.group)
                const cValue = twValue(d.level)
                return  twConfig.theme.colors[cName][cValue];
            })
    }
})
</script>

<template>
         <div id="bubbles" class="h-100">
            <svg class="svg-holder" :viewBox="viewBox">
               <g v-for="(d, i) in data" :key="d.title">
                        <circle :name="d.title" :r="radiusScale(d.level)" class="scircle stroke-black stroke-1">

                        </circle>
                        
                        <svg class = "icons">
                            <icon :name=d.logo></icon>
                        </svg>
                    
                
            </g>
            </svg>
        </div>



</template>