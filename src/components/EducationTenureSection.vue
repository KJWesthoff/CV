<script setup>
import { defineProps } from 'vue';

const props = defineProps(['data'])

const data = props.data

// Build a base-aware URL for credential verification documents in public/
const verifyUrl = data.verify ? import.meta.env.BASE_URL + data.verify : null




</script>

<template>
    <div class="mt-5 no-break-inside">
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

            <a
                v-if="verifyUrl"
                :href="verifyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block mt-2 text-blue-700 underline hover:text-blue-900"
            >
                Verify credentials
            </a>

        </div>

    </div>
</template>