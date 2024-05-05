<script setup>
import {ref, onMounted, onBeforeMount} from "vue"
import {getAllTasks, deleteTasks, createTask} from "@/libs/FetchAPI.js"
import router from "@/router/index.js"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import FilterIcon from "@/components/icons/FilterIcon.vue"
import CreateTaskIcon from "@/components/icons/CreateTaskIcon.vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import TitleIcon from "@/components/icons/TitleIcon.vue"
import StatusIcon from "@/components/icons/StatusIcon.vue"
import AssigneesIcon from "@/components/icons/AssigneesIcon.vue"
import MoreIcon from "@/components/icons/MoreIcon.vue"
import DeleteIcon from "@/components/icons/DeleteIcon.vue"
import EditTaskIcon from "@/components/icons/EditTaskIcon.vue"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"

// const tasks = ref([])
const utilityStore = useUtilityStore()

const deleteTask = async (deleteId) => {
  try {
    const response = await deleteTasks(deleteId)
    if (response.status === 200) {
      utilityStore.tasksManager.deleteTask(deleteId)
      utilityStore.showDeleteConfirmation = false
      toast("Task has been deleted", {type: "success", timeout: 2000})
    }

    if (response.status === 404) {
      toast("An error has occurred, the task does not exist.", {
        type: "error",
        timeout: 2000,
      })
      utilityStore.showDeleteConfirmation = false

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

onBeforeMount(async () => {
  try {
    const fetchTasks = await getAllTasks()
    utilityStore.tasksManager.addTasks(fetchTasks)
    // console.log(utilityStore.tasksManager.getTasks())

    for (const task of utilityStore.tasksManager.getTasks()) {
      if (task.assignees === null || task.assignees.trim().length === 0) {
        task.assignees = "Unassigned"
      }
    }
  } catch (error) {
    console.log("Error fetching tasks : ", error)
  }
})
</script>

<template>
  <main class="w-screen h-screen overflow-y-auto bg-base p-[4rem] ">
    <div class="flex justify-between">
      <div>
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
            class="border-solid border-[1px] border-secondary px-3 py-1 rounded-lg flex items-center gap-x-2 hover:drop-shadow-2xl"
          >
            <span><CreateTaskIcon /></span>
            <button class="itbkk-button-add text-normal text-opacity-75">
              Add Task
            </button>
          </div>
        </router-link>
      </div>
    </div>

    <div class="w-full h-full pt-14">
      <table
        class="table border-collapse overscroll-y-none bg-[#FFFFFF] bg-opacity-[0.08]"
      >
        <thead
          class="bg-[#38383b] text-headline text-opacity-75 text-[16px] tracking-widest"
        >
          <tr>
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
            <th>
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
            v-for="task in utilityStore.tasksManager.getTasks()"
            :key="task.id"
            v-if="utilityStore.tasksManager.getTasks().length > 0"
          >
            <td>{{ task.id }}</td>
            <td
              class="itbkk-title tracking-wider cursor-pointer"
              @click="router.push(`/task/${task.id}`)"
            >
              {{ task.title }}
            </td>
            <td class="itbkk-assignees text-opacity-90 text-center">
              <div
                class="bg-[#1A1B1D] rounded-md px-1 py-2 tracking-wide"
                :class="
                  task.assignees === 'Unassigned'
                    ? 'italic text-gray-500'
                    : 'text-[#F99B1D]'
                "
              >
                {{ task.assignees }}
              </div>
            </td>
            <td class="itbkk-status">
              <div
                class="rounded-2xl p-2 font-semibold text-[16px] w-[8rem] text-center tracking-wide font-Inter"
                :class="utilityStore.getStatusStyle(task.status)"
              >
                {{ utilityStore.convertToStatus[task.status] }}
              </div>
            </td>
            <td>
              <div class="dropdown dropdown-bottom">
                <div
                  tabindex="0"
                  role="button"
                  class="itbkk-button-action btn bg-transparent outline-none border-none hover:bg-white hover:bg-opacity-[0.07]"
                >
                  <MoreIcon />
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content z-[1] menu shadow border-[0.5px] border-[#CCB6B6]  bg-[#18181B] rounded-box w-32"
                >
                  <li
                    class="itbkk-button-edit cursor-pointer p-1 hover:rounded-md"
                    @click="router.push(`/task/${task.id}/edit`)"
                  >
                    <span class="font-Inter"><EditTaskIcon />Edit</span>
                  </li>
                  <div class="divider m-0 h-0"></div>
                  <li
                    class="itbkk-button-delete cursor-pointer p-1 hover:rounded-md"
                    @click="confirmDeleteTask(task.id, task.title)"
                  >
                    <span class="font-Inter text-[#DB1058] text-opacity-60"
                      ><DeleteIcon />Delete</span
                    >
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
          class="itbkk-message bg-[#18181B] rounded-lg w-[30rem] h-[15rem] flex flex-col"
        >
          <h1
            class="text-[#DB1058] font-bold text-2xl text-opacity-80 flex px-10 pt-6"
          >
            Delete a Task
          </h1>
          <div class="divider m-0"></div>
          <div class="p-10 flex flex-col gap-y-6">
            <p class="text-[#ECECEC] text-opacity-75 break-all">
              Do you want to delete task "{{ utilityStore.taskTitle }}"?
            </p>
            <div class="flex justify-end">
              <button
                class="itbkk-button-cancel btn text-xs font-semibold px-[2rem] text-[#FFFFFF] bg-transparent text-opacity-70 border-none hover:bg-transparent"
                @click="utilityStore.showDeleteConfirmation = false"
              >
                Cancel
              </button>
              <button
                class="itbkk-button-confirm btn btn-outline btn-error text-xs font-bold px-[2rem] bg-[#730000] hover:bg-opacity-85 border-[##DB1058] hover:bg-[##730000] bg-opacity-[0.14] text-[#DB1058]"
                @click="deleteTask(utilityStore.selectedTaskId)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- delete confirmation -->
  </main>
</template>

<style scoped>
.slide-fwd-center {
  -webkit-animation: slide-fwd-center 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: slide-fwd-center 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* ----------------------------------------------
 * Generated by Animista on 2024-5-5 13:6:54
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

@-webkit-keyframes slide-fwd-center {
  0% {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  100% {
    -webkit-transform: translateZ(160px);
    transform: translateZ(160px);
  }
}
@keyframes slide-fwd-center {
  0% {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  100% {
    -webkit-transform: translateZ(160px);
    transform: translateZ(160px);
  }
}
</style>
