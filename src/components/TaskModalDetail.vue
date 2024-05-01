<script setup>
import {ref, onBeforeMount} from "vue"
import {getTask} from "@/libs/crud"
import {useRoute} from "vue-router"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import router from "@/router/index.js"
import Xmark from "@/components/icons/Xmark.vue"
import StatusIcon from "@/components/icons/StatusIcon.vue"
import AssigneesIcon from "@/components/icons/AssigneesIcon.vue"
import CreateIcon from "@/components/icons/CreateIcon.vue"
import UpdateIcon from "@/components/icons/UpdateIcon.vue"
import TimezoneIcon from "@/components/icons/TimezoneIcon.vue"

const task = ref([])
// const isOpen = ref(false)
const route = useRoute()
const utilityStore = useUtilityStore()

const getStatusStyle = (status) => {
  return {
    "bg-gray-500 p-2 text-slate-200 font-extrabold rounded-md":
      status === "NO_STATUS",
    "bg-yellow-600 p-2 text-white  font-extrabold rounded-md":
      status === "TO_DO",
    "bg-sky-500 opacity-85 p-2 text-white font-extrabold rounded-md":
      status === "DOING",
    "bg-green-500 opacity-90 p-2 text-white font-extrabold rounded-md":
      status === "DONE",
  }
}

// const toggleDropdown = () => {
//   isOpen.value = !isOpen.value
// }

const selectStatus = (status) => {
  task.value.status = utilityStore.ConvertToEnumStatus[status]
}

const formatTimezone = () => {
  const options = {
    timeZoneName: "long",
  }
  const formatter = new Intl.DateTimeFormat([], options)
  const {timeZone} = formatter.resolvedOptions()
  return timeZone
}

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

    if (
      task.value.description === null ||
      task.value.description.trim().length === 0
    ) {
      task.value.description = "No Description Provided"
    }
    if (
      task.value.assignees === null ||
      task.value.assignees.trim().length === 0
    ) {
      task.value.assignees = "Unassigned"
    }

    // console.log(task.value.createdOn)

    // console.log(fetchTask)
    task.value.createdOn = formatDateTime(task.value.createdOn)
    task.value.updatedOn = formatDateTime(task.value.updatedOn)
  } catch (error) {
    console.log(`Error fetching task ${route.params.id}: `, error)
  }
})
</script>

<template>
  <section
    class="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
  >
    <div class="w-[50rem] h-[38rem] bg-[#1F1F1F] rounded-2xl p-7">
      <!-- close modal -->
      <div class="flex justify-end">
        <button @click="router.push('/task')">
          <span><Xmark /></span>
        </button>
      </div>

      <div class="flex pt-5">
        <span class="textarea" role="textbox" contenteditable>{{
          task.title
        }}</span>

        <!-- status -->
      </div>
    </div>
  </section>
</template>

<style scoped>
.textarea {
  display: block;
  width: 100%;
  overflow: hidden;
  resize: both;
  min-height: 40px;
  line-height: 20px;
  background: transparent;
}

.textarea[contenteditable]:empty::before {
  content: "Placeholder still possible";
  color: gray;
}
</style>
