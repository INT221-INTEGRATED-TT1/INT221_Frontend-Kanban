<script setup>
import {ref, onMounted} from "vue"
import {getTask} from "/src/libs/crud.js"
import {useRoute} from "vue-router"

// defineEmits(["closeTask"])

const task = ref([])
const closeModal = ref(true)
const defaultStatus = ref("Unassigned")
const isOpen = ref(false)
const route = useRoute()

const disableModal = () => {
  closeModal.value = !closeModal.value
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectStatus = (status) => {
  defaultStatus.value = status
  isOpen.value = false
}

onMounted(async () => {
  try {
    const fetchTask = await getTask(route.params.id)
    task.value = fetchTask

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
          <button @click="disableModal" class="text-black">
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
                    {{ defaultStatus }}
                  </div>
                  <ul
                    tabindex="0"
                    class="dropdown-content z-[1] menu p-2 shadow bg-slate-300 rounded-box w-52 cursor-pointer"
                  >
                    <li @click="selectStatus('No-Status')">No-Status</li>
                    <li @click="selectStatus('To-Do')">To-Do</li>
                    <li @click="selectStatus('In-Progress')">In-Progress</li>
                    <li @click="selectStatus('Complete')">Complete</li>
                  </ul>
                </div>
              </span>
            </h2>
            <!-- Assignees -->
            <h2 class="itbkk-assignees text-2xl font-extrabold">
              Assignees :
              <span class="font-normal text-xl"> {{ task.assignees }}</span>
            </h2>

            <!-- CreatedOn -->
            <h2 class="itbkk-timezone text-2xl font-extrabold">
              Created On :
              <span class="font-normal text-xl">{{ task.createdOn }}</span>
            </h2>

            <!-- UpdatedOn -->
            <h2 class="itbkk-timezone text-2xl font-extrabold">
              Updated On :
              <span class="font-normal text-xl">{{ task.updatedOn }}</span>
            </h2>
          </div>

          <textarea
            placeholder="No description provided"
            class="itbkk-description textarea textarea-bordered textarea-lg w-full max-w-3xl bg-slate-200"
            rows="6"
            style="resize: none"
          >{{ task.description }}</textarea>
        </div>
        <div class="flex justify-between mx-10 pt-5">
          <!-- timezone -->
          <h2 class="itbkk-timezone text-2xl font-extrabold">
            TimeZone :
            <span class="font-normal text-xl">{{ }}</span>
          </h2>

          <div class="">
            <button class="itbkk-button btn btn-success w-[4rem]">OK</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
