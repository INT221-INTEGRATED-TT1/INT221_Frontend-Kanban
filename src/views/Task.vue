<script setup>
import {ref, onMounted, onBeforeMount, watch} from "vue"
import {getAllTasks, deleteTasks, getAllStatuses} from "@/libs/FetchAPI.js"
import router from "@/router/index.js"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import {useStatusStyleStore} from "@/stores/useStatusStyleStore"
import CreateTaskIcon from "@/components/icons/CreateTaskIcon.vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import MoreIcon from "@/components/icons/MoreIcon.vue"
import DeleteIcon from "@/components/icons/DeleteIcon.vue"
import EditTaskIcon from "@/components/icons/EditTaskIcon.vue"
import DeleteConfirmationTask from "@/components/DeleteConfirmationTask.vue"
import FilterCollapse from "@/components/FilterCollapse.vue"
import DropdownSortStatus from "@/components/DropdownSortStatus.vue"
import DropdownSortAssignees from "@/components/DropdownSortAssignee.vue"
import DropdownSortTitle from "@/components/DropdownSortTitle.vue"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"

const utilityStore = useUtilityStore()
const statusStyleStore = useStatusStyleStore()
// const filteredStatus = ref([])
const deleteTask = async (deleteId) => {
  try {
    // console.log(deleteId)
    const response = await deleteTasks(deleteId)
    if (response.status === 200) {
      utilityStore.tasksManager.deleteTask(deleteId)
      utilityStore.showDeleteConfirmation = false
      toast("Task has been deleted", {
        type: "success",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      })
    } else if (response.status === 404) {
      toast("The task does not exist", {
        type: "error",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      })
      utilityStore.showDeleteConfirmation = false
    }
  } catch (error) {
    console.log("Error deleting task : ", error)
  }
}

onBeforeMount(async () => {
  try {
    const fetchTasks = await getAllTasks()
    utilityStore.tasksManager.addTasks(fetchTasks)

    for (const task of utilityStore.tasksManager.getTasks()) {
      task.assignees === null || task.assignees.trim().length === 0
        ? (task.assignees = "Unassigned")
        : ""
    }
  } catch (error) {
    console.log("Error fetching tasks : ", error)
  }
})
</script>

<template>
  <main class="w-screen h-screen overflow-y-auto bg-animation p-[4rem]">
    <div class="flex justify-between">
      <div>
        <h1
          class="text-headline font-extrabold text-3xl text-opacity-70 tracking-in-expand"
        >
          IT-BangMod Kradan Kanban
        </h1>

        <div class="ml-[22rem] tracking-in-expand-2">
          <GroupCode />
        </div>
      </div>

      <div class="flex items-center gap-x-3">
        <!-- <span class="cursor-pointer"><FilterIcon /></span> -->

        <router-link to="/status/manage">
          <div
            class="itbkk-manage-status bg-[#D9D9D9] text-base border-[#4C4C4C] border-[3px] px-3 py-[0.38rem] rounded-2xl tracking-wider hover:bg-transparent hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#B136FD] hover:from-[28%] hover:via-[#E95689] hover:via-[59%] hover:to-[#ED9E2F] hover:to-[88%] duration-500 ease-in-out cursor-pointer"
          >
            Manage Status
          </div>
        </router-link>
        <router-link :to="{name: 'create-task'}">
          <div
            class="border-secondary border-[0.1px] border-opacity-75 px-3 py-1 rounded-lg flex items-center gap-x-2 hover:bg-[#272727] hover:duration-[350ms] cursor-pointer"
          >
            <span><CreateTaskIcon /></span>
            <button class="itbkk-button-add text-normal text-opacity-75">
              Add Task
            </button>
          </div>
        </router-link>
      </div>
    </div>

    <div class="pt-12">
      <FilterCollapse />

      <table class="table border-collapse bg-[#141414] text-center">
        <thead
          class="bg-[#38383b] text-headline text-opacity-75 text-[16px] tracking-widest"
        >
          <tr class="border-none">
            <th class="rounded-tl-xl"></th>
            <th>
              <DropdownSortTitle />
            </th>
            <th>
              <DropdownSortAssignees />
            </th>
            <th><DropdownSortStatus /></th>
            <th class="rounded-tr-xl"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="itbkk-item border-none text-secondary"
            v-for="(task, index) in utilityStore.tasksManager.getTasks()"
            :key="task.id"
            v-if="utilityStore.tasksManager.getTasks().length > 0"
          >
            <td>{{ ++index }}</td>
            <td
              class="itbkk-title cursor-pointer hover:text-[#dcc6c6] hover:bg-normal hover:bg-opacity-5 hover:rounded-2xl duration-[350ms]"
              @click="router.push(`/task/${task.id}`)"
            >
              <div class="w-[20rem] mx-auto truncate tracking-wider">
                {{ task.title }}
              </div>
            </td>
            <td class="itbkk-assignees text-opacity-90 text-center italic">
              <div
                class="bg-[#1A1B1D] rounded-md px-1 py-2 text-wrap tracking-wide"
                :class="
                  task.assignees === 'Unassigned'
                    ? 'italic text-gray-500'
                    : 'text-[#F99B1D]'
                "
              >
                {{ task.assignees }}
              </div>
            </td>
            <td
              class="itbkk-status tooltip mt-1.5 before:max-w-none"
              :data-tip="task.status.name"
            >
              <div
                class="rounded-2xl p-2 font-semibold text-[16px] w-[8rem] truncate text-center tracking-normal font-Inter"
                :class="statusStyleStore.statusCustomStyle(task.status.color)"
              >
                {{ task.status.name }}
              </div>
            </td>
            <td>
              <div class="dropdown dropdown-bottom itbkk-button-action">
                <div
                  tabindex="0"
                  role="button"
                  class="btn bg-transparent outline-none border-none hover:bg-white hover:bg-opacity-[0.07]"
                >
                  <MoreIcon />
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content z-[1] menu shadow border-[0.1px] border-opacity-25 border-[#CCB6B6] bg-[#18181B] rounded-box w-32"
                >
                  <li
                    class="itbkk-button-edit cursor-pointer p-1 hover:rounded-md"
                    @click="router.push(`/task/${task.id}/edit`)"
                  >
                    <span class="font-Inter tracking-wider font-semibold"
                      ><EditTaskIcon />Edit</span
                    >
                  </li>
                  <div class="divider m-0 h-0"></div>
                  <li
                    class="itbkk-button-delete cursor-pointer p-1 hover:rounded-md"
                    @click="utilityStore.confirmDeleteTask(task.id, task.title)"
                  >
                    <span
                      class="font-Inter text-[#DB1058] text-opacity-60 tracking-wider font-semibold"
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
    <router-view />

    <!-- delete confirmation -->
    <DeleteConfirmationTask
      @delete-task="deleteTask(utilityStore.selectedId)"
    />
    <!-- delete confirmation -->
  </main>
</template>

<style scoped>
.bounce-in-top {
  -webkit-animation: bounce-in-top 1.5s both;
  animation: bounce-in-top 1.5s both;
}

@-webkit-keyframes bounce-in-top {
  0% {
    -webkit-transform: translateY(-500px);
    transform: translateY(-500px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateY(-65px);
    transform: translateY(-65px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateY(-28px);
    transform: translateY(-28px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}
@keyframes bounce-in-top {
  0% {
    -webkit-transform: translateY(-500px);
    transform: translateY(-500px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateY(-65px);
    transform: translateY(-65px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateY(-28px);
    transform: translateY(-28px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}
</style>
