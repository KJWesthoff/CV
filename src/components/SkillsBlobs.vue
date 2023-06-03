

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

// scale for radii based on parameters above
const radiusScale = computed(() => d3.scaleSqrt().domain([1, 5]).range([minBlobRadius, maxBlobRadius]));


// Get the tailwind colors from config
const twConfig = resolveConfig(tailwindConfig)

// remove the relative color choices from the tw list
//const colorList = Object.keys(baseColors).filter(i => !['inherit', 'current', 'transparent', 'neutral','black','white','red','pink','rose','violet'].includes(i) ).reverse()
const colorList = ['blue', 'green', 'orange', 'zinc', 'red', 'rose']

// bastard variable with a list of the top keys in data (for ordial scalig etc.)
const groups = props.data.skills.map(d => d.group)
const twColor = d3.scaleOrdinal().domain(groups)
    .range(colorList);


// functon to set shading value based on item.level
const twValue = d3.scaleOrdinal().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .range([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]);


const xPos = computed(() => d3.scaleOrdinal().domain(groups).range([...Array(groups.length).keys()].map(i => (i + 1) * width.value / (groups.length + 1))))
const yPos = computed(() => d3.scaleOrdinal().domain(groups).range([...Array(groups.length).keys()].map(i => (i + 1) * height.value / (groups.length + 1))))

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
        return xPos.value(d.group)
    }))
    .force("y", d3.forceY(1).y(height.value / 2))
)

const showUpSim = computed(() => d3.forceSimulation()
    .force('charge', d3.forceManyBody().strength(-2))
    .force('collision', d3.forceCollide().radius(d => radiusScale.value(d.level) / 3))
    .force("y", d3.forceY().y(d => {
        return yPos.value(d.group)
    }))
    .force("x", d3.forceX(1).x(width.value * 2 / 3)
    ))





//initialize
onMounted(() => {
    messItUpClick()
})


// ----------------------------------
//  First page: Re-set and Throw all be blobs in
// ----------------------------------

