<script setup>
import GroupCode from "../components/icons/TeamPage/GroupCode.vue";
import Poom from "../components/icons/TeamPage/Avatar/Poom.vue"
import Title from "../components/icons/TeamPage/Avatar/Title.vue"
import Nat from "../components/icons/TeamPage/Avatar/Nat.vue"
</script>
<template>
  <div class="w-screen h-screen flex justify-center bg-black overflow-auto">
    <div class="w-[65%] lg:w-[65%] h-full 2xl:w-[45%]">
      <div class="flex flex-row justify-between mt-[5%]">
        <p class="text-5xl font-bold p-7">IT-BangMod Kradan Kanban</p>
        <div class="p-5">
          <GroupCode />
        </div>
      </div>
      <div class="divider"></div>
      <div class="grid grid-cols-3 grid-rows-3 h-full w-full">
        <div class="flex items-center flex-col gap-6 justify-center border border-[#454545] border-r-0 border-dashed">
          <Poom />
          <p class="font-bold">@PAPANGKORN</p>
        </div>
        <div class="col-span-2 border border-[#454545] overflow-hidden border-dashed p-11 flex items-center justify-center">
          <p class="text-7xl kalam-regular font-bold  pt-3 text-[#D5D1BD]"> FrontEnd </p>
         
        </div>
        <div class="flex items-center flex-col gap-6 justify-center border border-[#454545] border-r-0 border-dashed">

          <Title />
          <p class="font-bold">@PAPANGKORN</p>
        </div>
        <div class="flex items-center justify-center col-span-2 border border-[#454545] border-dashed p-11">
          <p class="text-7xl kalam-regular  font-bold  pt-3 text-[#D5D1BD]"> DevOps </p>
        
        </div>
        <div class="flex items-center flex-col gap-6 justify-center border border-[#454545] border-r-0 border-dashed">

          <Nat />
          <p class="font-bold">@PAPANGKORN</p>
        </div>
        <div class="flex items-center justify-center text-3xl col-span-2 border border-[#454545]  border-dashed p-11">
          <p class="kalam-regular text-7xl text-3xl font-bold  pt-3 text-[#D5D1BD]"> BackEnd </p>
        
        </div>
      </div>
    </div>
  </div>
</template>



<style>
html body {
  @apply h-full;
}
</style>