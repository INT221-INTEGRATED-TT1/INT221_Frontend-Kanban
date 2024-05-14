<script setup>
import {ref, reactive, computed, onBeforeMount} from "vue"
import {createTask, getAllStatuses} from "@/libs/FetchAPI"
import router from "@/router"
import Xmark from "@/components/icons/Xmark.vue"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import { useStatusStyleStore } from "@/stores/useStatusStyleStore"
import DropdownIcon from "@/components/icons/DropdownIcon.vue"
import StatusDetail from "@/components/icons/StatusDetail.vue"
import AssigneeDetail from "@/components/icons/AssigneeDetail.vue"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"

const utilityStore = useUtilityStore()
const statusStyleStore = useStatusStyleStore()

const newStatus = reactive({
  id: 1,
  name: "No Status",
  description: "",
  color: "#5A5A5A",
})

const newTask = reactive({
  title: "",
  description: "",
  assignees: "",
  status: newStatus.id,
})

const selectStatus = (name, color, id) => {
  newStatus.name = name
  newStatus.color = color
  newTask.status = id
}

const isButtonDisabled = computed(() => {
  return !newTask.title || utilityStore.transactionDisable
})

const createNewTask = async () => {
  utilityStore.transactionDisable = true
  try {
    const response = await createTask(newTask)
    console.log(newTask)

    if (response.status === 201) {
      utilityStore.tasksManager.addTask(response.data)
      router.push("/task")
      utilityStore.transactionDisable = false
      setTimeout(() => {
        toast("The task has been successfully added", {
          type: "success",
          timeout: 2000,
          theme: "dark",
          transition: "flip",
          position: "bottom-right",
        })
      })
    }

    if (response.status === 400) {
      toast("Please fill in the required fields", {
        type: "error",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      })
    }
  } catch (error) {
    // toast("An error has occurred, please try again", {
    //   type: "error",
    //   timeout: 2000,
    // })
    console.log(error)
  }
}

onBeforeMount(async () => {
  try {
    const fetchStatus = await getAllStatuses()
    utilityStore.statusManager.addStatuses(fetchStatus)
  } catch {
    console.log("kuy")
  }
})
</script>

<template>
  <section
    class="fixed inset-0 flex items-center justify-center backdrop-blur-md"
  >
    <div
      class="w-[60rem] bg-[#1F1F1F] rounded-2xl px-14 py-10 transition ease-in-out"
    >
      <h1
        class="text-[12px] text-headline text-opacity-[0.43] font-bold text-center mt-5 tracking-wider"
      >
        Create Task
      </h1>
      <!-- close modal -->
      <div class="flex justify-end">
        <button @click="router.push('/task')">
          <span><Xmark /></span>
        </button>
      </div>

      <div class="flex flex-col gap-y-7">
        <!-- Title -->
        <div>
          <textarea
            class="itbkk-title bg-[#1A1B1D] rounded-xl outline-none resize-none w-full text-2xl font-semibold text-headline mt-5 p-4 pl-6"
            maxlength="100"
            placeholder="Enter Task Title"
            required
            v-model.trim="newTask.title"
          >
          </textarea>
          <span class="required flex justify-end text-xs text-normal opacity-45"
            >{{ newTask.title.length }} / 100</span
          >
        </div>

        <div class="grid grid-cols-1 grid-rows-2 gap-y-8">
          <!-- Status -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-status text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-3"
            >
              <span><StatusDetail /></span> Status
            </div>
            <div class="dropdown dropdown-right">
              <div
                tabindex="0"
                role="button"
                class="rounded-xl px-2 py-1 font-bold text-[16px] text-center tracking-wider flex items-center gap-x-3"
                :class="statusStyleStore.statusCustomStyle(newStatus.color)"
              >
                {{ newStatus.name }}
                <span><DropdownIcon /></span>
              </div>
              <div
                class="dropdown-content z-[1] menu shadow rounded-lg bg-[#3D3C3C] w-52 break-all max-h-52 overflow-y-auto cursor-pointer"
              >
                <ul tabindex="0">
                  <li
                    v-for="status in utilityStore.statusManager.getStatus()"
                    :key="status.id"
                    @click="selectStatus(status.name, status.color, status.id)"
                    :class="statusStyleStore.statusCustomStyle(status.color)"
                    class="p-1 hover:bg-[#4D4D4D] hover:text-[#D8D8D8] transition ease-in-out duration-200 rounded-md bg-transparent"
                  >
                    {{ status.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- Status -->

          <!-- Assignees -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-assignees text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4"
            >
              <span><AssigneeDetail /></span> Assignees
            </div>

            <div class="flex items-end gap-x-5">
              <textarea
                maxlength="30"
                rows="1"
                placeholder="Enter Assignees"
                v-model.trim="newTask.assignees"
                class="rounded-md bg-[#1A1B1D] text-[#F99B1D] resize-none font-normal text-[14px] text-opacity-90 textarea-xs italic w-[20rem] outline-none"
              ></textarea>
              <span class="text-xs text-normal opacity-45"
                >{{ newTask.assignees.length }} / 30</span
              >
            </div>
          </div>
          <!-- Assignees -->

          <!-- Description -->
          <div class="flex flex-col">
            <textarea
              class="itbkk-description textarea bg-[#D9D9D9] bg-opacity-5 text-normal text opacity-80 textarea-bordered w-[90%] mx-auto resize-none mt-5"
              rows="4"
              placeholder="Enter Task Description"
              v-model.trim="newTask.description"
              maxlength="500"
            ></textarea>
            <span class="text-xs text-normal opacity-45 flex justify-end pt-2"
              >{{ newTask.description.length }} / 500</span
            >
          </div>
          <!-- Description -->

          <!-- button operation -->
          <div class="flex justify-end">
            <div class="flex gap-x-3">
              <button
                @click="router.push('/')"
                class="itbkk-button-cancel btn border-[#DB1058] px-14 bg-opacity-35 text-[#DB1058] w-[4rem] hover:border-none hover:bg-opacity-30 bg-transparent"
              >
                CANCEL
              </button>
              <button
                @click="createNewTask()"
                :disabled="isButtonDisabled"
                class="itbkk-button-confirm btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem]  border-[#007305] hover:border-none bg-transparent hover:bg-base"
              >
                SAVE
              </button>
            </div>
          </div>
          <!-- button operation -->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
textarea:placeholder-shown {
  font-style: italic;
  font-weight: 300;
  font-size: medium;
}
</style>
