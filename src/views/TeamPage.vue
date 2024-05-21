<script setup>
import GroupCode from "../components/icons/TeamPage/GroupCode.vue";
import Poom from "../components/icons/TeamPage/Avatar/Poom.vue"
import Title from "../components/icons/TeamPage/Avatar/Title.vue"
import Nat from "../components/icons/TeamPage/Avatar/Nat.vue"
import Line from "../components/icons/TeamPage/line.vue"
import Line2 from "../components/icons/TeamPage/line2.vue"
import Line3 from "../components/icons/TeamPage/line3.vue"

</script>
<template>
  <div class="w-screen h-screen flex justify-center bg-black overflow-auto">
    <div class="w-[65%] lg:w-[65%] h-full 2xl:w-[45%]">
      <div class="flex flex-row justify-between mt-[5%]">
        <div class="typewriter">
          <p class="text-5xl font-bold p-7 ">IT-BangMod Kradan Kanban</p>

        </div>
        
        <div class="p-5 ">
          <GroupCode  class="delay-[5000ms] animate-pulse" />
        </div>
      </div>
      <div class="divider"></div>
      <div class="grid grid-cols-3 grid-rows-3 h-full w-full">
        <div class="flex items-center flex-col gap-6 justify-center border border-[#454545] border-r-0 border-dashed">
          <Poom />
          <p class="font-bold">@PAPANGKORN</p>
        </div>
        <div class="relative col-span-2 border border-[#454545] overflow-hidden border-dashed p-11 flex items-center justify-center cursor-pointer">
          <p class="absolute text-7xl kalam-regular font-bold  pt-3 text-[#D5D1BD] hover:scale-95 z-10"> FrontEnd
          
          </p>
          <Line class="absolute z-10"/>  
        </div>
        <div class="flex items-center flex-col gap-6 justify-center border border-[#454545] border-r-0 border-dashed">

          <Title />
          <p class="font-bold">@AKKARAWIT</p>
        </div>
        <div class="relative flex items-center justify-center col-span-2 border border-[#454545] border-dashed p-11">
          <p class="text-7xl kalam-regular  font-bold  pt-3 text-[#D5D1BD]"> DevOps </p>
          <Line2 class="absolute z-10 mr-[15%]"/> 
        </div>
        <div class="flex items-center flex-col gap-6 justify-center border border-[#454545] border-r-0 border-dashed">

          <Nat />
          <p class="font-bold">@NATSARAN</p>
          
        </div>
        <div class="relative flex items-center justify-center text-3xl col-span-2 border border-[#454545]  border-dashed p-11">
          <p class="kalam-regular text-7xl font-bold  pt-3 text-[#D5D1BD]"> BackEnd </p>
          <Line3 class="absolute z-10 mt-28"/> 
        
        </div>
      </div>
    </div>
  </div>
</template>



<style>
.typewriter p {
  color: #fff;
  @apply font-Inter;
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  /* Gives that scrolling effect as the typing happens */
  letter-spacing: .15em; /* Adjust as needed */
  animation: 
    
    typing 1.2s ease-in  ,
    blink-caret .5s  ease-in infinite
}

/* The typing effect */
@keyframes typing {
  from { width: 0 }
  
  to { 
   
    width: 100% }
  
}


.glow {
  text-shadow: rgba(214,212,210,0.9) 0px 0px 39px;

}


</style>