<script setup>
import {ref, onBeforeMount, reactive} from "vue"
import {getTask, getAllStatuses} from "@/libs/FetchAPI.js"
import {useRoute} from "vue-router"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import { useStatusStyleStore } from "@/stores/useStatusStyleStore"
import router from "@/router/index.js"
import Xmark from "@/components/icons/Xmark.vue"
import StatusDetail from "@/components/icons/StatusDetail.vue"
import AssigneeDetail from "@/components/icons/AssigneeDetail.vue"
import CreatedDateIcon from "@/components/icons/CreatedDateIcon.vue"
import UpdatedDateIcon from "@/components/icons/UpdatedDateIcon.vue"
import TimezoneIcon from "@/components/icons/TimezoneIcon.vue"

const task = ref([])
const route = useRoute()
const utilityStore = useUtilityStore()
const statusStyleStore = useStatusStyleStore()

const formatTimezone = () => {
  const options = {
    timeZoneName: "long",
  }
  const formatter = new Intl.DateTimeFormat([], options)
  const {timeZone} = formatter.resolvedOptions()
  return timeZone
}

const statusAtt = reactive({
  name: "",
  color: "",
})

onBeforeMount(async () => {
  try {
    const fetchTask = await getTask(route.params.boardID,route.params.taskID)
    task.value = fetchTask

    statusAtt.name = task.value.statuses3.name
    statusAtt.color = task.value.statuses3.color

    if (
      task.value.description === null ||
      task.value.description.trim().length === 0
    ) {
      task.value.description = "No Description Provided"
    }
    if (
      task.value.assignees === null ||
      task.value.assignees.trim().length === 0
    ) {
      task.value.assignees = "Unassigned"
    }

    task.value.createOn = utilityStore.formatDateTime(task.value.createdOn)
    task.value.updateOn = utilityStore.formatDateTime(task.value.updated)
  } catch (error) {
    console.log(`Error fetching task ${route.params.id}: `, error)
  }
})
</script>

<template>
  <section
    class="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-md"
  >
    <div
      class="w-[60rem] bg-[#1F1F1F] rounded-2xl px-14 py-10 flip-in-hor-bottom"
    >
      <h1
        class="text-[12px] text-headline text-opacity-[0.43] font-bold text-center mt-5 tracking-widest"
      >
        Task Details
      </h1>
      <!-- close modal -->
      <div class="flex justify-end">
        <button @click="router.push(`/board/${route.params.boardID}/task`)">
          <span><Xmark /></span>
        </button>
      </div>

      <div class="flex flex-col gap-y-5">
        <div
          class="itbkk-title bg-transparent outline-none scroll resize-none w-full text-3xl font-bold text-headline mt-5 break-all"
        >
          {{ task.taskTitle }}
        </div>

        <div class="grid grid-cols-1 grid-rows-4 gap-y-4">
          <!-- Status -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-status text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-3"
            >
              <span><StatusDetail /></span> Status
            </div>
            <div>
              <div
                class="rounded-xl px-2 py-1 font-semibold font-Inter text-[14px] text-center tracking-wider flex items-center gap-x-3"
                :class="statusStyleStore.statusCustomStyle(statusAtt.color)"
              >
                {{ statusAtt.name }}
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
              readonly
              :value="task.assignees"
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
              {{ task.createOn }}
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
              {{ task.updateOn }}
            </div>
          </div>

          <!-- Description -->
          <textarea
            class="itbkk-description textarea bg-[#D9D9D9] bg-opacity-5 text-normal text opacity-80 textarea-bordered w-[90%] mx-auto resize-none mt-8"
            rows="5"
            placeholder="Description"
            maxlength="500"
            readonly
            :value="task.description"
            :class="
              task.description === 'No Description Provided'
                ? 'italic text-gray-500'
                : 'text-normal text opacity-80'
            "
          ></textarea>
          <!-- :value="task.description" -->

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
              @click="router.push(`/board/${route.params.boardID}/task`)"
              class="itbkk-button btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] border-none hover:bg-opacity-30"
            >
              OK
            </button>
          </div>
        </div>
        <!-- Button Operation -->
      </div>
    </div>
  </section>
</template>

<style scoped></style>
