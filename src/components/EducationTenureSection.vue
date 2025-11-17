<script setup>
import { defineProps } from 'vue';

const props = defineProps(['data'])

const data = props.data




</script>

<template>
    <div class="mt-5">
        <h2 class="text-2xl font-bold">{{ data.title }}</h2>
        <h4 class="flex justify between text-2xl">
            <Icon class="mr-5" :name="data.logo"></Icon>{{ data.school }}
        </h4>
        <div class="mt">
            <div>
                <h6>{{ data.tenure.start }} - {{ data.tenure.end }}</h6>
            </div>
            <ul class="list-disc" v-for="task in data.keywords">
                <li class="ml-10 mb-0">{{ task }}</li>
            </ul>

        </div>

    </div>
</template>