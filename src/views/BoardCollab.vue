<script setup>
import { ref, onMounted, onBeforeMount, computed, reactive } from "vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import UserSetting from "@/components/UserSetting.vue"
import Xmark from "@/components/icons/Xmark.vue"
import router from "@/router/index.js"
import DropdownIcon from "@/components/icons/DropdownIcon.vue"
import { getCollaborators, getAllBoards, addCollaborator } from "@/libs/FetchAPI.js"
import { useUtilityStore } from "@/stores/useUtilityStore.js"
import { useRoute } from "vue-router"
import { useUserStore } from "@/stores/useUserStore"

const userStore = useUserStore()
const route = useRoute()
const utilityStore = useUtilityStore()
const addCollaboratorModal = ref(false)
const isEmailValid = ref(true)
// const numberofCollaborators = ref(6) getCollaborators
const newCollaboratorModel = reactive({
  email : "",
  accessRight : "READ"
})

let oldCollaboratorModel = reactive({
  email : "",
  accessRight : "READ"
})

const addNewCollaborator = async () => {
    oldCollaboratorModel = {...newCollaboratorModel}
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(emailPattern.test(newCollaboratorModel.email)){
      isEmailValid.value = true
      console.log(newCollaboratorModel)
      await addCollaborator(route.params.boardID, newCollaboratorModel)

      addCollaboratorModal.value = false
      newCollaboratorModel.email = ""
      newCollaboratorModel.accessRight = "READ"
    } else{
      console.log("can't add new collab")
      isEmailValid.value = false
      utilityStore.transactionDisable = true

    }
    
    // console.log('old : ' , oldCollaboratorModel)
    // return emailPattern.test(email);
}

const cancelAddCollaboratorModal = () => {
  addCollaboratorModal.value = false
  newCollaboratorModel.email = ""
  newCollaboratorModel.accessRight = "READ"
  isEmailValid.value = true
}

const isButtonDisabled = computed(() => {
  oldCollaboratorModel.email !== newCollaboratorModel.email ? utilityStore.transactionDisable = false : oldCollaboratorModel.accessRight !== newCollaboratorModel.accessRight ? utilityStore.transactionDisable = false : utilityStore.transactionDisable = true
  // console.log('new : ' , newCollaboratorModel)
  // console.log('old : ' , oldCollaboratorModel)
  return !newCollaboratorModel.email || utilityStore.transactionDisable || (userStore.userIdentity.email === newCollaboratorModel.email)
})

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
    
  }

  try {
    const fetchCollaborators = await getCollaborators(route.params.boardID)
    userStore.collaboratorManager.addCollaborators(fetchCollaborators.data)
    console.log(userStore.collaboratorManager.getCollaborators())
  }
  catch (error) {
    console.log("Error fetching Collaborators : ", error.status === 404)
    error.status === 404 ? router.push({name: "not-found"})  : router.push('/error')
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
    <div class="flex justify-end items-center mt-2">
      <button @click="addCollaboratorModal = true"
        class="flex items-center bg-[#E3E3E3] text-center py-2 px-5 rounded text-black text-sm font-semibold tracking-wid hover:bg-opacity-90">
        Add Collaborator
      </button>
    </div>

    <!-- Toggle Add Collaborator Modal-->
    <div v-if="addCollaboratorModal"
      class="itbkk-modal-setting fixed inset-0 backdrop-blur-md flex justify-center items-center z-30">
      <div class="bg-[#18181B] rounded-lg w-[45rem] h-96 flex flex-col">
        <div class="flex justify-between">
          <h1 class="text-[#F5F5F5] text-opacity-80 font-bold text-2xl flex px-10 pt-6 tracking-wider">
            Add Collaborator
          </h1>
          <button class="self-start mr-8 mt-6" @click="addCollaboratorModal = false">
            <Xmark />
          </button>
        </div>
        <div class="divider m-0 "></div>
        <div class="p-8 pt-3 flex flex-col gap-y-6">
          <!-- board name input -->
          <div class="flex flex-row gap-3">
            <input class="py-1 text-start rounded-lg border border-[#71717A] indent-4 text-white w-full" :class="!isEmailValid ? 'border-red-500' : ''"
                  v-model="newCollaboratorModel.email" placeholder="Email" maxlength="50" />
            <div class="flex flex-row gap-3 dropdown dropdown-bottom">
              <button tabindex="0" role="button"
                class="flex items-center gap-x-5 bg-[#5A5A5A] bg-opacity-30 px-3 rounded text-white text-sm tracking-wider hover:bg-opacity-90">
                {{newCollaboratorModel.accessRight === 'READ' ? 'Read' : 'Write'}}
                <DropdownIcon />
              </button>
              <ul tabindex="0"
                class="dropdown-content z-[30] shadow border-[0.1px] border-opacity-25 border-[#CCB6B6] bg-[#18181B] rounded-md min-w-32 max-w-fit p-4 mt-1">
                <li class="cursor-pointer p-1 hover:rounded-md hover:bg-white hover:bg-opacity-10" @click="newCollaboratorModel.accessRight = 'READ'">
                  <p class="font-Inter text-center text-opacity-80 tracking-wider font-extralight text-white text-sm">
                    Read
                  </p>
                </li>
                <li class="cursor-pointer p-1 hover:rounded-md hover:bg-white hover:bg-opacity-10 mt-1" @click="newCollaboratorModel.accessRight = 'WRITE'">
                  <p class="font-Inter text-center text-opacity-80 tracking-wider font-extralight text-white text-sm">
                    Write
                  </p>
                </li>
              </ul>
            </div>
            <div></div>
          </div>
          <!-- Collaborators -->
          <div v-for="i in 7"></div>
          <!-- button -->
          <div class="flex justify-end items-center gap-x-[1rem] ">
            <button
              class="btn text-xs text-[#FFFFFF] tracking-widest bg-transparent text-opacity-70 border-none hover:bg-transparent"
              @click="cancelAddCollaboratorModal">
              Cancel
            </button>
            <button
              class="btn btn-sm px-8 text-xs tracking-widest bg-[#007305] bg-opacity-35 text-[#13FF80] text-opacity-85 hover:border-none hover:bg-base"
              :disabled="isButtonDisabled" @click="addNewCollaborator">
              Add
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- content -->
    <div class="m-10 p-10 bg-[#27272A] rounded-xl min-h-96">
      <table class="table border-collapse  text-center ">
        <thead class=" bg-[#141414] text-headline text-opacity-75 text-[16px] tracking-widest">
          <tr class="border-none">
            <th class="rounded-l-xl"></th>
            <th>
              No
            </th>
            <th>
              Name
            </th>
            <th>
              Email
            </th>
            <th>
              Access
            </th>
            <th class="rounded-r-xl"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(collaborator,index) in userStore.collaboratorManager.getCollaborators()"
            class="text-white border-none mt-1">
            <td></td>
            <td>{{ ++index }}</td>
            <td>{{collaborator.name}}</td>
            <td>{{collaborator.email}}</td>
            <td class="flex justify-center">
              <button
                class="flex items-center gap-x-5 bg-[#5A5A5A] bg-opacity-30 px-4 py-2 rounded-3xl text-white text-sm tracking-wider hover:bg-opacity-90">
                {{collaborator.accessRight}}
                <DropdownIcon />
              </button>
            </td>
            <td>
              <div class="btn btn-sm btn-outline btn-error">
                Remove
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped></style>
