<script setup>
import router from "@/router/index.js"
</script>

<template>
  <div class="w-screen h-screen bg-[#eaeaea]">
    <div
      class="h-full w-full flex flex-col justify-center items-center text-2xl text-gray-500 gap-y-5"
    >
      <h1 class="text-3xl font-bold text-slate-600 italic">
        The requested task does not exist
      </h1>
      <button @click="router.back()" class="btn btn-error">Back</button>
    </div>
  </div>
</template>

<style scoped></style>
