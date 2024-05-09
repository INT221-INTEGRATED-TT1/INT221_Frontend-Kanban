<script setup>
import {ref, reactive, watch} from "vue"
import {useUtilityStore} from "@/stores/useUtilityStore"
import router from "@/router"
import Xmark from "@/components/icons/Xmark.vue"

const utilityStore = useUtilityStore()

const presetColors = [
  "#1A9338",
  "#E79D13",
  "#0090FF",
  "#E5484D",
  "#8E4EC6",
  "#5A5A5A",
  "#12A594",
  "#E9EB87",
  "#008080",
  "#B31957",
  "#4B0082",
  "#BE6F26",
]

const newStatus = reactive({
  name: "No Status",
  description: "",
  color: presetColors[5],
})

const selectedColor = ref(null)

const updateColor = (index) => {
  console.log(newStatus.color)
  newStatus.color = presetColors[index]
  selectedColor.value = index
}
</script>

<template>
  <section
    class="fixed inset-0 flex items-center justify-center backdrop-blur-md"
  >
    <div
      class="itbkk-modal-status w-[40rem] bg-[#1F1F1F] rounded-2xl py-10 transition ease-in-out"
    >
      <div class="flex justify-end px-14">
        <button @click="router.back()">
          <span><Xmark /></span>
        </button>
      </div>

      <h1
        class="text-[12px] text-headline text-opacity-[0.43] font-bold text-center mt-5 tracking-wider"
      >
        Create Status
      </h1>

      <!-- preview -->
      <div
        class="w-full h-[5.5rem] mt-4 bg-[#313131] flex justify-center items-center"
      >
        <div
          :class="utilityStore.statusCustomStyle(newStatus.color)"
          class="flex items-center justify-center rounded-xl px-3 w-auto h-[2.5rem] font-bold text-[16px] tracking-wider"
        >
          <span>
            {{ newStatus.name }}
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
          v-model.trim="newStatus.name"
        ></textarea>

        <!-- status description -->
        <textarea
          rows="3"
          maxlength="200"
          class="itbkk-status-description resize-none w-full rounded-xl bg-[#272727] border-[#71717A] border-2 p-3 my-4"
          placeholder="Enter your description"
          v-model.trim="newStatus.description"
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
          v-for="(color, index) in presetColors"
          :key="index"
          :style="{backgroundColor: color}"
          :class="{'opacity-50': selectedColor === index}"
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
