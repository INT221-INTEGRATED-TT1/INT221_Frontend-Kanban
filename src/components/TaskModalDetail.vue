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

    if (!task.value.description || task.value.description.trim().length === 0) {
      task.value.description = "No Description Provided"
    }
    if (!task.value.assignees || task.value.assignees.trim().length === 0) {
      task.value.assignees = "Unassigned"
    }

    console.log(fetchTask)
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
    <div class="max-sm:overflow-y-scroll w-3/4  py-10 p-10 bg-[#b8c1ec] rounded-md">
      <div class="flex justify-end pr-10 pt-5">
        <button @click="router.push('/task')" class="text-black">
          <span class="material-symbols-outlined"> close </span>
        </button>
      </div>
      <div class="flex flex-col items-center gap-y-5">
        <div
          class="itbkk-title w-full text-2xl font-bold text-[#5c5c5c] pt-4 text-center"
        >
          {{ task.title }}
        </div>

        <div class="text-[#5c5c5c] flex flex-col w-3/4">
          <!-- Status -->
          <h2 class="itbkk-status text-2xl font-extrabold">
            Status :
            <span>
              <div class="dropdown dropdown-right">
                <div
                  tabindex="0"
                  role="button"
                  class="font-normal italic text-gray-500"
                >
                  {{ convertStatus[task.status] }}
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content z-[1] menu p-2 shadow bg-slate-300 rounded-box w-52 cursor-pointer"
                >
                  <li
                    v-for="status in ['No Status', 'To Do', 'Doing', 'Done']"
                    :key="status"
                    @click="selectStatus(status)"
                  >
                    {{ status }}
                  </li>
                </ul>
              </div>
            </span>
          </h2>
          <!-- Assignees -->
          <h2 class="itbkk-assignees text-2xl font-extrabold">
            Assignees :
            <span
              class="font-normal text-xl"
              :class="
                task.assignees === 'Unassigned' ? 'italic text-gray-500' : ''
              "
            >
              <textarea
                rows="1"
                class="rounded-md resize-none bg-slate-200 textarea-xs"
                >{{ task.assignees }}</textarea
              >
            </span>
          </h2>

          <!-- CreatedOn -->
          <h2 class="itbkk-created-on text-2xl font-extrabold">
            Created On :
            <span class="font-normal text-xl">{{ task.createdOn }}</span>
          </h2>

          <!-- UpdatedOn -->
          <h2 class="itbkk-updated-on text-2xl font-extrabold">
            Updated On :
            <span class="font-normal text-xl">{{ task.updatedOn }}</span>
          </h2>
        </div>

        <textarea
          class="itbkk-description textarea textarea-bordered textarea-lg w-full max-w-3xl bg-slate-200 p-8 resize-none"
          rows="6"
          :class="
            task.description === 'No Description Provided'
              ? 'italic text-gray-500'
              : ''
          "
          >{{ task.description }}</textarea
        >
      </div>
      <div class="flex justify-between mx-10 pt-5">
        <!-- timezone -->
        <h2 class="itbkk-timezone text-2xl font-extrabold text-[#5c5c5c]">
          TimeZone :
          <span class="font-normal text-xl">{{ formatTimezone() }}</span>
        </h2>

        <div>
          <button
            @click="router.push('/')"
            class="itbkk-button btn btn-success w-[4rem]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
