<script setup>
import {ref, onMounted} from "vue"
import {getTasksData} from "@/libs/crud.js"
import router from "@/router/index.js"

// const hasTask = ref(true)
// const hasNoTask = ref(false)
const tasks = ref([])
const convertStatus = {
  NO_STATUS: "No Status",
  TO_DO: "To Do",
  DOING: "Doing",
  DONE: "Done",
}

const showDetailsTaskId = (id) => {
  router.push(`/task/${id}`)
}

onMounted(async () => {
  try {
    const fetchTasks = await getTasksData()
    tasks.value = fetchTasks
    // if (tasks.value.length === 0) {
    //   hasTask.value = false
    //   hasNoTask.value = true
    //   console.log("No task")
    // }

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
  <main class="w-screen h-screen bg-[#232946]">
    <div
      class="overflow-x-auto overflow-y-auto h-full flex flex-col justify-center items-center gap-y-10"
    >
      <h1 class="text-[#fffffe] font-bold text-5xl">
        IT-Bangmod Kradan Kanban (ITB-KK)
      </h1>
      <table
        class="table-lg border-separate rounded-xl bg-[#b8c1ec] text-center max-w-screen-xl p-2"
      >
        <thead>
          <tr class="text-2xl text-[#121629]">
            <th class=""></th>
            <th class="">Title</th>
            <th class="">Assignees</th>
            <th class="">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="itbkk-item text-[#121629] italic odd:bg-slate-200 even:bg-slate-50 cursor-pointer hover:bg-[#babfdd] hover:scale-95"
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
            <td class="itbkk-status">
              {{ convertStatus[task.status] }}
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
