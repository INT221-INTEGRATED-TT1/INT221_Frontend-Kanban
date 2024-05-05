<script setup>
import {ref, onBeforeMount, computed, reactive} from "vue"
import {getTask, editTask} from "@/libs/FetchAPI.js"
import {useRoute} from "vue-router"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import router from "@/router/index.js"
import Xmark from "@/components/icons/Xmark.vue"
import StatusDetail from "@/components/icons/StatusDetail.vue"
import AssigneeDetail from "@/components/icons/AssigneeDetail.vue"
import CreatedDateIcon from "@/components/icons/CreatedDateIcon.vue"
import UpdatedDateIcon from "@/components/icons/UpdatedDateIcon.vue"
import DropdownIcon from "@/components/icons/DropdownIcon.vue"
import TimezoneIcon from "@/components/icons/TimezoneIcon.vue"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"

// const text = ref('')
// let textArea = ref('')
// onMounted(() => {
//   console.log(textArea);
//   console.log(textArea.value.style.height);
//   // textArea = document.querySelector('textarea');

// });
// const resizeTextarea = () => {
//   console.log("Resize function execute");
//   textArea.value.style.height = "auto";
//   textArea.value.style.height = textArea.value.scrollHeight + "px";
// };

const task = ref([])
const route = useRoute()
const utilityStore = useUtilityStore()
const updateTask = reactive({
  title: "",
  description: "",
  assignees: "",
  status: "",
})

// const isOpen = ref(false)

const dropdownTextColor = (status) => {
  return {
    "text-[#D8D8D8]": status === "No Status",
    "text-[#FF881B]": status === "To Do",
    "text-[#2697FF]": status === "Doing",
    "text-[#65EE6C]": status === "Done",
  }
}

const selectStatus = (status) => {
  console.log("TasK : ",task.value.status);
  updateTask.status = utilityStore.ConvertToEnumStatus[status]
  console.log("updateTasK : ",updateTask.status);
  console.log("TasK : ",task.value.status);
}

// const isOpen = ref(false)

// const toggleDropdown = () => {
//   // selectStatus(status)
//   isOpen.value = !isOpen.value
// }

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

const isButtonDisabled = computed(() => {
  return (
    updateTask.title === task.value.title &&
    updateTask.description === task.value.description &&
    updateTask.assignees === task.value.assignees &&
    updateTask.status === task.value.status
  ) || !updateTask.title 
})

const editTaskData = async (newTask) => {
  try {
    const response = await editTask(route.params.id, newTask)
    if (response.status === 200) {
      utilityStore.tasksManager.editTask(route.params.id, newTask)
      router.push("/task")
      setTimeout(() => {
        toast("The task has been updated", {
          type: "success",
          timeout: 2000,
        })
      })
    }

    if (response.status === 404) {
      toast("An error has occurred, the task does not exist.", {
        type: "error",
        timeout: 2000,
      })
    }
  } catch (error) {
    console.log("Error updating task: ", error)
  }
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

    task.value.createdOn = formatDateTime(task.value.createdOn)
    task.value.updatedOn = formatDateTime(task.value.updatedOn)

    updateTask.title = task.value.title
    updateTask.description = task.value.description
    updateTask.assignees = task.value.assignees
    updateTask.status = task.value.status

    // console.log(updateTask.status.length)
  } catch (error) {
    console.log(`Error fetching task ${route.params.id}: `, error)
  }
})

</script>

