<script setup>
import {ref, onBeforeMount} from "vue"
import {getTask} from "@/libs/crud"
import {useRoute} from "vue-router"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import router from "@/router/index.js"
import Xmark from "@/components/icons/Xmark.vue"
import StatusIcon from "@/components/icons/StatusIcon.vue"
import AssigneesIcon from "@/components/icons/AssigneesIcon.vue"
import CreateIcon from "@/components/icons/CreateIcon.vue"
import UpdateIcon from "@/components/icons/UpdateIcon.vue"
import TimezoneIcon from "@/components/icons/TimezoneIcon.vue"

const task = ref([])
// const isOpen = ref(false)
const route = useRoute()
const utilityStore = useUtilityStore()

const getStatusStyle = (status) => {
  return {
    "bg-gray-500 p-2 text-slate-200 font-extrabold rounded-md":
      status === "NO_STATUS",
    "bg-yellow-600 p-2 text-white  font-extrabold rounded-md":
      status === "TO_DO",
    "bg-sky-500 opacity-85 p-2 text-white font-extrabold rounded-md":
      status === "DOING",
    "bg-green-500 opacity-90 p-2 text-white font-extrabold rounded-md":
      status === "DONE",
  }
}

// const toggleDropdown = () => {
//   isOpen.value = !isOpen.value
// }

const selectStatus = (status) => {
  task.value.status = utilityStore.ConvertToEnumStatus[status]
}

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

onBeforeMount(async () => {
  try {
    const fetchTask = await getTask(route.params.id)
    task.value = fetchTask

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

    // console.log(task.value.createdOn)

    // console.log(fetchTask)
    task.value.createdOn = formatDateTime(task.value.createdOn)
    task.value.updatedOn = formatDateTime(task.value.updatedOn)
  } catch (error) {
    console.log(`Error fetching task ${route.params.id}: `, error)
  }
})
</script>

<template>
  <section
    class="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
  >
    <div
      class="w-[80rem] py-5 bg-base-bg rounded-2xl border-solid border-2 border-[#b8c1ec]"
    >
      <div class="flex justify-end pr-10">
        <button @click="router.push('/task')">
          <span><Xmark /></span>
        </button>
      </div>
      <div class="flex flex-col items-center pt-5">
        <div
          class="itbkk-title text-2xl text-center text-wrapfont-bold text-headline"
        >
          {{ task.title }}
        </div>

        <!-- detail -->

        <div class="p-5 grid grid-cols-1 grid-rows-4 gap-y-5">
          <!-- Status -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-status text-xl text-header w-[10rem] flex items-center gap-x-4"
            >
              <span><StatusIcon /></span> Status
            </div>
            <div class="dropdown dropdown-right">
              <div
                tabindex="5"
                role="button"
                class="text-[14px] italic"
                :class="getStatusStyle(task.status)"
              >
                {{ utilityStore.convertToStatus[task.status] }}
              </div>
              <ul
                tabindex="0"
                class="dropdown-content z-[1] menu shadow bg-slate-300 rounded-box w-52 cursor-pointer"
              >
                <li
                  v-for="status in ['No Status', 'To Do', 'Doing', 'Done']"
                  :key="status"
                  @click="selectStatus(status)"
                  class="text-[#1c213b]"
                >
                  {{ status }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Assignees -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-assignees text-xl text-header w-[10rem] flex items-center gap-x-4"
            >
              <span><AssigneesIcon /></span> Assignees
            </div>

            <textarea
             maxlength="30"
              rows="1"
              class="rounded-md resize-none font-normal text-[14px] bg-secondary-bg textarea-xs italic w-[20rem]"
              :class="
                task.assignees === 'Unassigned'
                  ? 'italic text-gray-500'
                  : ' text-[#121629]'
              "
              >{{ task.assignees }}</textarea
            >
          </div>

          <!-- CreatedOn -->
          <div class="flex gap-x-10 items-center">
            <div
              class="text-xl text-header w-[10rem] flex items-center gap-x-4"
            >
              <span><CreateIcon /></span> Created On
            </div>
            <div
              class="itbkk-created-on font-normal text-[14px] text-normal-text"
            >
              {{ task.createdOn }}
            </div>
          </div>

          <!-- UpdatedOn -->
          <div class="flex gap-x-10 items-center">
            <div
              class="text-xl text-header w-[10rem] flex items-center gap-x-4"
            >
              <span><UpdateIcon /></span> Updated On
            </div>
            <div
              class="itbkk-updated-on font-normal text-[14px] text-normal-text"
            >
              {{ task.updatedOn }}
            </div>
          </div>
        </div>

        <!-- detail -->

        <textarea
          class="itbkk-description textarea textarea-bordered textarea-lg w-full max-w-3xl bg-secondary-bg p-8 resize-none"
          rows="6"
          placeholder="Description"
          maxlength="500"
          :class="
            task.description === 'No Description Provided'
              ? 'italic text-gray-500'
              : 'text-[#121629]'
          "
          >{{ task.description }}</textarea
        >
      </div>
      <div class="flex justify-between mx-10 pt-5 px-20">
        <!-- timezone -->
        <div
          class="itbkk-timezone text-xl font-extrabold text-header flex items-center gap-x-4"
        >
          <span><TimezoneIcon /></span>TimeZone
          <div class="font-normal text-[14px] text-normal-text">
            {{ formatTimezone() }}
          </div>
        </div>

        <div>
          <button
            @click="router.push('/')"
            class="itbkk-button btn btn-success w-[4rem] bg-button"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
