<script setup>
import {ref, onMounted} from "vue"
import {getTasksData} from "/src/libs/crud.js"
import router from "@/router/index.js"

const hasData = ref(false)
const tasks = ref([])

const showDetailsTaskId = (id) => {
  router.push(`/task/details/${id}`)
}

onMounted(async () => {
  try {
    const fetchTasks = await getTasksData()
    tasks.value = fetchTasks
    hasData.value = true
    console.log(fetchTasks)
  } catch (error) {
    console.log("Error fetching tasks : ", error)
  }
})
</script>

<template>
  <main class="w-screen h-screen bg-[#eaeaea]">
    <div class="overflow-x-auto">
      <table class="table text-center bg-slate-100 flex">
        <thead>
          <tr class="text-2xl text-[#5c5c5c]">
            <th></th>
            <th>Title</th>
            <th>Description</th>
            <th>Assignees</th>
            <th>Status</th>
            <th>Create On</th>
            <th>Update On</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="text-[#5c5c5c] odd:bg-slate-200"
            v-for="task in tasks"
            :key="task.id"
            @click="showDetailsTaskId(task.id)"
          >
            <th>{{ task.id }}</th>
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>{{ task.assignees }}</td>
            <td>{{ task.status }}</td>
            <td>{{ task.createdOn }}</td>
            <td>{{ task.updatedOn }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <router-view></router-view>

    <div
      v-if="hasData && tasks.length === 0"
      class="overflow-x-auto h-full flex justify-center items-center"
    >
      <table class="text-center max-w-screen-2xl bg-slate-100">
        <thead>
          <tr class="text-2xl text-[#383838]">
            <th></th>
            <th>Title</th>
            <th>Description</th>
            <th>Assignees</th>
            <th>Status</th>
            <th>Create On</th>
            <th>Update On</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="4" class="text-xl text-[#383838]">No Task</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped></style>
