<script setup>
import {ref, reactive, onBeforeMount, computed, onMounted} from "vue"
import router from "@/router"
import {useRoute} from "vue-router"
import {useUtilityStore} from "@/stores/useUtilityStore"
import {useStatusStyleStore} from "@/stores/useStatusStyleStore"
import {getStatus, editStatus, findCollabById} from "@/libs/FetchAPI"
import Xmark from "@/components/icons/Xmark.vue"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"
import { useUserStore } from "@/stores/useUserStore"

const userStore = useUserStore()
const utilityStore = useUtilityStore()
const statusStyleStore = useStatusStyleStore()
const route = useRoute()
const status = ref([])

const updateStatus = reactive({
  name: "",
  description: "",
  color: "",
})

const updateColor = (index) => {
  // console.log(updateStatus.color)
  updateStatus.color = statusStyleStore.presetColors[index]
  utilityStore.selectedColor = index
}

const editStatusData = async (newStatus) => {
  try {
    newStatus.description === null ? (newStatus.description = null) : ""
    const response = await editStatus(route.params.boardID, route.params.statusID, newStatus)
    if (response.status === 200) {
      utilityStore.statusManager.editStatus(route.params.statusID, newStatus)
      router.push(`/board/${route.params.boardID}/status`)
      setTimeout(() => {
        toast("The status has been edited", {
          type: "success",
          timeout: 2000,
          theme: "dark",
          transition: "flip",
          position: "bottom-right",
        })
      },200)
    } else if (response.status === 400) {
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
    console.log("Error updating status: ", error)
  }
}

const isButtonDisabled = computed(() => {
  return (
    (updateStatus.name === status.value.name &&
      updateStatus.description === status.value.description &&
      updateStatus.color === status.value.color) ||
    !updateStatus.name
  )
})

onBeforeMount(async () => {
  try {
    const fetchData = await getStatus(route.params.boardID, route.params.statusID)

    const collabIdentity = await findCollabById(route.params.boardID, userStore.userIdentity.oid)
    utilityStore.collabAccessRight = collabIdentity.accessRight
    console.log(collabIdentity.accessRight)
    collabIdentity.accessRight === 'WRITE' ? utilityStore.isOwnerBoard = true : utilityStore.isOwnerBoard = false

    utilityStore.isOwnerBoard ? console.log("owner") : console.log("not owner")
    if (!utilityStore.isOwnerBoard) {
      // router.push(`/board/${route.params.boardID}/status`).then(() => {
      //   toast(
      //     `You don't have permission to edit this board`,
      //     {
      //       type: "error",
      //       timeout: 2000,
      //       theme: "dark",
      //       transition: "flip",
      //       position: "bottom-right",
      //     })
      // })
      router.push('/error')
      return
    }
    
    status.value = fetchData
    // console.log(status.value);
    // console.log(fetchData);
    // console.log(typeof status.value.id)

    updateStatus.name = status.value.name
    updateStatus.description = status.value.description
    updateStatus.color = status.value.color
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <section
    class="fixed inset-0 flex items-center justify-center backdrop-blur-md"
  >
    <div
      class="itbkk-modal-status w-[40rem] bg-[#1F1F1F] rounded-2xl py-10 flip-in-hor-bottom"
    >
      <h1
        class="text-[12px] text-headline text-opacity-[0.43] font-bold text-center mt-5 tracking-wider"
      >
        Status Editing
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
          :class="statusStyleStore.statusCustomStyle(updateStatus.color)"
          class="flex items-center justify-center rounded-3xl px-3 w-auto h-[2.2rem] font-bold text-[16px] tracking-wider"
        >
          <span>
            {{ updateStatus.name }}
          </span>
        </div>
      </div>

      <div class="px-14 mt-7 flex flex-col">
        <!-- status name -->
        <textarea
          rows="1"
          maxlength="50"
          required
          class="itbkk-status-name resize-none w-full rounded-xl bg-[#272727] text-[#ECECEC] border-[#71717A] border-2 p-2"
          placeholder="Enter status name"
          v-model.trim="updateStatus.name"
        ></textarea>

        <!-- status description -->
        <textarea
          rows="3"
          maxlength="200"
          class="itbkk-status-description resize-none w-full rounded-xl bg-[#272727] text-[#ECECEC] border-[#71717A] border-2 p-3 my-4"
          placeholder="Enter your description"
          v-model.trim="updateStatus.description"
        ></textarea>

        <h1
          class="text-[12px] text-headline text-opacity-[0.43] font-bold text-start tracking-wider"
        >
          Colors
        </h1>
      </div>

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

      <!-- button operation -->
      <div class="flex justify-center pt-6">
        <div class="flex gap-x-3">
          <button
            @click="router.back()"
            class="itbkk-button-cancel btn border-[#DB1058] px-14 bg-opacity-35 text-[#DB1058] w-[4rem] hover:border-none bg-transparent hover:bg-base"
          >
            CANCEL
          </button>
          <button
            @click="editStatusData(updateStatus)"
            :disabled="isButtonDisabled"
            class="itbkk-button-confirm btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] border-[#007305] hover:border-none bg-transparent hover:bg-base"
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
