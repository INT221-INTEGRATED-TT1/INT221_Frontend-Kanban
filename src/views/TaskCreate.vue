<script setup>
import {ref, reactive, computed, onBeforeMount, watch, nextTick} from "vue"
import {createTask, getAllBoards} from "@/libs/FetchAPI"
import router from "@/router"
import Xmark from "@/components/icons/Xmark.vue"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import {useStatusStyleStore} from "@/stores/useStatusStyleStore"
import DropdownIcon from "@/components/icons/DropdownIcon.vue"
import StatusDetail from "@/components/icons/StatusDetail.vue"
import AssigneeDetail from "@/components/icons/AssigneeDetail.vue"
import WarningIcon from "@/components/icons/WarningIcon.vue"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"
import {useRoute} from "vue-router"

const route = useRoute()
const utilityStore = useUtilityStore()
const statusStyleStore = useStatusStyleStore()

const newStatus = reactive({
  id: -1,
  name: "",
  description: "",
  color: "",
})

const newTask = reactive({
  title: "",
  description: "",
  assignees: "",
  status3: newStatus.id,
})

const selectStatus = (name, color, id) => {
  newStatus.name = name
  newStatus.color = color
  newStatus.id = id
  newTask.status3 = id
}

const filterStatus = ref({})

const isButtonDisabled = computed(() => {
  if (newStatus.id !== filterStatus.value.id && utilityStore.isLimitEnable) {
    utilityStore.transactionDisable = false
  } else if (
    newStatus.id === filterStatus.value.id &&
    utilityStore.isLimitEnable
  ) {
    utilityStore.transactionDisable = true
  }
  return !newTask.title || utilityStore.transactionDisable
})

const createNewTask = async () => {
  utilityStore.transactionDisable = true
  const filterStatusId = utilityStore.statusManager
    .getStatus()
    .filter((status) => status.id === newStatus.id)

  filterStatus.value = filterStatusId[0]
  console.log(filterStatus.value)
  if (
    filterStatusId[0].count >= utilityStore.limitStatusNumber &&
    utilityStore.isLimitEnable === true &&
    filterStatusId[0].name !== "No Status" &&
    filterStatusId[0].name !== "Done" &&
    utilityStore.isLimitEnable
  ) {
    toast(
      `The Status ${newStatus.name} will have to many tasks. Please make progress and update status of existing tasks first.`,
      {
        type: "error",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      }
    )
    utilityStore.transactionDisable = true
    return
  }

  try {
    // newTask.assignees.trim().length === 0 ? (newTask.assignees = null) : ""
    // newTask.description.trim().length === 0 ? (newTask.description = null) : ""
    const response = await createTask(route.params.boardID, newTask)
    if (response.status === 201) {
      utilityStore.transactionDisable = false
      // newStatus.id = 1
      utilityStore.tasksManager.addTask(response.data)
      utilityStore.statusManager.getStatus()[
        utilityStore.statusManager
          .getStatus()
          .findIndex((status) => status.id === newStatus.id)
      ].count += 1

      router.push(`/board/${utilityStore.selectedBoardId}/task`)
      filterStatus.value = {}
      setTimeout(() => {
        toast("The task has been successfully added", {
          type: "success",
          timeout: 2000,
          theme: "dark",
          transition: "flip",
          position: "bottom-right",
        })
      }, 200)
    } else if (response.status === 400) {
      utilityStore.transactionDisable = false
      toast("Please fill in the required fields", {
        type: "error",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      })
    }
  } catch (error) {
    console.log(error)
  }
}

onBeforeMount(async () => {
  utilityStore.isOwnerBoard = false
  const JWT_TOKEN = localStorage.getItem("JWT_TOKEN");
  if (JWT_TOKEN) {
    try {
      const fetchBoards = await getAllBoards()
      utilityStore.boardManager.addBoards(fetchBoards)
      utilityStore.selectedBoardId = route.params.boardID

      utilityStore.boardManager.getBoards()?.personalBoards.forEach(board => board.id === route.params.boardID ? utilityStore.isOwnerBoard = true : "false")
      // utilityStore.boardManager.getBoards()?.collaboratorBoards.forEach(board => board.id === route.params.boardID ? utilityStore.isOwnerBoard = true : "false")
      console.log("Owner Board : ",utilityStore.isOwnerBoard)

      utilityStore.isOwnerBoard ? console.log("owner") : console.log("not owner")
      if (!utilityStore.isOwnerBoard) {
        // router.push(`/board/${route.params.boardID}/task`).then(() => {
        //   toast(
        //     `You don't have permission to edit this board`,
        //     {
        //       type: "error",
        //       timeout: 2000,
        //       theme: "dark",
        //       transition: "flip",
        //       position: "bottom-right",
        //     })
        // })
        router.push('/error')
        return
      }
      const firstStatus = utilityStore.statusManager.getStatus()[0]
      console.log(firstStatus)
      newTask.status3 = newStatus.id = firstStatus.id
      newStatus.name = firstStatus.name
      newStatus.description = firstStatus.description
      newStatus.color = firstStatus.color

    } catch (error) {
      console.log(error)
    }
  }
  if (!utilityStore.isOwnerBoard) {
        // router.push(`/board/${route.params.boardID}/task`).then(() => {
        //   toast(
        //     `You don't have permission to edit this board`,
        //     {
        //       type: "error",
        //       timeout: 2000,
        //       theme: "dark",
        //       transition: "flip",
        //       position: "bottom-right",
        //     })
        // })
        router.push('/error')
        return
      }
})
</script>

