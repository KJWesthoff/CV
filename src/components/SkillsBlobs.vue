

<script setup>

import { onMounted, ref, watch } from 'vue';
import * as d3 from 'd3'
import { computed, defineProps } from 'vue'

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config'


// config paramates for man svg "stage"
const width = ref(300);
const height = ref(180);

const minBlobRadius = 4
const maxBlobRadius = 12
const props = defineProps(['data'])

// make the view box dynamic
const viewBox = computed(() => {
    return `0 0 ${width.value} ${height.value}`
})

// scale for radii based on paramters above
const radiusScale = computed(() => d3.scaleSqrt().domain([1, 5]).range([minBlobRadius, maxBlobRadius]));

// Get the tailwind colors from config
const twConfig = resolveConfig(tailwindConfig)

// remove the relative color choises from the tw list
//const colorList = Object.keys(baseColors).filter(i => !['inherit', 'current', 'transparent', 'neutral','black','white','red','pink','rose','violet'].includes(i) ).reverse()
const colorList = ['green', 'blue', 'orange', 'zinc', 'slate', 'rose']



// bastard variable with a list of the top keys in data (for ordial scalig etc.)
const groups = props.data.map(d => d.group)


const twColor = d3.scaleOrdinal().domain(groups)
    .range(colorList);


// functon to set shading value based on item.level
const twValue = d3.scaleOrdinal().domain([1, 2, 3, 4, 5])
    .range([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]);


const xPos = d3.scaleOrdinal().domain(groups).range([...Array(groups.length).keys()].map(i => (i + 1) * width.value / (groups.length + 1)))

// Process the data into a flat structure
const data = props.data.reduce((a, c) => {
    const newItems = [...c.items]
    newItems.map(i => {
        i.name = c.name
        i.group = c.group
    })
    return a.concat(newItems)
}, [])


// Force Simulations defining where the blobs go..
const messUpSim = computed(() => d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(10))
    .force('center', d3.forceCenter(width.value / 2, height.value / 2))
    .force('collision', d3.forceCollide().radius(d => radiusScale.value(d.level)))
)

const tidyUpSim = computed(() => d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-4))
    .force("x", d3.forceX().x(d => {
        return xPos(d.group)
    }))
    .force("y", d3.forceY(1).y(height.value / 2))
)

//initialize
onMounted(() => {
    messItuUpClick()
})

//helperfunction to measure text
function update(data) {
    d3.selectAll(".group-text")
        .join(data)
        .each(function (d) { d.bbox = this.getBBox(); });
}


const messItuUpClick = function () {

    messUpSim.value.restart()
    const icons = d3.selectAll(".icons")
        .data(data);
    const circles = d3.selectAll(".scircle")
        .data(data);
    // delete the texts
    d3.selectAll(".group-text")
        .data(props.data)
        .text(d => "")

    d3.selectAll(".group-rect").remove()


    messUpSim.value.nodes(data).on("tick", ticked)
    messUpSim.value.alpha(1).restart()

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
}


const tidyUpClick = function () {
    messUpSim.value.stop()
    const icons = d3.selectAll(".icons")
        .data(data);
    const circles = d3.selectAll(".scircle")
        .data(data);
    const texts = d3.selectAll(".group-text")
        .data(props.data)
        .style("font-size", 5)
        .style("text-anchor", "middle")
        .text(d => d.name)
        .attr("x", d => xPos(d.group))
        .attr("font-weight", 900)
        .attr("y", height.value / 6)
        .attr('transform', d => 'rotate(-50 ' + xPos(d.group) + ' ' + height.value / 6 + ')')






    tidyUpSim.value.nodes(data).on("tick", ticked)
    tidyUpSim.value.alpha(1).restart()
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


// toggle the different states of the animation by click in the svg
const messedUp = ref(true)

function toggleClick() { messedUp.value = !messedUp.value }
watch(messedUp, () => {
    if (messedUp.value) {
        messItuUpClick()
    } else {
        tidyUpClick()
    }
})

const ttText = ref("")
const ee = ref("")

// Tooltips
onMounted(() => {
    d3.selectAll(".blob .scircle", ".icons")
        .on("mouseover", (e, i) => {
            
            console.log(d3.pointer(e), e.offsetY)
            tooltipHolder.attr("class", "visible")
            ee.value = e 

            ttText.value = i
        })

        .on("mouseout", (e, i) => {
            tooltipHolder.attr("class", "invisible")
        })


    const tooltip = d3.select('.tooltip')
        .style('opacity', 0);

    const tooltipText = d3.select('.tooltip_text')
    const tooltipHolder = d3.select("#tooltip-holder")

})


</script>

<template>
    <div id="bubbles" class="h-100">
        <svg :onClick="toggleClick" class="svg-holder" :viewBox="viewBox">
            <g>
                <text v-for="g in props.data" :key="g" class="group-text text-center font-sm" :id="g.group">
                </text>
            </g>
            <g v-for="(d, i) in data" :key="d.title">

                <g class="blob">
                    <circle :name="d.title" :r="radiusScale(d.level)" class="scircle stroke-black stroke-1">
                    </circle>
                    <svg class="icons" pointer-events="none">
                        <Icon :name=d.logo></Icon>
                    </svg>
                </g>
            </g>



        </svg>

        <div id="tooltip-holder" class="invisible">
            <div class="tooltipModal absolute bg-white p-2 rounded-md opacity-90 max-w-md"
                :style="'top:' + ee.pageY + 'px' + '; left:' + ee.pageX + 'px'">
                <h4 class="underline underline-offset-4 text-xl font-bold text-sm">{{ ttText.title }}</h4>
                <p class="italic">{{ ttText.description }}</p>
            </div>
        </div>


    </div>
</template>