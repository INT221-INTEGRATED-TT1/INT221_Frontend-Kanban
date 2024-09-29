<script setup>
import router from "@/router/index.js"
// import AstronautNotFound from "@/components/icons/AstronautNotFound.vue"
</script>

<template>
  <div class="w-screen h-screen bg-base">
    <div
      class="relative  h-full w-full flex flex-col justify-center items-center text-2xl gap-y-20"
    >
      <h1 class="text-5xl font-extrabold text-headline italic">
        Access Denied
      </h1>
      <button
        @click="router.push('/')"
        class="btn text-xs font-bold px-[3rem] bg-[#007305] bg-opacity-35 text-[#13FF80]"
      >
        GO BACK HOME
      </button>
      <!-- <div class="absolute  right-80">
        <AstronautNotFound  />
      </div> -->
    </div>
  </div>
</template>

<style scoped></style>