<template>
  <section
    class="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-md"
  >
    <div
      class="w-[60rem] bg-[#1F1F1F] rounded-2xl px-14 py-10 transition ease-in-out"
    >
      <h1
        class="text-[12px] text-headline text-opacity-[0.43] font-bold text-center mt-5 tracking-wider"
      >
        Create Task
      </h1>
      <!-- close modal -->
      <div class="flex justify-end">
        <button
          @click="router.push(`/board/${utilityStore.selectedBoardId}/task`)"
        >
          <span>
            <Xmark />
          </span>
        </button>
      </div>

      <div class="flex flex-col gap-y-7">
        <!-- Title -->
        <div>
          <textarea
            class="itbkk-title bg-[#1A1B1D] rounded-xl outline-none resize-none w-full text-2xl font-semibold text-headline mt-5 p-4 pl-6"
            maxlength="100"
            placeholder="Enter Task Title"
            required
            v-model.trim="newTask.title"
          >
          </textarea>
          <span class="required flex justify-end text-xs text-normal opacity-45"
            >{{ newTask.title.length }} / 100</span
          >
        </div>

        <div class="grid grid-cols-1 grid-rows-2 gap-y-8">
          <!-- Status -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-status text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-3"
            >
              <span>
                <StatusDetail />
              </span>
              Status
            </div>
            <div class="dropdown dropdown-right">
              <div
                tabindex="0"
                role="button"
                class="rounded-xl px-2 py-1 font-bold text-[16px] text-center tracking-wider flex items-center gap-x-3"
                :class="statusStyleStore.statusCustomStyle(newStatus.color)"
              >
                {{ newStatus.name }}
                <span>
                  <DropdownIcon />
                </span>
              </div>
              <div
                class="dropdown-content z-[1] menu shadow rounded-lg bg-[#3D3C3C] w-52 break-all max-h-52 overflow-y-auto cursor-pointer"
              >
                <ul tabindex="0">
                  <li
                    v-for="status in utilityStore.statusManager.getStatus()"
                    :key="status.id"
                    @click="selectStatus(status.name, status.color, status.id)"
                    :class="statusStyleStore.statusCustomStyle(status.color)"
                    class="p-1 hover:bg-[#4D4D4D] hover:text-[#D8D8D8] transition ease-in-out duration-200 rounded-md bg-transparent"
                  >
                    {{ status.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- Status -->

          <!-- Assignees -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-assignees text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4"
            >
              <span>
                <AssigneeDetail />
              </span>
              Assignees
            </div>

            <div class="flex items-end gap-x-5">
              <textarea
                maxlength="30"
                rows="1"
                placeholder="Enter Assignees"
                v-model.trim="newTask.assignees"
                class="rounded-md bg-[#1A1B1D] text-[#F99B1D] resize-none font-normal text-[14px] text-opacity-90 textarea-xs italic w-[20rem] outline-none"
              ></textarea>
              <span class="text-xs text-normal opacity-45"
                >{{ newTask.assignees.length }} / 30</span
              >
            </div>
          </div>
          <!-- Assignees -->

          <!-- Description -->
          <div class="flex flex-col">
            <textarea
              class="itbkk-description textarea bg-[#D9D9D9] bg-opacity-5 text-normal text opacity-80 textarea-bordered w-[90%] mx-auto resize-none mt-5"
              rows="4"
              placeholder="Enter Task Description"
              v-model.trim="newTask.description"
              maxlength="500"
            ></textarea>
            <span class="text-xs text-normal opacity-45 flex justify-end pt-2"
              >{{ newTask.description.length }} / 500</span
            >
          </div>
          <!-- Description -->

          <!-- button operation -->
          <div class="flex justify-between">
            <div
              :class="utilityStore.isLimitEnable ? '' : 'invisible'"
              class="text-[#D69C27] flex items-center gap-x-3"
            >
              <WarningIcon width="20" height="20" />
              <span class="mt-1 tracking-wider">Limit Statuses is enabled</span>
            </div>

            <div class="flex gap-x-3">
              <button
                @click="
                  router.push(`/board/${route.params.boardID}/task`)
                "
                class="itbkk-button-cancel btn border-[#DB1058] px-14 bg-opacity-35 text-[#DB1058] w-[4rem] hover:border-none hover:bg-opacity-30 bg-transparent"
              >
                CANCEL
              </button>
              <button
                @click="createNewTask()"
                :disabled="isButtonDisabled"
                class="itbkk-button-confirm btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] border-[#007305] hover:border-none bg-transparent hover:bg-base"
              >
                SAVE
              </button>
            </div>
          </div>
          <!-- button operation -->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
textarea:placeholder-shown {
  font-style: italic;
  font-weight: 300;
  font-size: medium;
}
</style>
