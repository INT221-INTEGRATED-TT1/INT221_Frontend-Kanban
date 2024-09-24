<script setup>
import {ref, onMounted, onBeforeMount, watch, reactive} from "vue"
import {getAllBoards} from "@/libs/FetchAPI.js"
import router from "@/router/index.js"
import GroupCode from "@/components/icons/GroupCode.vue"
import FilterCollapse from "@/components/FilterCollapse.vue"
import AboutBoardIcon from "@/components/icons/AboutBoard.vue"
import DeleteIcon from "@/components/icons/DeleteIcon.vue"
import {useUserStore} from "@/stores/useUserStore"
import {useUtilityStore} from "@/stores/useUtilityStore.js"

const userStore = useUserStore()
const utilityStore = useUtilityStore()



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

const selectBoard = (selectBoardId) => {
  const filterBoard = utilityStore.boardManager.getBoards().filter(board => board.id === selectBoardId)[0]
  utilityStore.selectedBoard = {...filterBoard}
  router.push(`/board/${selectBoardId}/task`)
}

onBeforeMount(async () => {
  const JWT_TOKEN = localStorage.getItem("JWT_TOKEN")
  if (JWT_TOKEN) {
    const decodedData = window.atob(JWT_TOKEN.split(".")[1])
    userStore.userIdentity = {...JSON.parse(decodedData)}
  }
  try {
    const fetchBoards = await getAllBoards()
    utilityStore.boardManager.addBoards(fetchBoards)
    console.log(fetchBoards)
    console.log(utilityStore.boardManager.getBoards());
    for (const task of utilityStore.tasksManager.getTasks()) {
      task.assignees === null || task.assignees.trim().length === 0
        ? (task.assignees = "Unassigned")
        : ""
    }
  } catch (error) {
    console.log("Error fetching tasks : ", error)
  }
})
</script>

<template>
  <main
    class="w-screen h-screen overflow-y-auto bg-animation p-[8rem] pt-[4rem]"
  >
    <!-- Team Logo -->
    <div class="flex justify-between">
      <div>
        <router-link to="/board">
          <h1
            class="text-headline font-extrabold text-3xl text-opacity-70 tracking-in-expand"
          >
            IT-BangMod Kradan Kanban
          </h1>
        </router-link>
        <div class="ml-[22rem] tracking-in-expand-2">
          <GroupCode />
        </div>
      </div>
    </div>
    <!-- Boad List Header & Add New board Button -->
    <div class="flex justify-center items-center mt-2">
      <h1
        class="text-headline font-extrabold text-3xl tracking-wider mx-auto pl-44"
      >
        Board List
      </h1>
      <router-link :to="{name: 'create-board'}">
        <div
          class="flex items-center bg-[#E3E3E3] py-1 px-5 rounded text-black text-sm font-semibold tracking-wid hover:bg-opacity-90"
        >
          <div class="text-center">Create personal board</div>
        </div>
      </router-link>
    </div>
    <!-- Lists of the boards -->
    <div
      v-if="utilityStore.boardManager.getBoards().length > 0"
      class="grid grid-cols-4 grid-flow-row justify-center gap-10 w-auto h-auto mt-[4rem]"
    >
      <div
        v-for="(board, index) in utilityStore.boardManager.getBoards()"
        :key="board.id"
        class="space-y-7 p-6 bg-[#141414] border border-[#454545] rounded-md items-center justify-between cursor-pointer hover:bg-normal hover:bg-opacity-5"
        @click="selectBoard(board.id)"
      >
      
        <!-- <div class="flex gap-4"> -->
        <div
          class="flex items-center min-h-16"
          :data-tip="board.name.length > 10 ? board.name : ''"
          :class="board.name.length > 10 ? 'tooltip' : ''"
        >
          <div class="self-center pr-2">
            <AboutBoardIcon width="40" height="48" />
          </div>
          <p
            class="text-xl font-bold text-start"
            :class="
              board.name.length > 24
                ? 'text-nowrap max-h-16 truncate'
                : 'text-balance'
            "
          >
            {{ board.name }}
          </p>
        </div>
        <!-- <div class="flex items-center justify-between font-Geist tracking-wider text-white space-y-1"> -->
        <!-- <p class="text-2xl font-semibold">Todo Planning to travel</p> -->
        <!-- <p class="text-xs font-light opacity-55">Created At 16 Jan 2024</p> -->
        <!-- <p class="text-sm font-medium ">By Natsaran</p> -->
        <!-- </div> -->
        <!-- </div> -->
        <div class="flex items-end justify-between">
          <div>
            <p class="text-sm font-medium">
              By {{ userStore.userIdentity.name }}
            </p>
            <p class="text-xs font-light opacity-55">
              Created At {{ formatDateTime(board.createdOn) }}
            </p>
          </div>
          <button class="tooltip tooltip-error text-normal" data-tip="Delete">
            <DeleteIcon width="28" height="37" />
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <h1
        class="text-center p-44 text-white text-opacity-40 font-Inter text-[24px] tracking-wider"
      >
        No personal board
      </h1>
    </div>
    <router-view />
  </main>
</template>

<style scoped></style>
