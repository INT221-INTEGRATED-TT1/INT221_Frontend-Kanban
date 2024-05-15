<script setup>
import {ref, onBeforeMount, computed, reactive} from "vue"
import {getTask, editTask, getAllStatuses} from "@/libs/FetchAPI.js"
import {useRoute} from "vue-router"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import { useStatusStyleStore } from "@/stores/useStatusStyleStore"
import router from "@/router/index.js"
import Xmark from "@/components/icons/Xmark.vue"
import StatusDetail from "@/components/icons/StatusDetail.vue"
import AssigneeDetail from "@/components/icons/AssigneeDetail.vue"
import CreatedDateIcon from "@/components/icons/CreatedDateIcon.vue"
import UpdatedDateIcon from "@/components/icons/UpdatedDateIcon.vue"
import DropdownIcon from "@/components/icons/DropdownIcon.vue"
import TimezoneIcon from "@/components/icons/TimezoneIcon.vue"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"

// const text = ref('')
// let textArea = ref('')
// onMounted(() => {
//   console.log(textArea);
//   console.log(textArea.value.style.height);
//   // textArea = document.querySelector('textarea');

// });
// const resizeTextarea = () => {
//   console.log("Resize function execute");
//   textArea.value.style.height = "auto";
//   textArea.value.style.height = textArea.value.scrollHeight + "px";
// };

const task = ref({})
const route = useRoute()
const utilityStore = useUtilityStore()
const statusStyleStore = useStatusStyleStore()

const newStatus = reactive({
  id: "",
  name: "",
  description: "",
  color: "",
})

const updateTask = reactive({
  title: "",
  description: "",
  assignees: "",
  status: newStatus.id,
})

const selectStatus = (name, color, id) => {
  newStatus.name = name
  newStatus.color = color
  updateTask.status = id
}

// const isOpen = ref(false)

// const isOpen = ref(false)

// const toggleDropdown = () => {
//   // selectStatus(status)
//   isOpen.value = !isOpen.value
// }

const formatTimezone = () => {
  const options = {
    timeZoneName: "long",
  }
  const formatter = new Intl.DateTimeFormat([], options)
  const {timeZone} = formatter.resolvedOptions()
  return timeZone
}

const formatDateTime = (baseFormatDate) => {
  const date = new Date(baseFormatDate)
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }
  const formattedDate = date
    .toLocaleString("en-GB", options)
    .replace(/\//g, "/")
    .replace(",", "")

  return formattedDate
}

const editTaskData = async (newTask) => {
  try {
    const response = await editTask(route.params.id, newTask)

    if (response.status === 200) {
      utilityStore.tasksManager.editTask(route.params.id, response.data)
      router.push("/task")
      setTimeout(() => {
        toast("The task has been updated", {
          type: "success",
          timeout: 2000,
          theme: "dark",
          transition: "flip",
          position: "bottom-right",
        })
      })
    }

    if (response.status === 404) {
      toast("The task does not exist", {
        type: "error",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      })
    }
  } catch (error) {
    console.log("Error updating task: ", error)
  }
}

const isButtonDisabled = computed(() => {
  return (
    (updateTask.title === task.value.title &&
      updateTask.description === task.value.description &&
      updateTask.assignees === task.value.assignees &&
      updateTask.status === task.value.status.id) ||
    !updateTask.title
  )
})

onBeforeMount(async () => {
  try {
    const fetchTask = await getTask(route.params.id)
    task.value = fetchTask
    // console.log(task.value)
    const fetchStatus = await getAllStatuses()
    utilityStore.statusManager.addStatuses(fetchStatus)

    task.value.createdOn = formatDateTime(task.value.createdOn)
    task.value.updatedOn = formatDateTime(task.value.updatedOn)

    updateTask.title = task.value.title
    updateTask.description = task.value.description
    updateTask.assignees = task.value.assignees
    updateTask.status = task.value.status.id

    newStatus.id = task.value.status.id
    newStatus.name = task.value.status.name
    newStatus.description = task.value.status.description
    newStatus.color = task.value.status.color

    // console.log(updateTask.status.length)
  } catch (error) {
    console.log(`Error fetching task ${route.params.id}: `, error)
  }
})
</script>

