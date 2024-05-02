<script setup>
import {ref, onBeforeMount, onMounted} from "vue"
import {getTask} from "@/libs/FetchAPI.js"
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
// const isOpen = ref(false)
const route = useRoute()
const utilityStore = useUtilityStore()

const dropdownTextColor = (status) => {
  return {
    "text-[#D8D8D8]": status === "No Status",
    "text-[#FF881B]": status === "To Do",
    "text-[#2697FF]": status === "Doing",
    "text-[#65EE6C]": status === "Done",
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
    utilityStore.tasksManager.addTasks(fetchTask)
    task.value = utilityStore.tasksManager.getTasks()

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
  } catch (error) {
    console.log(`Error fetching task ${route.params.id}: `, error)
  }
})
</script>

<template>
  <section
    class="fixed inset-0 flex items-center justify-center backdrop-blur-sm"
  >
    <div class="w-[60rem] h-[42rem] bg-[#1F1F1F] rounded-2xl px-14 pt-10">
      <!-- close modal -->
      <div class="flex justify-end">
        <button @click="router.push('/task')">
          <span><Xmark /></span>
        </button>
      </div>

      <div class="flex flex-col gap-y-5">
        <!-- :value="task.title" -->
        <textarea
          class="itbkk-title bg-transparent outline-none scroll resize-none w-full text-2xl font-bold text-headline mt-5"
          maxlength="100"
          :value="task.title"
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
                :class="utilityStore.getStatusStyle(task.status)"
              >
                {{ utilityStore.convertToStatus[task.status] }}
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
            class="itbkk-description textarea textarea-bordered w-[90%] mx-auto resize-none mt-8"
            rows="6"
            placeholder="Description"
            maxlength="500"
            :class="
              task.description === 'No Description Provided'
                ? 'italic text-gray-500'
                : 'text-normal text opacity-80'
            "
            :value="task.description"
          ></textarea>
          <!-- :value="task.description" -->

          <!-- <textarea style="resize: none; overflow: hidden; min-height: 100px;" @input="resizeTextarea" class="texarea textarea-bordered rounded w-full p-2" placeholder="Title" ref="textArea"></textarea> -->
        </div>

        <!-- footer -->
        <div class="flex justify-between pt-8">
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
              @click="router.push('/')"
              class="itbkk-button btn btn-outline btn-success hover:bg-red-500 px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] bg-button"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
@/libs/FetchAPI
