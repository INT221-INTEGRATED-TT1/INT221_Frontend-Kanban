<script setup>
import {ref, reactive, onBeforeMount, computed} from "vue"
import {createTask} from "@/libs/FetchAPI"
import router from "@/router"
// import {useRoute} from "vue-router"
import Xmark from "@/components/icons/Xmark.vue"
import {getAllTasks} from "@/libs/FetchAPI"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import DropdownIcon from "@/components/icons/DropdownIcon.vue"
import StatusDetail from "@/components/icons/StatusDetail.vue"
import AssigneeDetail from "@/components/icons/AssigneeDetail.vue"
import {ConvertToEnumStatus} from "../libs/util.js"

const utilityStore = useUtilityStore()
// const route = useRoute()
// const task = ref([])

const dropdownTextColor = (status) => {
  return {
    "text-[#D8D8D8]": status === "No Status",
    "text-[#FF881B]": status === "To Do",
    "text-[#2697FF]": status === "Doing",
    "text-[#65EE6C]": status === "Done",
  }
}

const selectStatus = (status) => {
  newTask.status = status
}

const newTask = reactive({
  title: "",
  description: "",
  assignees: "",
  status: "No Status",
})

const createNewTask = async () => {
  // newTask.title = newTask.title.trim()
  // newTask.description = newTask.description.trim()
  // newTask.assignees = newTask.assignees.trim()

  try {
    const response = await createTask(newTask)
    if (response.status === 201) {
      router.push("/task")
      
      utilityStore.tasksManager.addTask(response.data)
    }
  } catch(error) {
    alert("Failed to add the task. Please try again later.")
    console.log(error);
  }
}

const isButtonDisabled = computed(() => {
  return !newTask.title
})

onBeforeMount(async () => {
  // const fetchTask = await getAllTasks()
  // utilityStore.tasksManager.addTasks(fetchTask)
  // task.value = utilityStore.tasksManager.getTasks()
  // task.value.forEach((task) => {})
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

      <div class="flex flex-col gap-y-14">
        <!-- Title -->
        <textarea
          class="itbkk-title bg-[#1A1B1D] rounded-xl outline-none resize-none w-full text-3xl font-bold text-headline mt-5 p-2"
          maxlength="100"
          placeholder="Empty"
          required
          v-model.trim="newTask.title"
        ></textarea>

        <div class="grid grid-cols-1 grid-rows-2 gap-y-8">
          <!-- Status -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-status text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-3"
            >
              <span><StatusDetail /></span> Status
            </div>
            <div class="dropdown dropdown-right">
              <div
                tabindex="0"
                role="button"
                class="rounded-xl px-2 py-1 font-bold text-[16px] text-center tracking-wider flex items-center gap-x-3"
                :class="utilityStore.getStatusStyle(ConvertToEnumStatus[newTask.status])"
              >
                {{newTask.status}}
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
          <!-- Status -->

          <!-- Assignees -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-assignees text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4"
            >
              <span><AssigneeDetail /></span> Assignees
            </div>

            <!-- :class=" task.assignees === 'Unassigned' ? 'italic text-gray-500' :
            ' text-[#F99B1D]' " -->
            <textarea
              maxlength="30"
              rows="1"
              placeholder="Empty"
              v-model.trim="newTask.assignees"
              class="rounded-md bg-[#1A1B1D] resize-none font-normal text-[14px] text-opacity-90 textarea-xs italic w-[20rem]"
            ></textarea>
          </div>
          <!-- Assignees -->

          <!-- Description -->
          <!-- :class=" task.description === 'No Description Provided' ? 'italic
          text-gray-500' : 'text-normal text opacity-80' " -->
          <textarea
            class="itbkk-description textarea textarea-bordered w-[90%] mx-auto resize-none mt-8"
            rows="6"
            placeholder="Description"
            v-model.trim="newTask.description"
            maxlength="500"
          ></textarea>
          <!-- :value="task.description" -->
          <!-- Description -->

          <!-- footer -->
          <div class="flex justify-end">
            <div class="flex gap-x-3">
              <button
                @click="router.push('/')"
                class="itbkk-button-cancel btn btn-outline px-14 bg-opacity-35 text-[#DB1058] w-[4rem] bg-button"
              >
                CANCEL
              </button>
              <button
                @click="createNewTask()"
                :disabled="isButtonDisabled"
                class="itbkk-button-confirm btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] bg-button"
              >
                SAVE
              </button>
            </div>
          </div>
          <!-- footer -->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
