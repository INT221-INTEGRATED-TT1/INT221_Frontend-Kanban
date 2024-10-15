<script setup>
import { ref, onMounted, onBeforeMount, watch } from "vue"
import { getAllTasks, deleteTask, getAllBoards, updateBoardVisibility } from "@/libs/FetchAPI.js"
import router from "@/router/index.js"
import { useUtilityStore } from "@/stores/useUtilityStore.js"
import { useStatusStyleStore } from "@/stores/useStatusStyleStore"
import { useUserStore } from "@/stores/useUserStore"
import CreateTaskIcon from "@/components/icons/CreateTaskIcon.vue"
import LinkIcon from "@/components/icons/LinkIcon.vue"
import UserIcon from "@/components/icons/UserIcon.vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import MoreIcon from "@/components/icons/MoreIcon.vue"
import DeleteIcon from "@/components/icons/DeleteIcon.vue"
import EditTaskIcon from "@/components/icons/EditTaskIcon.vue"
import DeleteConfirmationTask from "@/components/DeleteConfirmationTask.vue"
import UserSetting from "@/components/UserSetting.vue"
import FilterCollapse from "@/components/FilterCollapse.vue"
import DropdownSortStatus from "@/components/DropdownSortStatus.vue"
import DropdownSortAssignees from "@/components/DropdownSortAssignee.vue"
import DropdownSortTitle from "@/components/DropdownSortTitle.vue"
import { toast } from "vue3-toastify"
import { useRoute } from "vue-router"
import "vue3-toastify/dist/index.css"

