<script setup>
import {ref, onMounted, onBeforeMount, watch, reactive} from "vue"
import {getAllBoards, deleteBoard} from "@/libs/FetchAPI.js"
import router from "@/router/index.js"
import GroupCode from "@/components/icons/GroupCode.vue"
import AboutBoardIcon from "@/components/icons/AboutBoard.vue"
import NoBoardBG from "@/components/icons/NoBoardBG.vue"
import DeleteIcon from "@/components/icons/DeleteIcon.vue"
import {useUserStore} from "@/stores/useUserStore"
import UserSetting from "@/components/UserSetting.vue"
import {useUtilityStore} from "@/stores/useUtilityStore.js"

const userStore = useUserStore()
const utilityStore = useUtilityStore()
const personalORcollab = ref('PERSONAL')

const selectBoard = (selectBoardId) => {
  utilityStore.selectedBoardId = selectBoardId
  const filterBoard = utilityStore.boardManager.getBoards().personalBoards.filter(board => board.id === selectBoardId)[0]
  utilityStore.selectedBoard = {...filterBoard}
  router.push(`/board/${selectBoardId}/task`)
}

const removeBoard = async (selectBoardId) => {
  const responseDeleteBoard = await deleteBoard(selectBoardId) 
  if(responseDeleteBoard.status === 200) {
    utilityStore.boardManager.deleteBoard(selectBoardId)
  }
} 

onBeforeMount(async () => {
  utilityStore.collabAccessRight = ''
  const JWT_TOKEN = localStorage.getItem("JWT_TOKEN")
  if (JWT_TOKEN) {
    const decodedData = window.atob(JWT_TOKEN.split(".")[1])
    userStore.userIdentity = {...JSON.parse(decodedData)}
  }
  try {
    const fetchBoards = await getAllBoards()
    utilityStore.boardManager.addBoards(fetchBoards[0])
    console.log(fetchBoards)
    console.log(utilityStore.boardManager.getBoards());
    console.log(utilityStore.boardManager.getBoards().collaboratorBoards);

  } catch (error) {
    console.log("Error fetching tasks : ", error)
  }
})
</script>

