<script setup>
import router from "@/router/index.js"
</script>

<template>
  <div class="w-screen h-screen bg-base">
    <div
      class="relative  h-full w-full flex flex-col justify-center items-center text-2xl gap-y-20"
    >
      <h1 class="text-3xl font-extrabold text-headline italic">
        Access denied, you do not have permission to view this page.
      </h1>
      <button
        @click="router.push('/')"
        class="btn text-xs font-bold px-[3rem] bg-[#007305] bg-opacity-35 text-[#13FF80]"
      >
        GO BACK HOME
      </button>
    </div>
  </div>
</template>

<style scoped></style>
