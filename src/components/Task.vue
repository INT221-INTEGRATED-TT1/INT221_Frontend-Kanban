<script setup>
import {ref, onMounted} from "vue"
import {getAllTasks} from "@/libs/FetchAPI.js"
import router from "@/router/index.js"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import FilterIcon from "@/components/icons/FilterIcon.vue"
import CreateTaskIcon from "@/components/icons/CreateTaskIcon.vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import TitleIcon from "@/components/icons/TitleIcon.vue"
import StatusIcon from "@/components/icons/StatusIcon.vue"
import AssigneesIcon from "@/components/icons/AssigneesIcon.vue"

const tasks = ref([])
const utilityStore = useUtilityStore()

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

    console.log(tasks.value)
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
        <router-link to="/createTask">
          <div
            class="border-solid border-[1px] border-secondary px-3 py-1 rounded-lg flex items-center gap-x-2"
          >
            <span><CreateTaskIcon /></span>
            <button class="text-normal text-opacity-75">New Task</button>
          </div>
        </router-link>
      </div>
    </div>

    <div class="overflow-x-auto pt-14">
      <table
        class="table border-collapse bg-[#FFFFFF] bg-opacity-[0.08] w-full p-5"
      >
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
            <th class="rounded-tr-xl">
              <div class="flex gap-x-3">
                <span><StatusIcon /></span>Status
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="itbkk-item cursor-pointer"
            v-for="task in tasks"
            v-if="tasks.length > 0"
            :key="task.id"
            @click="router.push(`/task/${task.id}`)"
          >
            <td>{{task.id}}</td>
            <td class="itbkk-title tracking-wider">
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
  </main>
</template>

<style scoped></style>
@/libs/FetchAPI.js