<template>
  <section
    class="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
  >
    <div class="w-[60rem] h-[42rem] bg-[#1F1F1F] rounded-2xl px-14 py-10">
      <!-- close modal -->
      <div class="flex justify-end">
        <button @click="router.push('/task')">
          <span><Xmark /></span>
        </button>
      </div>

      <div class="flex flex-col gap-y-5">
        <textarea
          class="itbkk-title bg-transparent outline-none scroll resize-none w-full text-3xl font-bold text-headline mt-5"
          maxlength="100"
          :placeholder="task.title"
          v-model.trim="updateTask.title"
        >
        </textarea>

        <div class="grid grid-cols-1 grid-rows-4 gap-y-4">
          <!-- Status -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-status text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-3"
            >
              <span clas><StatusDetail /></span> Status
            </div>
            <div class="dropdown dropdown-right">
              <div
                tabindex="0"
                role="button"
                class="rounded-xl px-2 py-1 font-bold text-[16px] text-center tracking-wider flex items-center gap-x-3"
                :class="utilityStore.getStatusStyle(updateTask.status)"
              >
                {{ utilityStore.convertToStatus[updateTask.status] }}
                <span><DropdownIcon /></span>
              </div>

              <ul
                tabindex="0"
                class="dropdown-content z-[1] menu shadow rounded-lg bg-[#3D3C3C] w-52 cursor-pointer"
              >
                <li
                  v-for="status in ['No Status', 'To Do', 'Doing', 'Done']"
                  :key="status"
                  @click="selectStatus(status)"
                  :class="dropdownTextColor(status)"
                >
                  {{ status }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Assignees -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-assignees text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4"
            >
              <span><AssigneeDetail /></span> Assignees
            </div>

            <textarea
              maxlength="30"
              rows="1"
              class="rounded-md bg-[#1A1B1D] resize-none font-normal text-[14px] text-opacity-90 textarea-xs italic w-[20rem]"
              :class="
                task.assignees === 'Unassigned'
                  ? 'italic text-gray-500'
                  : ' text-[#F99B1D]'
              "
              v-model.trim="updateTask.assignees"
              :placeholder="task.assignees"
              >{{ task.assignees }}</textarea
            >
          </div>

          <!-- CreatedOn -->
          <div class="flex gap-x-10 items-center">
            <div
              class="text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4"
            >
              <span><CreatedDateIcon /></span> Created On
            </div>
            <div
              class="itbkk-created-on font-normal text-[14px] text-headline text-opacity-50 tracking-widest"
            >
              {{ task.createdOn }}
            </div>
          </div>

          <!-- UpdatedOn -->
          <div class="flex gap-x-10 items-center">
            <div
              class="text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4"
            >
              <span><UpdatedDateIcon /></span> Updated On
            </div>
            <div
              class="itbkk-updated-on font-normal text-[14px] text-headline text-opacity-50 tracking-widest"
            >
              {{ task.updatedOn }}
            </div>
          </div>

          <!-- Description -->
          <textarea
            class="itbkk-description textarea bg-[#D9D9D9] bg-opacity-5 text-normal text opacity-80 textarea-bordered w-[90%] mx-auto resize-none mt-8"
            rows="6"
            maxlength="500"
            :class="
              task.description === 'No Description Provided'
                ? 'italic text-gray-500'
                : 'text-normal text opacity-80'
            "
            v-model.trim="updateTask.description"
            :placeholder="task.description"
          ></textarea>

          <!-- <textarea style="resize: none; overflow: hidden; min-height: 100px;" @input="resizeTextarea" class="texarea textarea-bordered rounded w-full p-2" placeholder="Title" ref="textArea"></textarea> -->
        </div>

        <!-- Button Operation -->
        <div class="flex justify-between">
          <!-- timezone -->
          <div class="itbkk-timezone flex items-center gap-x-2">
            <div
              class="text-[1.1rem] font-bold text-headline text-opacity-70 flex items-center gap-x-3"
            >
              <span><TimezoneIcon /></span>TimeZone :
            </div>

            <div class="text-[1rem] text-headline text-opacity-55 pt-[3px]">
              {{ formatTimezone() }}
            </div>
          </div>

          <div class="flex gap-x-3">
            <button
              @click="router.push('/')"
              class="btn btn-outline px-14 bg-opacity-35 text-[#DB1058] w-[4rem] bg-button"
            >
              CANCEL
            </button>
            <button
              :disabled="isButtonDisabled"
              @click="editTaskData(updateTask)"
              class="itbkk-button btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] bg-button"
            >
              SAVE
            </button>
          </div>
        </div>
        <!-- Button Operation -->
      </div>
    </div>
  </section>
</template>

<style scoped></style>
