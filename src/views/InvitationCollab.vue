<script setup>
import {ref, onMounted, onBeforeMount, watch, reactive} from "vue"
import GroupCode from "@/components/icons/GroupCode.vue"
</script>
 
<template>
  <main class="w-screen h-screen overflow-y-auto bg-animation p-[8rem] pt-[4rem]">
    <!-- Team Logo -->
    <div class="flex justify-between">
      <div>
        <router-link to="/board">
          <h1 class="text-headline font-extrabold text-3xl text-opacity-70 tracking-in-expand">
            IT-BangMod Kradan Kanban
          </h1>
        </router-link>
        <div class="ml-[22rem] tracking-in-expand-2">
          <GroupCode />
        </div>
      </div>
    </div>
    <div class="flex justify-end mb-5">
      <UserSetting />
    </div>
    </main>
</template>
 
<style scoped>

</style>