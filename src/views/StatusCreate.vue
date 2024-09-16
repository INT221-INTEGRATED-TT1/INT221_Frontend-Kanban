<script setup>
import {ref, reactive, watch, computed} from "vue"
import {useUtilityStore} from "@/stores/useUtilityStore"
import { useStatusStyleStore } from "@/stores/useStatusStyleStore"
import {createStatus3} from "@/libs/FetchAPI"
import router from "@/router"
import {useRoute} from "vue-router"
import Xmark from "@/components/icons/Xmark.vue"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"

const utilityStore = useUtilityStore()
const statusStyleStore = useStatusStyleStore()
const route = useRoute()

const newStatus = reactive({
  name: "",
  description: "",
  color: statusStyleStore.presetColors[5],
  limitMaximumTask: 0
})

const updateColor = (index) => {
  // console.log(newStatus.color)
  newStatus.color = statusStyleStore.presetColors[index]
  utilityStore.selectedColor = index
}

const isButtonDisabled = computed(() => {
  return !newStatus.name || utilityStore.transactionDisable
})

const createNewStatus = async () => {
  utilityStore.transactionDisable = true
  try {
    const response = await createStatus3(route.params.boardID ,newStatus)
    // console.log(response.data)
    if (response.status === 201) {
      // console.log(newStatus)
      utilityStore.statusManager.addStatus(response.data)
      router.push(`/board/${route.params.boardID}/status`)
      utilityStore.transactionDisable = false

      setTimeout(() => {
        toast("The status has been  added", {
          type: "success",
          timeout: 2000,
          theme: "dark",
          transition: "flip",
          position: "bottom-right",
        })
      })
    } else if (response.status === 500 || response.status === 400) {
      utilityStore.transactionDisable = false
      setTimeout(() => {
        toast("An error has occurred, the status could not be added.", {
          type: "error",
          timeout: 2000,
          theme: "dark",
          transition: "flip",
          position: "bottom-right",
        })
      })
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <section
    class="itbkk-modal-task fixed inset-0 flex items-center justify-center backdrop-blur-md"
  >
    <div
      class="w-[40rem] bg-[#1F1F1F] rounded-2xl py-10 transition ease-in-out"
    >
      <h1
        class="text-[12px] text-headline text-opacity-[0.43] font-bold text-center mt-5 tracking-wider"
      >
        Create Status
      </h1>
      <div class="flex justify-end px-14">
        <button @click="router.push(`/board/${route.params.boardID}/status`)">
          <span><Xmark /></span>
        </button>
      </div>

      <!-- preview -->
      <div
        class="w-full h-[5.5rem] mt-5 bg-[#313131] flex justify-center items-center"
      >
        <div
          :class="statusStyleStore.statusCustomStyle(newStatus.color)"
          class="flex items-center justify-center rounded-3xl min-w-20 px-3 h-[2.2rem] font-bold text-[16px] tracking-wider"
        >
          <span>
            {{ newStatus.name }}
          </span>
        </div>
      </div>

      <div class="px-14 mt-7 flex flex-col">
        <!-- status name -->
        <div>
          <textarea
            rows="1"
            maxlength="50"
            required
            class="itbkk-status-name resize-none w-full rounded-xl bg-[#272727] text-[#ECECEC] border-[#71717A] border-2 p-2"
            placeholder="Enter status name"
            v-model.trim="newStatus.name"
          ></textarea>
          <span class="flex justify-end text-xs text-normal opacity-45 required"
            >{{ newStatus.name.length }} / 50</span
          >
        </div>

        <!-- status description -->
        <div class="my-4">
          <textarea
            rows="3"
            maxlength="200"
            class="itbkk-status-description resize-none w-full rounded-xl bg-[#272727] text-[#ECECEC] border-[#71717A] border-2 p-3"
            placeholder="Enter your description"
            v-model.trim="newStatus.description"
          ></textarea>
          <span class="flex justify-end text-xs text-normal opacity-45"
            >{{ newStatus.description.length }} / 200</span
          >
        </div>

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
          v-for="(color, index) in statusStyleStore.presetColors"
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
            @click="router.push(`/board/${route.params.boardID}/status`)"
            class="itbkk-button-cancel btn border-[#DB1058] px-14 bg-opacity-35 text-[#DB1058] w-[4rem] hover:border-none bg-transparent hover:bg-base"
          >
            CANCEL
          </button>
          <button
            @click="createNewStatus()"
            class="itbkk-button-confirm btn px-14 border-[#007305] bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] hover:border-none bg-transparent hover:bg-base"
            :disabled="isButtonDisabled"
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
