<script setup>
import data from '../assets/static/cv_data.json'


</script>



<template>
    <div class="header container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 w-200">
        <h1 class="text-lg font-bold underline underline-offset-4">About Me</h1>
        <div class="mt-2">
            <div>
                <p class="font-bold">Other things i have done and what i learned</p>
                <ul class="list-disc">
                    <li class="ml-10 mb-1" v-for=" d in data.about.personal.learnings">
                    {{ d.item }} <br>
                    Taught me:  <span class="italic">"{{ d.learned }}"</span>
                    </li>
                </ul>

                <p class="font-bold"> In may spare time i enjoy</p>
                <ul>
                                    <li class="ml-10" v-for ="d in data.about.personal.interests">
                    {{ d }}
                                    </li>
                                </ul>


            </div>



            <!-- <div>
                <p>What others have said about me:</p>
                <ul>
                    <li v-for="d in data.about.quotes">
                        <p class="leading-3 mb-1">
                            <span class="italic text-xs">"{{ d.quote }}"</span><br>
                            <span class="text-xs">({{ d.by }})</span>
                        </p>
                    </li>
                </ul>
            </div> -->
        </div>
    </div>
</template>