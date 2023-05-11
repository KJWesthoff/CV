<script setup>
import data from '../assets/static/cv_data.json'  

</script>

<template>
  <div class="header container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 w-200">

    <div class="flex justify-between align-bottom mb-5 items-end">

      <div>
        <h1 class="text-3xl font-bold">{{data.about.name}}</h1>
        <h4>Engineer</h4>
      </div>

      
      <div class="text-right items-end">
          <div class="flex items-center"><icon name = "phone.svg" class="items-center mr-2"></icon>{{data.about.phone}}</div>
          <div class="flex items-center"><icon name = "email.svg" class="items-center mr-2"></icon>{{data.about.email}}</div>
      </div>
    
    </div>

    <div class="about">
      <p>{{data.about.summary}}</p>
    </div>
  </div>
</template>


