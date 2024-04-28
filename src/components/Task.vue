<script setup>
import {ref, onMounted} from "vue"
import {getTasksData} from "@/libs/crud.js"
import router from "@/router/index.js"

const tasks = ref([])
const convertStatus = {
  NO_STATUS: "No Status",
  TO_DO: "To Do",
  DOING: "Doing",
  DONE: "Done",
}

const getStatusStyle = (status) => {
  return {
    "bg-gray-500 text-slate-200": status === "NO_STATUS",
    "bg-yellow-600  text-white  ": status === "TO_DO",
    "bg-sky-500 opacity-85 text-white ": status === "DOING",
    "bg-green-500 opacity-90  text-white ": status === "DONE",
  }
}

const showDetailsTaskId = (id) => {
  router.push(`/task/${id}`)
}

onMounted(async () => {
  try {
    const fetchTasks = await getTasksData()
    tasks.value = fetchTasks

    tasks.value.forEach((task) => {
      if (task.assignees === null || task.assignees.trim().length === 0) {
        task.assignees = "Unassigned"
      }
    })

    console.log(fetchTasks)
  } catch (error) {
    console.log("Error fetching tasks : ", error)
  }
})
</script>

<template>
  <main class="w-screen h-screen bg-base-bg">
    <div
      class="overflow-x-auto overflow-y-auto h-full flex flex-col justify-center items-center gap-y-10"
    >
      <h1 class="text-headline font-bold text-5xl">
        IT-Bangmod Kradan Kanban (ITB-KK)
      </h1>
      <table
        class="table-lg border-separate rounded-xl bg-secondary-bg text-center max-w-screen-xl p-2"
      >
        <thead>
          <tr class="text-2xl text-table-header">
            <th class=""></th>
            <th class="">Title</th>
            <th class="">Assignees</th>
            <th class="">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="itbkk-item text-table-body italic odd:bg-slate-200 cursor-pointer hover:scale-95"
            v-for="task in tasks"
            v-if="tasks.length > 0"
            :key="task.id"
            @click="showDetailsTaskId(task.id)"
          >
            <td>{{ task.id }}</td>
            <td class="itbkk-title">
              {{ task.title }}
            </td>
            <td
              class="itbkk-assignees"
              :class="
                task.assignees === 'Unassigned' ? 'italic text-gray-500' : ''
              "
            >
              {{ task.assignees }}
            </td>
            <td
              class="itbkk-status font-extrabold rounded-lg"
              :class="getStatusStyle(task.status)"
            >
              <div class="">{{ convertStatus[task.status] }}</div>
            </td>
          </tr>

          <tr v-else>
            <td
              colspan="4"
              class="w-1/2 bg-slate-200 border text-gray-500 text-center"
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
