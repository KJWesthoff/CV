<script setup>
import { defineProps } from 'vue';

const props = defineProps(['data'])

const data = props.data




</script>

<template>
    <div class="mt-5">
        <h2 class="text-2xl font-bold">{{ data.title }}</h2>
        <h4 class="flex justify between text-2xl">
            <icon class="mr-5" :name="data.company.logo"></icon>{{ data.company.name }}
        </h4>
        <p class="italic">{{ data.company.description }}</p>

        <div class="mt">
            <div>
                <h6>{{ data.company.location }}</h6>

                <h6>{{ data.tenure.start }} - {{ data.tenure.end }}</h6>


            </div>
            <ul class="list-disc" v-for="task in data.tasks">
                <li class="ml-10 mb-1">{{ task }}</li>
            </ul>
            <ul class="list-disc" v-for="task in data.learnings">
                <li class="ml-10 mb-1"> {{ task }}</li>
            </ul>

        </div>

    </div>
</template>