<template>
  <main class="w-screen h-screen overflow-y-auto bg-animation p-[8rem] pt-[4rem]">
    <!-- Team Logo -->
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
    </div>
    <div class="flex justify-end mb-5">
      <UserSetting />
    </div>
    <!-- Boad List Header & Add New board Button -->
    <div class="flex justify-center items-center mt-2">
      <div class="flex mx-auto pl-44 gap-10 items-center">
        <button @click="personalORcollab = 'PERSONAL'"
          class="text-headline text-xl tracking-wider w-36 py-1 rounded-xl hover:bg-[#272727] hover:duration-[350ms]" :class="personalORcollab === 'PERSONAL' ? 'bg-[#414141] bg-opacity-90': ''">
          Personal
        </button>
        <button @click="personalORcollab = 'COLLAB'"
          class="text-headline text-xl tracking-wider py-1 w-36 rounded-xl hover:bg-[#272727] hover:duration-[350ms]" :class="personalORcollab === 'COLLAB' ? 'bg-[#414141] bg-opacity-90': ''">
          Collab
        </button>
      </div>
      <router-link :to="{name: 'create-board'}">
        <div
          class="flex items-center bg-[#E3E3E3] py-1 px-5 rounded text-black text-sm font-semibold tracking-wid hover:bg-opacity-90">
          <div class="text-center">Create personal board</div>
        </div>
      </router-link>
    </div>
    <!-- Lists of the boards -->
    <div v-if="utilityStore.boardManager.getBoards().personalBoards?.length > 0 && personalORcollab === 'PERSONAL'"
      class="grid grid-cols-4 grid-flow-row justify-center gap-10 w-auto h-auto mt-[4rem]">
      <div v-for="(board, index) in utilityStore.boardManager.getBoards().personalBoards" :key="board.id"
        class="p-6 bg-[#141414] border border-[#454545] rounded-md items-center justify-between hover:bg-normal hover:bg-opacity-10"
        >

        <!-- <div class="flex gap-4"> -->
        <div @click="selectBoard(board.id)">
          <p class="font-Inter text-end" :class="board.visibility === 'PUBLIC' ? 'text-[#13FF80] text-opacity-65' : 'text-white text-opacity-30'">{{ board.visibility === 'PUBLIC' ? 'Publish' : 'Private'}}</p>
          <div class="flex items-center min-h-16" 
            :data-tip="board.name.length > 10 ? board.name : ''"
            :class="board.name.length > 10 ? 'tooltip' : ''"
            >
            <div class="self-center pr-2">
              <AboutBoardIcon width="40" height="48" />
            </div>
            <p class="text-xl font-bold text-start" 
            :class=" board.name.length > 24 ? 'text-nowrap max-h-16 truncate' : 'text-balance'">
              {{ board.name }}
            </p>
          </div>
        </div>

        <div class="flex items-end justify-between mt-7" >
          <div>
            <p class="text-sm font-medium">
              By {{ userStore.userIdentity.name }}
            </p>
            <p class="text-xs font-light opacity-55">
              Created At {{ utilityStore.formatDateTime(board.createdOn) }}
            </p>
          </div>
          <button class="tooltip tooltip-error text-normal" data-tip="Delete" @click="removeBoard(board.id)">
            <DeleteIcon width="28" height="37"/>
          </button>
        </div>
      </div>
    </div>

    <div v-if="utilityStore.boardManager.getBoards().personalBoards?.length === 0 && personalORcollab === 'PERSONAL'">
      <div class="flex flex-col justify-center items-center mt-32">
        <div ><NoBoardBG /></div>
        <h1 class="text-center text-white text-opacity-40 font-Inter text-[24px] tracking-wider" >
          It seems you don't have any boards yet. Please create a new board to get started.
        </h1>
      </div>
    </div>

    <div v-if="utilityStore.boardManager.getBoards().collaboratorBoards?.length > 0 && personalORcollab === 'COLLAB'"
      class="grid grid-cols-4 grid-flow-row justify-center gap-10 w-auto h-auto mt-[4rem]">
      <div v-for="(board, index) in utilityStore.boardManager.getBoards().collaboratorBoards" :key="board.id"
        class="p-6 bg-[#141414] border border-[#454545] rounded-md items-center justify-between hover:bg-normal hover:bg-opacity-10"
        @click="selectBoard(board.id)">

        <!-- <div class="flex gap-4"> -->
        <p class="font-Inter text-end " :class="board.accessRight === '[WRITE]' ? 'text-[#13FF80] text-opacity-65' : 'text-white text-opacity-30'">{{ board.accessRight === '[READ]' ? 'Read' : 'Write'}}</p>
        <div class="flex items-center min-h-16" 
          :data-tip="board.name.length > 10 ? board.name : ''"
          :class="board.name.length > 10 ? 'tooltip' : ''">
          <div class="self-center pr-2">
            <AboutBoardIcon width="40" height="48" />
          </div>
          <p class="text-xl font-bold text-start" 
          :class=" board.name.length > 24 ? 'text-nowrap max-h-16 truncate' : 'text-balance'">
            {{ board.name }}
          </p>
        </div>

        <div class="flex items-end justify-between mt-7">
          <div>
            <p class="text-sm font-medium">
              By {{ board.owner.name }}
            </p>
            <p class="text-xs font-light opacity-55">
              Created At {{ utilityStore.formatDateTime(board.createdOn) }}
            </p>
          </div>
          <button class="tooltip tooltip-error text-normal" data-tip="Delete">
            <DeleteIcon width="28" height="37" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="utilityStore.boardManager.getBoards().collaboratorBoards?.length === 0 && personalORcollab === 'COLLAB'">
      <div class="flex flex-col justify-center items-center mt-32">
        <div ><NoBoardBG /></div>
        <h1 class="text-center text-white text-opacity-40 font-Inter text-[24px] tracking-wider ml-12" >
          You have not joined any boards yet.
        </h1>
      </div>
    </div>

    <router-view />
  </main>
</template>

<style scoped></style>
