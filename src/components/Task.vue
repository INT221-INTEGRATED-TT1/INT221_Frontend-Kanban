<script setup>
import {ref, onMounted} from "vue"
import {getAllTasks, deleteTasks} from "@/libs/FetchAPI.js"
import router from "@/router/index.js"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import FilterIcon from "@/components/icons/FilterIcon.vue"
import CreateTaskIcon from "@/components/icons/CreateTaskIcon.vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import TitleIcon from "@/components/icons/TitleIcon.vue"
import StatusIcon from "@/components/icons/StatusIcon.vue"
import AssigneesIcon from "@/components/icons/AssigneesIcon.vue"
import MoreIcon from "@/components/icons/MoreIcon.vue"

const tasks = ref([])
const utilityStore = useUtilityStore()

const deleteTask = async (deleteId) => {
  try {
    const response = await deleteTasks(deleteId)
    if (response.status === 200) {
      utilityStore.showDeleteConfirmation = false
      utilityStore.showDeleteSuccess = true
      closeToast()
      // alert("Task has been deleted")
      utilityStore.tasksManager.deleteTask(deleteId)
    }

    if (response.status === 404) {
      utilityStore.showDeleteConfirmation = false
      utilityStore.showErrorMessage = true
      closeToast
    }
  } catch (error) {
    console.log("Error deleting task : ", error)
  }
}

const confirmDeleteTask = (taskId, taskTitle) => {
  utilityStore.selectedTaskId = taskId
  utilityStore.taskTitle = taskTitle
  utilityStore.showDeleteConfirmation = true
}

const closeToast = () => {
  setTimeout(() => {
    utilityStore.showDeleteSuccess = false
    utilityStore.showErrorMessage = false
  }, 2000)
}

onMounted(async () => {
  try {
    const fetchTasks = await getAllTasks()
    utilityStore.tasksManager.addTasks(fetchTasks)
    tasks.value = utilityStore.tasksManager.getTasks()

    for (const task of utilityStore.tasksManager.getTasks()) {
      if (task.assignees === null || task.assignees.trim().length === 0) {
        task.assignees = "Unassigned"
      }
    }

    // console.log(tasks.value)
  } catch (error) {
    console.log("Error fetching tasks : ", error)
  }
})
</script>

<template>
  <main class="w-screen h-screen bg-base p-[4rem]">
    <div class="flex justify-between">
      <div class="">
        <h1 class="text-headline font-extrabold text-3xl text-opacity-70">
          IT-BangMod Kradan Kanban
        </h1>

        <div class="ml-[22rem] -rotate-[7.57deg]">
          <GroupCode />
        </div>
      </div>

      <div class="flex items-center gap-x-3 cursor-pointer">
        <span><FilterIcon /></span>
        <router-link :to="{name: 'create-task'}">
          <div
            class="border-solid border-[1px] border-secondary px-3 py-1 rounded-lg flex items-center gap-x-2"
          >
            <span><CreateTaskIcon /></span>
            <button class="itbkk-button-add text-normal text-opacity-75">
              New Task
            </button>
          </div>
        </router-link>
      </div>
    </div>

    <div class="overflow-y-scroll w-full h-full pt-14">
      <table class="table border-collapse bg-[#FFFFFF] bg-opacity-[0.08] p-5">
        <thead
          class="bg-[#38383b] text-headline text-opacity-75 text-[16px] tracking-widest"
        >
          <tr class="">
            <th class="rounded-tl-xl"></th>
            <th class="flex gap-x-3 items-center">
              <span><TitleIcon /></span>
              Title
            </th>
            <th>
              <div class="flex gap-x-3">
                <span><AssigneesIcon /></span>Assignees
              </div>
            </th>
            <th class="">
              <div class="flex gap-x-3">
                <span><StatusIcon /></span>Status
              </div>
            </th>
            <th class="rounded-tr-xl"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="itbkk-item"
            v-for="task in tasks"
            v-if="tasks.length > 0"
            :key="task.id"
          >
            <td>{{ task.id }}</td>
            <td
              class="itbkk-title tracking-wider cursor-pointer"
              @click="router.push(`/task/${task.id}`)"
            >
              {{ task.title }}
            </td>
            <td
              class="itbkk-assignees text-opacity-90 text-center"
              :class="
                task.assignees === 'Unassigned'
                  ? 'italic text-gray-500'
                  : 'text-[#F99B1D]'
              "
            >
              <div class="bg-[#1A1B1D] rounded-md px-1 py-2 tracking-wide">
                {{ task.assignees }}
              </div>
            </td>
            <td class="itbkk-status">
              <div
                class="rounded-xl p-2 font-bold text-[16px] text-center tracking-wider"
                :class="utilityStore.getStatusStyle(task.status)"
              >
                {{ utilityStore.convertToStatus[task.status] }}
              </div>
            </td>
            <td class="text-center">
              <div class="dropdown dropdown-top">
                <div tabindex="0" role="button" class="itbkk-button-action btn">
                  <MoreIcon />
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-20"
                >
                  <li
                    class="itbkk-button-edit cursor-pointer hover:text-blue-500"
                    @click="router.push(`/task/${task.id}/edit`)"
                  >
                    Edit
                  </li>
                  <li
                    class="itbkk-button-delete cursor-pointer mt-2 hover:rounded-xl hover:bg-[#ec3c3c] hover:bg-opacity-35 text-[#ff3939]"
                    @click="confirmDeleteTask(task.id, task.title)"
                  >
                    Delete
                  </li>
                </ul>
              </div>
            </td>
          </tr>

          <tr v-else>
            <td
              colspan="4"
              class="text-center font-bold text-xl text-headline text-opacity-50"
            >
              No Task
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <router-view></router-view>

    <!-- delete confirmation -->
    <div>
      <div
        class="fixed inset-0 backdrop-blur-md flex justify-center items-center"
        v-if="utilityStore.showDeleteConfirmation"
      >
        <div
          class="itbkk-message bg-[#1F1F1F] rounded-lg p-10 w-[30rem] h-[15rem] flex flex-col items-center gap-y-5"
        >
          <h1 class="text-headline font-bold text-2xl text-opacity-75">
            Delete a Task
          </h1>
          <p class="text-normal text-opacity-75">
            Do you want to delete task "{{ utilityStore.taskTitle }}"?
          </p>
          <div class="flex gap-x-5">
            <button
              class="itbkk-button-cancel btn text-xs font-bold px-[3rem] bg-[#ec3c3c] bg-opacity-35 text-[#ff3939]"
              @click="utilityStore.showDeleteConfirmation = false"
            >
              Cancel
            </button>
            <button
              class="itbkk-button-confirm btn text-xs font-bold px-[3rem] bg-[#007305] bg-opacity-35 text-[#13FF80]"
              @click="deleteTask(utilityStore.selectedTaskId)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- delete confirmation -->

    <!-- toast -->
    <div v-if="utilityStore.showDeleteSuccess" class="toast">
      <div class="alert alert-success">
        <span>The task has been deleted</span>
      </div>
    </div>

    <div v-if="utilityStore.showErrorMessage" class="toast">
      <div class="alert alert-error">
        <span>An error has occurred, the task does not exist.</span>
      </div>
    </div>

    <!-- toast -->
  </main>
</template>

<style scoped></style>
