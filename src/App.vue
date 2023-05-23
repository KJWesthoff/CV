<script setup>
import Header from './components/Header.vue'
import Skills from './components/Skills.vue'
import WorkExperience from './components/WorkExperience.vue'
import Education from './components/Education.vue';
import Certifications from './components/Certifications.vue';
import AboutMe from './components/AboutMe.vue';

</script>

<template>
  <Header/>
  <Skills class="break-after-page"></Skills>  
  <WorkExperience/>
  <Education class="break-before-page"></Education>
  <Certifications/>
  <AboutMe/>
</template>
