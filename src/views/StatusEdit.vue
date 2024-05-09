<script setup>
import {ref, reactive} from "vue"
import router from "@/router"
import {useUtilityStore} from "@/stores/useUtilityStore"
import Xmark from "@/components/icons/Xmark.vue"

const utilityStore = useUtilityStore()

const editStatus = reactive({
  name: "No Status",
  description: "",
  color: utilityStore.presetColors[5],
})

const updateColor = (index) => {
  console.log(editStatus.color)
  editStatus.color = utilityStore.presetColors[index]
  utilityStore.selectedColor = index
}
</script>

<template>
  <section
    class="fixed inset-0 flex items-center justify-center backdrop-blur-md"
  >
    <div
      class="itbkk-modal-status w-[40rem] bg-[#1F1F1F] rounded-2xl py-10 transition ease-in-out"
    >
      <h1
        class="text-[12px] text-headline text-opacity-[0.43] font-bold text-center mt-5 tracking-wider"
      >
        Create Status
      </h1>
      <div class="flex justify-end px-14">
        <button @click="router.back()">
          <span><Xmark /></span>
        </button>
      </div>

      <!-- preview -->
      <div
        class="w-full h-[5.5rem] mt-5 bg-[#313131] flex justify-center items-center"
      >
        <div
          :class="utilityStore.statusCustomStyle(editStatus.color)"
          class="flex items-center justify-center rounded-3xl px-3 w-auto h-[2.2rem] font-bold text-[16px] tracking-wider"
        >
          <span>
            {{ editStatus.name }}
          </span>
        </div>
      </div>

      <div class="px-14 mt-7 flex flex-col">
        <!-- status name -->
        <textarea
          rows="1"
          maxlength="50"
          required
          class="itbkk-status-name resize-none w-full rounded-xl bg-[#272727] border-[#71717A] border-2 p-2"
          placeholder="Enter status name"
          v-model.trim="editStatus.name"
        ></textarea>

        <!-- status description -->
        <textarea
          rows="3"
          maxlength="200"
          class="itbkk-status-description resize-none w-full rounded-xl bg-[#272727] border-[#71717A] border-2 p-3 my-4"
          placeholder="Enter your description"
          v-model.trim="editStatus.description"
        ></textarea>

        <h1
          class="text-[12px] text-headline text-opacity-[0.43] font-bold text-start tracking-wider"
        >
          Colors
        </h1>
      </div>

      <!-- <div class="flex flex-col justify-center"> -->
      <div
        class="grid grid-cols-6 grid-rows-2 gap-y-4 justify-items-center pt-4 px-20"
      >
        <div
          v-for="(color, index) in utilityStore.presetColors"
          :key="index"
          :style="{backgroundColor: color}"
          :class="{'opacity-50': utilityStore.selectedColor === index}"
          @click="updateColor(index)"
          class="inline-block w-[2.35rem] h-[2.35rem] rounded-xl text-transparent cursor-pointer"
        ></div>
      </div>
      <!-- </div> -->

      <!-- button operation -->
      <div class="flex justify-center pt-6">
        <div class="flex gap-x-3">
          <button
            @click="router.back()"
            class="itbkk-button-cancel btn border-[#DB1058] px-14 bg-opacity-35 text-[#DB1058] w-[4rem] bg-button"
          >
            CANCEL
          </button>
          <button
            class="itbkk-button-confirm btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] bg-button"
          >
            SAVE
          </button>
        </div>
      </div>
      <!-- button operation -->
    </div>
  </section>
</template>

<style scoped></style>