const messItUpClick = function () {
    console.log("messItUp")
    showUpSim.value.stop()

    messUpSim.value.restart()

    // delete text, axes etc from previous
    d3.select(".y-axis").remove()
    d3.select(".yaxis-timeline-experience").remove()
    d3.selectAll(".group-text").remove()
    d3.selectAll(".group-squares").remove()
    d3.select(".bBoxes").remove()
    d3.select("g.skill-connectors").remove()

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


// ----------------------------------
// Organize the skills blobs
// ----------------------------------

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
        .attr("x", d => xPos.value(d.group))
        .attr("font-weight", 900)
        .attr("y", height.value / 6)
        .attr('transform', d => 'rotate(-50 ' + xPos.value(d.group) + ' ' + height.value / 6 + ')')

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


// ----------------------------------
// Page with y axis and bounding boxes summary
// ----------------------------------

const showUpClick = function () {
    console.log("showItUp")
    tidyUpSim.value.stop()

    // remove elements from the previous pages

    d3.selectAll(".group-text").remove()

    const icons = d3.selectAll(".icons")
        .data(data);
    const circles = d3.selectAll(".scircle")
        .data(data);



    // Add squares for background to each group
    function getbBox(group) {
        return d3.select(`g.group.${group}`).node().getBBox()
    }

    d3.select(".svg-holder")

        .append("g")
        .attr("class", "bBoxes")
        .selectAll("g.bBoxes")
        .data(props.data.skills.map(d => d.group))
        .enter()
        .append('g')
        .attr("id", d => d)
        .attr("class", "bBox")
        .append('rect')
        .attr("class", d => `group-squares ${d}`)
        .attr('x', d => getbBox(d).x)
        .attr('y', d => getbBox(d).y)
        .attr('width', d => getbBox(d).width)
        .attr('height', d => getbBox(d).height)
        .attr('rx', "5")
        .attr('ry', "5")
        .attr('fill', function (d) {
            const cName = twColor(d)
            const cValue = 300
            return twConfig.theme.colors[cName][cValue];
        })

    // put the bounding boxes back so the icons are on top
    d3.select(".bBoxes").lower()





    // Make an animation removing the blobs, keeping the icons and adding category backgrounds
    let t = d3.transition()
        .duration(2000)

    // remove the circles
    d3.selectAll(".scircle")
        .transition(t)
        .attr("r", d => 0)// radiusScale.value(d.level) / 3)


    // ----------------------------------    
    // Build a Y axis    
    // ----------------------------------

    
    // Auxillry function to parse the date string (it 55#"!)"#(#) did'nt work on ios/firefox)
    function parseDateString(dateString) {
        const parts = dateString.split(' '); // Split the date string into parts
        const monthName = parts[0]; // Extract the month name
        const year = parseInt(parts[1]); // Extract the year and convert it to a number

        // Create a date object with the month and year values
        const dateObject = new Date(`${monthName} 1, ${year}`);

        // Check if the date object is valid
        if (isNaN(dateObject.getTime())) {
            return null; // Invalid date string
        }

        // Return the epoch milliseconds
        return dateObject.getTime();
    }


    // add the work experience and education data to the axis
    const work = computed(() => props.data.workexperience.map(d => {
        return {
            "title": d.title,
            "short": d.short,
            "name": d.company.name,
            "logo": d.company.logo,
            "start": parseDateString(d.tenure.start),
            "end": parseDateString(d.tenure.end)
        }
    }))

    const education = computed(() => props.data.education.map(d => {
        return {
            "title": d.title,
            "short": d.short,
            "name": d.school,
            "logo": d.logo,
            "start": parseDateString(d.tenure.start),
            "end": parseDateString(d.tenure.end)
        }
    }))

    const certification = computed(() => props.data.certifications.map(d => {
        return {
            "title": d.name,
            "short": d.short,
            "name": d.issuer,
            "logo": d.logo,
            "start": parseDateString(d.issued),
            "end": parseDateString(d.issued)
        }
    }))

    // Setup an axis with the work/education experience
    const yaxisData = ([...work.value, ...education.value, ...certification.value])
    console.log(yaxisData)
    const yTicks = yaxisData.map(d => d.end)


    // Auxillry function to parse the date string (it 55#"!)"#(#) did'nt work on ios/firefox)
    function parseDateString(dateString) {
        const parts = dateString.split(' '); // Split the date string into parts
        const monthName = parts[0]; // Extract the month name
        const year = parseInt(parts[1]); // Extract the year and convert it to a number

        // Create a date object with the month and year values
        const dateObject = new Date(`${monthName} 1, ${year}`);

        // Check if the date object is valid
        if (isNaN(dateObject.getTime())) {
            return null; // Invalid date string
        }

        // Return the epoch milliseconds
        return dateObject.getTime();
    }


    // add the work experience on the left
    // y axis
    const scaleY = computed(() => d3.scaleLinear().domain([Math.min(...yTicks), Date.now()]).range([height.value - 10, 10]))

    const axisY = d3.axisLeft()
        .scale(scaleY.value)
        .tickSize(2, 2)
        .tickValues(yTicks)
        .tickFormat(d => {
            console.log(d, new Date(d).getFullYear())
            return new Date(d).getFullYear()

        })


    d3.select(".svg-holder").append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(15,0)")
        .style("font-size", 4)
        .style("stroke-width", 0.4)
        .call(axisY)

    const exprienceTitles = d3.select(".svg-holder")
        .append("g")
        .attr("class", "yaxis-timeline-experience")
        .selectAll("text")
        .data(yaxisData)
        .enter()
        .append("text")
        .attr("id", d => d.short)
        .text(d => d.title)
        .style("font-size", 4)
        .style("alignment-baseline", 'central')
        .attr("x", 17)
        .attr("y", d => scaleY.value(d.end))


    function drawTexts() {
        d3.selectAll(".svg-holder")
            .append("g")
            .selectAll("text")
            .data(props.data.skills)
            .enter()
            .append('text')
            .attr("class", "group-text")
            .style("font-size", 5)
            .style("text-anchor", "start")
            .text(d => d.name)
            .attr("x", d => {
                let Bbox = d3.select(`rect.group-squares.${d.group}`).node().getBBox()
                return Bbox.x + Bbox.width + 5
            })
            .attr("y", d => {
                let Bbox = d3.select(`rect.group-squares.${d.group}`).node().getBBox()
                return Bbox.y + Bbox.height / 2
            })
            .attr("font-weight", 900)
    }
    // Calculate and add links between experience ans skills bounding boxes




    // loop over each skill box and find out what it comes from
    function drawLinks() {

        let linkData = []
        for (let skill of props.data.skills) {
            for (let source of skill.linked_to) {
                let sourceBbox = d3.select(`text#${source}`).node().getBBox()
                let yaxisTextBbox = d3.select(`g.yaxis-timeline-experience`).node().getBBox()
                let sourceX = yaxisTextBbox.x + yaxisTextBbox.width + 2
                let sourceY = sourceBbox.y + sourceBbox.height / 2

                let targetBbox = d3.select(`rect.group-squares.${skill.group}`).node().getBBox()
                let targetX = targetBbox.x - 2
                let targetY = targetBbox.y + targetBbox.height / 2

                let link = {
                    "sourcePosition": [sourceX, sourceY],
                    "targetPosition": [targetX, targetY],
                    "sourceName": source,
                    "targetName": skill.group
                }


                linkData.push(link)
            }

        }
        const linkGen = d3.linkHorizontal()
            .source(d => d.sourcePosition)
            .target(d => d.targetPosition)

        const svg = d3.select(".svg-holder");

        const skillConnectors = svg.append('g')
            .attr("class", "skill-connectors");

        const lines = skillConnectors.selectAll("path")
            .data(linkData);

        lines.enter()
            .append("path")
            .attr("d", linkGen)
            .attr("fill", "none")
            .attr('stroke', function (d) {
                const cName = twColor(d.targetName);
                const cValue = 300;
                return twConfig.theme.colors[cName][cValue];
            })
            .style("stroke-width", 1);

        // Add the second line
        lines.enter()
            .append("path")
            .call(function (selection) {
                selection.attr("d", linkGen)
                    .attr("fill", "none")
                    .attr('stroke', 'black')  // Customize the color
                    .style("stroke-width", 0.2);  // Customize the stroke width
            });

    }





    // ----------------------------------    
    // Run the force sim            
    // ----------------------------------

    showUpSim.value.nodes(data).on("tick", ticked)
    showUpSim.value.alpha(1).restart()



    function ticked() {
        icons
            .attr('x', function (d) {
                return d.x - radiusScale.value(d.level) / 2;
            })
            .attr('y', function (d) {
                return d.y - radiusScale.value(d.level) / 2;
            })
            .raise()


        circles
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            })

        //calculate the updated bounding bos at each tick
        for (let c of props.data.skills) {

            let bBox = d3.select(`g.group.${c.group}`).node().getBBox()
            d3.select(`rect.group-squares.${c.group}`)
                .attr('width', bBox.width + 10)
                .attr('height', bBox.height + 10)
                .attr('x', bBox.x - 5)
                .attr('y', bBox.y - 5)



        }
        d3.select(".bBoxes").lower()

        // remove the old links and draw new  ones
        d3.select("g.skill-connectors").remove()
        drawLinks()
        d3.selectAll("text.group-text").remove()
        drawTexts()


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