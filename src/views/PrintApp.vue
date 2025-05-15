<script setup>
import Header from '../components/Header.vue'
import Skills from '../components/Skills.vue'
import WorkExperience from '../components/WorkExperience.vue'
import Education from '../components/Education.vue';
import Certifications from '../components/Certifications.vue';
import AboutMe from '../components/AboutMe.vue';

</script>

<template>
  <div class="printpage ">
    <Header class='page-element' />
    <Skills class="break-after-page"></Skills>
    <WorkExperience />
    <Education></Education>
    <Certifications />
    <AboutMe />

  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #FAFAFA;
}

* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.printpage {
  width: 8.5in;
  min-height: 11in;
  padding: 0cm;
  margin: 0cm auto;
  border: 1px #D3D3D3 solid;
  border-radius: 1px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

@media print {
  @page {
    size: Letter;
    /* DIN A4 standard, Europe */
    margin: 0;
  }

  html,
  body {
    width: 8.5in;
    /* height: 297mm; */
    height: 11in;
    font-size: 11px;
    background: #FFF;
    overflow: visible;
  }

  body {
    padding-top: 0mm;
  }
}

/*
@page {
  size: Letter;
  margin: 0;
}

@media print {
  .page {
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  }
}
*/
</style>