<template>
  <section
    class="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-sm"
  >
    <div class="w-[60rem] bg-[#1F1F1F] rounded-2xl px-14 py-10">
      <h1
        class="text-[12px] text-headline text-opacity-[0.43] font-bold text-center mt-5 tracking-wider"
      >
        Task Editing
      </h1>
      <!-- close modal -->
      <div class="flex justify-end">
        <button @click="router.push('/task')">
          <span><Xmark /></span>
        </button>
      </div>

      <div class="flex flex-col gap-y-5">
        <textarea
          class="itbkk-title bg-transparent outline-none scroll resize-none w-full text-3xl font-bold text-headline mt-5"
          maxlength="100"
          :placeholder="task.title"
          v-model.trim="updateTask.title"
        >
        </textarea>

        <div class="grid grid-cols-1 grid-rows-4 gap-y-4">
          <!-- Status -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-status text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-3"
            >
              <span clas><StatusDetail /></span> Status
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

          <!-- Assignees -->
          <div class="flex gap-x-10 items-center">
            <div
              class="text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4"
            >
              <span><AssigneeDetail /></span> Assignees
            </div>

            <textarea
              maxlength="30"
              rows="1"
              class="itbkk-assignees rounded-md bg-[#1A1B1D] resize-none font-normal text-[14px] text-opacity-90 textarea-xs italic w-[20rem]"
              :class="
                task.assignees === 'Unassigned'
                  ? 'italic text-gray-500'
                  : ' text-[#F99B1D]'
              "
              v-model.trim="updateTask.assignees"
              placeholder="Enter assignees"
            ></textarea>
          </div>

          <!-- CreatedOn -->
          <div class="flex gap-x-10 items-center">
            <div
              class="text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4"
            >
              <span><CreatedDateIcon /></span> Created On
            </div>
            <div
              class="itbkk-created-on font-normal text-[14px] text-headline text-opacity-50 tracking-widest"
            >
              {{ task.createdOn }}
            </div>
          </div>

          <!-- UpdatedOn -->
          <div class="flex gap-x-10 items-center">
            <div
              class="text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4"
            >
              <span><UpdatedDateIcon /></span> Updated On
            </div>
            <div
              class="itbkk-updated-on font-normal text-[14px] text-headline text-opacity-50 tracking-widest"
            >
              {{ task.updatedOn }}
            </div>
          </div>

          <!-- Description -->
          <textarea
            class="itbkk-description textarea bg-[#D9D9D9] bg-opacity-5 text-normal text opacity-80 textarea-bordered w-[90%] mx-auto resize-none mt-8"
            rows="6"
            maxlength="500"
            :class="
              task.description === 'No Description Provided'
                ? 'italic text-gray-500'
                : 'text-normal text opacity-80'
            "
            v-model.trim="updateTask.description"
            placeholder="Enter description"
          ></textarea>

          <!-- <textarea style="resize: none; overflow: hidden; min-height: 100px;" @input="resizeTextarea" class="texarea textarea-bordered rounded w-full p-2" placeholder="Title" ref="textArea"></textarea> -->
        </div>

        <!-- Button Operation -->
        <div class="flex justify-between">
          <!-- timezone -->
          <div class="itbkk-timezone flex items-center gap-x-2">
            <div
              class="text-[1.1rem] font-bold text-headline text-opacity-70 flex items-center gap-x-3"
            >
              <span><TimezoneIcon /></span>TimeZone :
            </div>

            <div class="text-[1rem] text-headline text-opacity-55 pt-[3px]">
              {{ formatTimezone() }}
            </div>
          </div>

          <div class="flex gap-x-3">
            <button
              @click="router.push('/')"
              class="itbkk-button-cancel btn border-[#DB1058] px-14  bg-opacity-35 text-[#DB1058] w-[4rem] hover:border-none hover:bg-opacity-30 bg-transparent"
            >
              CANCEL
            </button>
            <button
              :disabled="isButtonDisabled"
              @click="editTaskData(updateTask)"
              class="itbkk-button-confirm btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] border-[#007305] hover:border-none bg-transparent hover:bg-base"
            >
              SAVE
            </button>
          </div>
        </div>
        <!-- Button Operation -->
      </div>
    </div>
  </section>
</template>

<style scoped></style>
