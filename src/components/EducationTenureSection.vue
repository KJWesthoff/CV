<script setup>
import { defineProps } from 'vue';

const props = defineProps(['data'])

const data = props.data




</script>

<template>
    <div class="mt-5">
        <h2 class="text-2xl font-bold">{{ data.education.title }}</h2>
        <h4 class="flex justify between text-2xl">
            <icon class="mr-5" :name="data.education.logo"></icon>{{ data.education.school }}
        </h4>
        <div class="mt">
            <div>
                <h6>{{ data.education.tenure.start }} - {{ data.education.tenure.end }}</h6>
            </div>
            <ul class="list-disc" v-for="task in data.education.keywords">
                <li class="ml-10 mb-1">{{ task }}</li>
            </ul>

        </div>

    </div>
</template>