const route = useRoute()
const utilityStore = useUtilityStore()
const statusStyleStore = useStatusStyleStore()
const userStore = useUserStore()
const currentVisibility = ref('')
const copyLinkClicked = ref(false)
const isToggled = ref(false)
// const filteredStatus = ref([])
const deleteATask = async (deleteId) => {
  try {
    // console.log(deleteId)
    const findStatusIdFromTask = utilityStore.tasksManager.getTasks().filter(task => task.id === deleteId)[0].statuses3.id
    console.log(findStatusIdFromTask)
    const response = await deleteTask(route.params.boardID, deleteId)
    if (response.status === 200) {
      utilityStore.tasksManager.deleteTask(deleteId)
      // console.log
      utilityStore.statusManager.getStatus()[utilityStore.statusManager.getStatus().findIndex(status => status.id === findStatusIdFromTask)].count -= 1
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

const copyToClipboard = async () => {
    window.location.origin.includes('localhost') ? await navigator.clipboard.writeText((window.location.origin + route.fullPath).slice(0, -5)) : 
    await navigator.clipboard.writeText(window.location.origin + `${import.meta.env.VITE_PROD_BASE_URL}` + route.fullPath.slice(0, -5))
    copyLinkClicked.value = true
    setTimeout(() => {
        copyLinkClicked.value = false
      }, 2000); // Delay for 2 seconds
      // copyLinkClicked.value = true
}

const changeVisibilityBoardRadioClick = () => {
    console.log('first',isToggled.value)
    isToggled.value = !isToggled.value
    console.log('second',isToggled.value)

    let fsVisibility = ''
    isToggled.value ? fsVisibility = 'PUBLIC' : fsVisibility = 'PRIVATE'
    currentVisibility.value === fsVisibility ? utilityStore.showChangeBoardVisibilityConfirmation = false : utilityStore.showChangeBoardVisibilityConfirmation = true
    currentVisibility.value = fsVisibility
}

const CancelChangeVisibilityBoard = () => {
    utilityStore.showChangeBoardVisibilityConfirmation = false
    currentVisibility.value === 'PRIVATE' ? currentVisibility.value = 'PUBLIC' : currentVisibility.value = 'PRIVATE'
    isToggled.value = !isToggled.value
}

const changeVisibilityBoard = async () => {
    await updateBoardVisibility(route.params.boardID, currentVisibility.value)
    utilityStore.boardManager.changeVisibilityBoard(route.params.boardID, currentVisibility.value)
    utilityStore.showChangeBoardVisibilityConfirmation = false
}

onBeforeMount(async () => {
  utilityStore.isOwnerBoard = false
  utilityStore.selectedBoardId = route.params.boardID
  const JWT_TOKEN = localStorage.getItem("JWT_TOKEN");
  if (JWT_TOKEN) {
    const decodedData = window.atob(JWT_TOKEN.split('.')[1]);
    userStore.userIdentity = { ...JSON.parse(decodedData) }

    const fetchBoards = await getAllBoards()
    utilityStore.boardManager.addBoards(fetchBoards)

    utilityStore.boardManager.getBoards()?.personalBoards.forEach(board => board.id === route.params.boardID ? utilityStore.isOwnerBoard = true : "false")
    utilityStore.isOwnerBoard ? utilityStore.selectedBoard = {...utilityStore.boardManager.getBoards()?.personalBoards.filter(board => board.id === route.params.boardID)[0]} : ""
    console.log("Owner Board : ", utilityStore.isOwnerBoard)
    if(utilityStore.isOwnerBoard) {
      currentVisibility.value = utilityStore.boardManager.getBoards()?.personalBoards.filter(board => board.id === route.params.boardID)[0].visibility
      currentVisibility.value === 'PUBLIC' ? isToggled.value = true : isToggled.value = false

      console.log(isToggled.value)

    } else { 
      currentVisibility.value = ''
    }
  }
  try {
    // console.log(route.params.boardID)
    const fetchTasks = await getAllTasks(route.params.boardID)
    utilityStore.tasksManager.addTasks(fetchTasks)
    // utilityStore.selectedBoard.name.length > 0 ? console.log('board has board name') : utilityStore.selectedBoard = {...fetchTasks[0]?.board}
    !utilityStore.isOwnerBoard ? utilityStore.selectedBoard = {...fetchTasks[0]?.board} : ""
    // console.log(utilityStore.selectedBoardId)
    console.log("Owner Board : ", utilityStore.isOwnerBoard)
    // console.log(fetchTasks)

    for (const task of utilityStore.tasksManager.getTasks()) {
      task.assignees === null || task.assignees.trim().length === 0
        ? (task.assignees = "Unassigned")
        : ""
    }

    // utilityStore.isTaskMounted = true
  }
  catch (error) {
    // localStorage.removeItem("JWT_TOKEN")
    console.log("Error fetching tasks : ", error.status === 404)
    error.status === 404 ? router.push({name: "not-found"})  : router.push('/error')
  }
})

</script>

<template>
  <main class="w-screen h-screen overflow-y-auto bg-animation p-[4rem]">
    <div class="flex justify-between">
      <div>
        <router-link to="/board">
          <h1 class="text-headline font-extrabold text-3xl text-opacity-70 tracking-in-expand">
            IT-BangMod Kradan Kanban
          </h1>
        </router-link>

        <div class="ml-[22rem] tracking-in-expand-2">
          <GroupCode />
        </div>
      </div>

      <div class="flex items-center gap-x-3">
        <router-link :to="`/board/${route.params.boardID}/status`">
          <div
            class="itbkk-manage-status bg-[#D9D9D9] text-base border-[#4C4C4C] border-[3px] px-3 py-[0.38rem] rounded-2xl tracking-wider hover:bg-transparent hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#B136FD] hover:from-[28%] hover:via-[#E95689] hover:via-[59%] hover:to-[#ED9E2F] hover:to-[88%] duration-500 ease-in-out cursor-pointer">
            Manage Status
          </div>
        </router-link>
        <router-link :to="{ name: 'create-task' }">
          <button :disabled="!utilityStore.isOwnerBoard"
            :class="!utilityStore.isOwnerBoard ? 'bg-gray-600 bg-opacity-15 tooltip tooltip-top border-opacity-15 text-normal text-opacity-15 cursor-not-allowed'
              : 'border-opacity-75 hover:bg-[#272727] hover:duration-[350ms] cursor-pointer text-opacity-75 text-normal'"
            data-tip="You need to be board owner to perform this action."
            class="itbkk-button-add border-secondary border-[0.1px] px-3 py-1 rounded-lg flex items-center gap-x-2 ">
            <span :class="!utilityStore.isOwnerBoard ? 'opacity-15' : ''">
              <CreateTaskIcon />
            </span>Add Task
          </button>
        </router-link>
        <UserSetting />
      </div>
    </div>

    <div class="pt-10">
      <div class="flex justify-end items-center mb-6">
        <div class="text-headline font-extrabold text-2xl tracking-wider mr-auto">{{ utilityStore.selectedBoard.name }}
        </div>
        <div class="flex items-center gap-4 mr-10" >
          <p :class="utilityStore.isOwnerBoard ? 'text-opacity-100': 'text-white text-opacity-35'">{{ utilityStore.isOwnerBoard ? 'Publish' : 'Cannot Publish'}}</p>
          <!-- :class="currentVisibility === 'PUBLIC' ? 'border-[#565656] bg-white [--tglbg:#11FF70]' : ''" -->
          <input type="checkbox" class="toggle hover:bg-gray-200" v-model="isToggled" @click="changeVisibilityBoardRadioClick" :checked="currentVisibility === 'PUBLIC' " :disabled="!utilityStore.isOwnerBoard" />
          <button class="flex items-center gap-1 text-[#005BC4] text-sm"
            :class="isToggled ? 'opacity-100' : 'opacity-0 '" @click="copyToClipboard"
            :disabled="copyLinkClicked || !isToggled">
            <LinkIcon />
            <p v-if="!copyLinkClicked"> Copy Link</p>
            <p v-else class="ml-1">Link copied <br /> to clipboard!</p>
          </button>
        </div>
        <router-link :to="`/board/${route.params.boardID}/collab`">
          <!-- :disabled = "!utilityStore.isOwnerBoard" -->
          <!-- :class="!utilityStore.isOwnerBoard ? 'bg-gray-600 bg-opacity-15 text-opacity-15 tooltip tooltip-left cursor-not-allowed' : 'bg-[#338EF7]'" -->
          <button 
            data-tip="You need to be board owner to perform this action."
            class="flex items-center gap-2 text-white text-center font-Geist text-sm px-4 py-2 rounded-md self-end bg-[#338EF7]">
            <!-- :class="!utilityStore.isOwnerBoard ? 'opacity-20' : 'opacity-100'" -->
            <div><UserIcon /></div>
            Manage Collaborator
          </button>
        </router-link>
      </div>

      <div v-if="utilityStore.showChangeBoardVisibilityConfirmation">
        <div class="fixed inset-0 backdrop-blur-md flex justify-center items-center z-30">
          <div class="itbkk-message bg-[#18181B] rounded-lg w-[34rem] h-auto flex flex-col">
            <h1 class="text-[#F5F5F5] font-bold text-2xl text-opacity-80 flex px-10 pt-9">
              Board Visibility Change !
            </h1>
            <div class="divider m-2"></div>
            <div class="p-8 flex flex-col gap-y-6">
              <p class="itbkk-button-message text-[#D69C27] text-opacity-75 mb-7">
                Only the board owner can access and manage this board when it's set to private. Do you want to change
                the visibility to <span class="text-blue-500 font-bold underline underline-offset-2">{{ currentVisibility === 'PUBLIC' ? 'Public': 'Private'}}</span> ?
              </p>
              <div class="flex justify-end gap-x-[1rem]">
                <button
                  class="itbkk-button-cancel btn text-xs font-semibold text-[#FFFFFF] bg-transparent text-opacity-70 border-none hover:bg-transparent"
                  @click="CancelChangeVisibilityBoard">
                  Cancel
                </button>
                <button
                  class="btn px-8 text-xs tracking-widest bg-[#007305] bg-opacity-35 text-[#13FF80] text-opacity-85 hover:border-none hover:bg-base"
                  @click="changeVisibilityBoard">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <FilterCollapse />

      <table class="table border-collapse bg-[#141414] text-center">
        <thead class="bg-[#38383b] text-headline text-opacity-75 text-[16px] tracking-widest">
          <tr class="border-none">
            <th class="rounded-tl-xl"></th>
            <th>
              <DropdownSortTitle />
            </th>
            <th>
              <DropdownSortAssignees />
            </th>
            <th>
              <DropdownSortStatus />
            </th>
            <th class="rounded-tr-xl"></th>
          </tr>
        </thead>
        <tbody>
          <tr class="itbkk-item border-none text-secondary"
            v-for="(task, index) in utilityStore.tasksManager.getTasks()" :key="task.id"
            v-if="utilityStore.tasksManager.getTasks().length > 0">
            <td>{{ ++index }}</td>
            <td
              class="itbkk-title cursor-pointer hover:text-[#dcc6c6] hover:bg-normal hover:bg-opacity-5 hover:rounded-2xl duration-[350ms]"
              @click="router.push(`/board/${route.params.boardID}/task/${task.id}`)">
              <div class="w-[20rem] mx-auto truncate tracking-wider">
                {{ task.title }}
              </div>
            </td>
            <td class="itbkk-assignees text-opacity-90 text-center italic">
              <div class="bg-[#1A1B1D] rounded-md px-1 py-2 text-wrap tracking-wide" :class="task.assignees === 'Unassigned'
                ? 'italic text-gray-500'
                : 'text-[#F99B1D]'
                ">
                {{ task.assignees }}
              </div>
            </td>
            <td class="itbkk-status tooltip mt-1.5 before:max-w-none" :data-tip="task.statuses3.name">
              <div
                class="rounded-2xl p-2 font-semibold text-[16px] w-[8rem] truncate text-center tracking-normal font-Inter"
                :class="statusStyleStore.statusCustomStyle(task.statuses3.color)">
                {{ task.statuses3.name }}
              </div>
            </td>
            <td>
              <div class="dropdown dropdown-bottom itbkk-button-action">
                <div tabindex="0" role="button"
                  class="btn bg-transparent outline-none border-none hover:bg-white hover:bg-opacity-[0.07]">
                  <MoreIcon />
                </div>
                <ul tabindex="0"
                  class="dropdown-content z-[1] menu shadow border-[0.1px] border-opacity-25 border-[#CCB6B6] bg-[#18181B] rounded-box w-32">
                  <!-- <li> -->
                  <button :disabled="!utilityStore.isOwnerBoard"
                    :class="!utilityStore.isOwnerBoard ? 'text-opacity-15 tooltip tooltip-left cursor-not-allowed' : 'cursor-pointer hover:rounded-md hover:bg-zinc-700 hover:bg-opacity-30'"
                    class="itbkk-button-edit flex items-center justify-center p-2 gap-x-2 pr-5 mb-1 font-Inter tracking-wider font-semibold text-normal"
                    data-tip="You need to be board owner to perform this action."
                    @click="router.push(`task/${task.id}/edit`)">
                    <span :class="!utilityStore.isOwnerBoard ? 'opacity-60' : ''">
                      <EditTaskIcon />
                    </span>
                    Edit
                  </button>
                  <!-- </li> -->
                  <div class="divider m-0 h-0"></div>
                  <!-- <li> -->
                  <button :disabled="!utilityStore.isOwnerBoard"
                    :class="!utilityStore.isOwnerBoard ? 'text-opacity-15 tooltip tooltip-left cursor-not-allowed' : 'cursor-pointer hover:rounded-md hover:bg-zinc-700 hover:bg-opacity-30'"
                    class="itbkk-button-delete flex items-center justify-center p-2 gap-x-2 pr-5 mt-1 text-[#DB1058] font-Inter tracking-wider font-semibold"
                    data-tip="You need to be board owner to perform this action."
                    @click="utilityStore.confirmDeleteTask(task.id, task.title)">
                    <span :class="!utilityStore.isOwnerBoard ? 'opacity-60' : ''">
                      <DeleteIcon />
                    </span>
                    Delete
                  </button>
                  <!-- </li> -->
                </ul>
              </div>
            </td>
          </tr>

          <tr v-else>
            <td colspan="4" class="text-center font-bold text-xl text-headline text-opacity-50">
              No Task
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <router-view />

    <!-- delete confirmation -->
    <DeleteConfirmationTask @delete-task="deleteATask(utilityStore.selectedId)" />
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