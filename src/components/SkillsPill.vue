<script setup>
const skill = defineProps(["title", "logo", "level", "link", "desctiption"])
console.log("SkillData:", skill)

</script>

<template>
    <div class="flex items-center justify-center rounded-full p-2 m-1">
                <icon class="m-0" :name=skill.logo></icon>
    </div>
</template>    