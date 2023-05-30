

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

console.log(props.data)

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
const groups = props.data.skills.map(d => d.group)
const twColor = d3.scaleOrdinal().domain(groups)
    .range(colorList);


// functon to set shading value based on item.level
const twValue = d3.scaleOrdinal().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .range([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]);


const xPos = d3.scaleOrdinal().domain(groups).range([...Array(groups.length).keys()].map(i => (i + 1) * width.value / (groups.length + 1)))
const yPos = d3.scaleOrdinal().domain(groups).range([...Array(groups.length).keys()].map(i => (i + 1) * height.value / (groups.length + 1)))

// Process the data into a flat structure
const data = props.data.skills.reduce((a, c) => {
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

const showUpSim = computed(() => d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-2))
    .force('collision', d3.forceCollide().radius(d => radiusScale.value(d.level) / 3))
    .force("y", d3.forceY().y(d => {
        return yPos(d.group)
    }))
    .force("x", d3.forceX(1).x(width.value / 2)
    ))





//initialize
onMounted(() => {
    messItUpClick()
})


const messItUpClick = function () {
    console.log("messItUp")

    messUpSim.value.restart()

    // delete text, axes etc from previous
    d3.select(".y-axis").remove()
    d3.select(".yaxis-timeline-experience").remove()
    d3.selectAll(".group-text").remove()
    d3.selectAll(".group-squares").remove()
    

    // build the blobs

    const icons = d3.selectAll(".icons")
        .data(data)

    const circles = d3.selectAll(".scircle")
        .data(data)





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
            .attr('r', function (d) {
                return radiusScale.value(d.level)
            })
    }
}


const tidyUpClick = function () {
    console.log("cleanItUp")
    messUpSim.value.stop()

    const icons = d3.selectAll(".icons")
        .data(data);
    const circles = d3.selectAll(".scircle")
        .data(data);
    const texts = d3.selectAll(".svg-holder")
        .append("g")
        .selectAll("text")
        .data(props.data.skills)
        .enter()
        .append('text')
        .attr("class", "group-text")
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


const showUpClick = function () {
    console.log("showItUp")
    tidyUpSim.value.stop()

    // remove elements from the previous pages

    d3.selectAll(".group-text").remove()

    const icons = d3.selectAll(".icons")
        .data(data);
    const circles = d3.selectAll(".scircle")
        .data(data);


    // calculate y position, width and height of each group of icons
    // group the blobs bu category
   
    const categories = d3.group(d3.selectAll(".blob"))

    console.log(categories)
    const boxes = computed(()=>d3.selectAll(".webstack"))
        
    
    
    
    const bBox = computed(() => d3.selectAll("g .webstack").node().getBBox())
    
    
    // put in squares instead    
    const squares = d3.selectAll(".svg-holder")
        .append("g")
        .selectAll("rect")
        .data(props.data.skills)
        .enter()
        .append('rect')
        .attr("class", "group-squares")
        .attr('x', 1)
        .attr('y', 1)
        .attr('width', 1)
        .attr('height', 1)
        .attr('rx', "5")
        .attr('ry', "5")
        .attr('fill', function (d) {
            const cName = twColor(d.group)
            const cValue = 300
            return twConfig.theme.colors[cName][cValue];
        })
    



    showUpSim.value.nodes(data).on("tick", ticked)
    showUpSim.value.alpha(1).restart()


    // Make an animation removing the blobs, keeping the icons and adding category backgrounds
    let t = d3.transition()
        .duration(2000)

    // remove the circles
    d3.selectAll(".scircle")
        .transition(t)
        .attr("r", d => 0)// radiusScale.value(d.level) / 3)






    // add the work experience and education data to the axis

    const work = computed(() => props.data.workexperience.map(d => {
        return {
            "title": d.title,
            "name": d.company.name,
            "logo": d.company.logo,
            "start": Date.parse(d.tenure.start),
            "end": Date.parse(d.tenure.end)
        }
    }))

    const education = computed(() => props.data.education.map(d => {
        return {
            "title": d.title,
            "name": d.school,
            "logo": d.logo,
            "start": Date.parse(d.tenure.start),
            "end": Date.parse(d.tenure.end)
        }
    }))

    const certification = computed(() => props.data.certifications.map(d => {
        return {
            "title": d.name,
            "name": d.issuer,
            "logo": d.logo,
            "start": Date.parse(d.issued),
            "end": Date.parse(d.issued)
        }
    }))

    // Setup an axis with the work/education experience
    const yaxisData = ([...work.value, ...education.value, ...certification.value])

    const yTicks = yaxisData.map(d => d.start)


    // add the work experience on the left
    // y axis
    const scaleY = d3.scaleLinear().domain([Math.min(...yTicks), Date.now()]).range([height.value - 10, 10])
    const axisY = d3.axisLeft()
        .scale(scaleY)
        .tickSize(2, 2)
        .tickValues(yTicks)
        .tickFormat(d => new Date(d).getFullYear())


    d3.select(".svg-holder").append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(15,0)")
        .style("font-size", 4)
        .style("stroke-width", 0.4)
        .call(axisY)

    const exptitles = d3.select(".svg-holder")
        .append("g")
        .attr("class", "yaxis-timeline-experience")
        .selectAll("text")
        .data(yaxisData)
        .enter()
        .append("text")
        .text(d => d.title)
        .style("font-size", 4)
        .style("alignment-baseline", 'central')
        .attr("x", 17)
        .attr("y", d => scaleY(d.start))





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
        
        
        squares
            .attr('width', bBox.value.width)
            .attr('height', bBox.value.height)
            .attr('x', bBox.value.x)
            .attr('y', bBox.value.y)

    }

   

}




// toggle the different states of the animation by click in the svg

const pages = [1, 2, 3]
const page_idx = ref(0)


function toggleClick() {
    if (page_idx.value >= pages.length - 1) {
        page_idx.value = 0
    } else {
        page_idx.value++
    }
}

watch(page_idx, () => {
    if (page_idx.value == 0) {
        messItUpClick()
    }
    if (page_idx.value == 1) {
        tidyUpClick()
    }
    if (page_idx.value == 2) {
        showUpClick()
    }

})


// varibels holding the hover envents
const ttText = ref("")
const ee = ref("")



// --------------------------------------------
// Tooltips
// --------------------------------------------
onMounted(() => {
    d3.selectAll(".blob .scircle", ".icons")
        .on("mouseover", (e, i) => {


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
            
            <g v-for="g in props.data.skills" :class="'group ' + g.group" :key="g.group">
                <g v-for="(d, i) in g.items" :key="d.title">

                    <g :class="'blob ' + g.group">
                        <circle :name="d.title" :r="radiusScale(d.level)" class="scircle stroke-black stroke-1">
                        </circle>
                        <svg class="icons" pointer-events="none">
                            <Icon :name=d.logo></Icon>
                        </svg>
                    </g>
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