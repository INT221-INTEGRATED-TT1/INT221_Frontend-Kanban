<script setup>
import {ref, onBeforeMount} from "vue"
import {getTask} from "@/libs/crud"
import {useRoute} from "vue-router"
import router from "@/router/index.js"

const task = ref([])
// const isOpen = ref(false)
const route = useRoute()
const convertStatus = {
  NO_STATUS: "No Status",
  TO_DO: "To Do",
  DOING: "Doing",
  DONE: "Done",
}
const statusConvert = {
  "No Status": "NO_STATUS",
  "To Do": "TO_DO",
  "Doing": "DOING",
  "Done": "DONE",
}

// const toggleDropdown = () => {
//   isOpen.value = !isOpen.value
// }

const selectStatus = (status) => {
  task.value.status = statusConvert[status]
}

const formatTimezone = () => {
  const options = {
    timeZoneName: "long",
  }
  const formatter = new Intl.DateTimeFormat([], options)
  const {timeZone} = formatter.resolvedOptions()
  return timeZone
}

// const formattedStatus = computed(() => {
//   if (!task.value.status) {
//     return {class: "italic text-gray-500", text: "Unassigned"}
//   } else {
//     return {class: "", text: task.value.status}
//   }
// })

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
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
  />

  <section
    class="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
  >
    <div
      class="w-[80rem] py-5 bg-[#232946] rounded-2xl border-solid border-2 border-[#b8c1ec]"
    >
      <div class="flex justify-end pr-10">
        <button
          @click="router.push('/task')"
          class="text-[#eebbc3] hover:text-red-700 hover:scale-100"
        >
          <span class="material-symbols-outlined font-bold"> close </span>
        </button>
      </div>
      <div class="flex flex-col items-center">
        <div
          class="itbkk-title text-2xl text-center text-wrapfont-bold text-[#fffffe]"
        >
          {{ task.title }}
        </div>

        <!-- detail -->

        <div class="p-5 grid grid-cols-1 grid-rows-4 gap-y-5">
          <!-- Status -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-status text-xl  text-[#fffffed7] w-[10rem]"
            >
              Status
            </div>
            <div class="dropdown dropdown-right">
              <div
                tabindex="5"
                role="button"
                class="font-normal text-[14px] italic  text-[#b8c1ec] "
              >
                {{ convertStatus[task.status] }}
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
              class="itbkk-assignees text-2xl font-extrabold text-[#fffffed7] w-[10rem]"
            >
              Assignees
            </div>

            <textarea
              rows="1"
              class="rounded-md resize-none font-normal text-[14px] bg-[#b8c1ec] textarea-xs italic w-[20rem]"
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
            <div class="text-xl font-extrabold text-[#fffffed7] w-[10rem]">
              Created On
            </div>
            <div class="itbkk-created-on font-normal text-[14px] text-[#b8c1ec]">
              {{ task.createdOn }}
            </div>
          </div>

          <!-- UpdatedOn -->
          <div class="flex gap-x-10 items-center">
            <div class="text-xl font-extrabold text-[#fffffed7] w-[10rem]">
              Updated On
            </div>
            <div class="itbkk-updated-on font-normal text-[14px] text-[#b8c1ec]">
              {{ task.updatedOn }}
            </div>
          </div>
        </div>

        <!-- detail -->

        <textarea
          class="itbkk-description textarea textarea-bordered textarea-lg w-full max-w-3xl bg-[#b8c1ec] p-8 resize-none"
          rows="6"
          :class="
            task.description === 'No Description Provided'
              ? 'italic text-gray-500'
              : 'text-[#121629]'
          "
          >{{ task.description }}</textarea
        >
      </div>
      <div class="flex justify-between mx-10 pt-5">
        <!-- timezone -->
        <h2 class="itbkk-timezone text-2xl font-extrabold text-[#fffffee3]">
          TimeZone :
          <span class="font-normal text-xl text-[#b8c1ec]">{{
            formatTimezone()
          }}</span>
        </h2>

        <div>
          <button
            @click="router.push('/')"
            class="itbkk-button btn btn-success w-[4rem] bg-[#eebbc3]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
