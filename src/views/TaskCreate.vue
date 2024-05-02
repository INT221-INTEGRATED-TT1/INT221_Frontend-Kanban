<script setup>
import router from "@/router";
import Xmark from "@/components/icons/Xmark.vue"

</script>

<template>
  <section
    class="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
  >
    <div class="w-[60rem] h-[42rem] bg-[#1F1F1F] rounded-2xl px-14 pt-10">
      <!-- close modal -->
      <div class="flex justify-end">
        <button @click="router.push('/task')">
          <span><Xmark /></span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
