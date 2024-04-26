<script setup>
import {ref, onMounted, computed} from "vue"
import {getTask} from "/src/libs/crud.js"
import {useRoute} from "vue-router"
import router from "@/router/index.js"

const task = ref([])
// const isOpen = ref(false)
const route = useRoute()
const convertStatus = {
  NO_STATUS : "No Status",
  TO_DO : "To Do",
  DOING : "Doing",
  DONE : "Done"
}

// const toggleDropdown = () => {
//   isOpen.value = !isOpen.value
// }

const selectStatus = (status) => {
  task.value.status = convertStatus[status]
  // isOpen.value = false
}

const formatTimezone = () => {
  const options = {
    timeZoneName: "long",
  }
  const formatter = new Intl.DateTimeFormat([], options)
  const {timeZone} = formatter.resolvedOptions()
  return timeZone
}

const formattedStatus = computed(() => {
  if (!task.value.status) {
    return {class: "italic text-gray-500", text: "Unassigned"}
  } else {
    return {class: "", text: task.value.status}
  }
})

onMounted(async () => {
  try {
    const fetchTask = await getTask(route.params.id)
    task.value = fetchTask
    if (
      task.value.description === null ||
      task.value.description.trim().length === 0
    ) {
      // console.log("no desc")
      task.value.description = "No Description Provided"
    }

    if (
      task.value.assignees === null ||
      task.value.assignees.trim().length === 0
    ) {
      task.value.assignees = "Unassigned"
    }

    console.log(fetchTask)
  } catch (error) {
    console.log("Error fetching tasks : ", error)
  }
})
</script>

<template>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
  />
  <main class="w-screen h-screen bg-[#eaeaea]">
    <section
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="max-sm:overflow-y-scroll w-2/3 h-3/4 bg-white rounded-md">
        <div class="flex justify-end pr-10 pt-5">
          <button @click="router.push('/task')" class="text-black">
            <span class="material-symbols-outlined"> close </span>
          </button>
        </div>
        <div class="flex flex-col items-center gap-y-5">
          <div
            class="itbkk-title w-full text-3xl font-bold text-[#5c5c5c] pt-4 text-center"
          >
            {{ task.title }}
          </div>

          <div class="text-[#5c5c5c] flex flex-col w-3/4">
            <!-- Status -->
            <h2 class="itbkk-status text-2xl font-extrabold">
              Status :
              <span>
                <div class="dropdown dropdown-right" @click="toggleDropdown">
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
                    <!-- <li
                      v-for="status in ['No Status', 'To Do', 'Doing', 'Done']"
                      :key="status"
                      @click="selectStatus(status)"
                      :class="formattedStatus.class"
                    >
                      {{ status }}
                    </li> -->
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
                {{ task.assignees }}</span
              >
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
            class="itbkk-description textarea textarea-bordered textarea-lg w-full max-w-3xl bg-slate-200"
            rows="6"
            style="resize: none"
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
          <h2 class="itbkk-timezone text-2xl font-extrabold">
            TimeZone :
            <span class="font-normal text-xl">{{ formatTimezone() }}</span>
          </h2>

          <div class="">
            <button
              @click="router.push('/task')"
              class="itbkk-button btn btn-success w-[4rem]"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
