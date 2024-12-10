<script setup>
import { ref, onMounted, onBeforeMount, computed, reactive, watch } from "vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import UserSetting from "@/components/UserSetting.vue"
import Xmark from "@/components/icons/Xmark.vue"
import router from "@/router/index.js"
import DropdownIcon from "@/components/icons/DropdownIcon.vue"
import { getCollaborators, getAllBoards, addCollaborator, deleteCollaborator, changeCollaboratorAccessRisght } from "@/libs/FetchAPI.js"
import { useUtilityStore } from "@/stores/useUtilityStore.js"
import { useRoute } from "vue-router"
import { useUserStore } from "@/stores/useUserStore"
import DeleteConfirmationCollab from "@/components/DeleteConfirmationCollab.vue"

const userStore = useUserStore()
const route = useRoute()
const utilityStore = useUtilityStore()
const addCollaboratorModal = ref(false)
const isEmailValid = ref(true)
const emailFieldErrorMassage = ref('something went wrong ! try againlater.')
const watchButtonDisable = ref(false)
const confirmChangeAccessRight = ref(false)
let collaboratorSelected = reactive({
  oid : '',
  name : '',
  email : '',
  accessRight : '',
  addedOn : '',
})
const newAccesRight = ref('')

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
    if(emailPattern.test(newCollaboratorModel.email)){
      isEmailValid.value = true
      console.log(newCollaboratorModel)
      const newCollaborator = await addCollaborator(route.params.boardID, newCollaboratorModel)

      const newFetchCollaboratorsForCollaboratorId = await getCollaborators(route.params.boardID)
      // console.log(fetchCollaborators.data)
      // userStore.collaboratorManager.addCollaborators(fetchCollaborators.data)

      if(newCollaborator.status === 201) {
        userStore.collaboratorManager.addCollaborator(newCollaborator.data, newFetchCollaboratorsForCollaboratorId.data)
        addCollaboratorModal.value = false
        newCollaboratorModel.email = ""
        newCollaboratorModel.accessRight = "READ"
      }
      else if (newCollaborator.status === 404) {
        emailFieldErrorMassage.value = 'The user does not exists.'
        isEmailValid.value = false
      }
      else if (newCollaborator.status === 409) {
        emailFieldErrorMassage.value = 'The user is already the collaborator of this board.'
        isEmailValid.value = false
      }
    } else{
      console.log("can't add new collab")
      emailFieldErrorMassage.value = 'something went wrong ! try againlater.'
      isEmailValid.value = false
      utilityStore.transactionDisable = true

    }
    
    // console.log('old : ' , oldCollaboratorModel)
    // return emailPattern.test(email);
}

const removeCollaborator = async (removeCollaboratorId) => {
      console.log(removeCollaboratorId)
      const collaboratorRemoved = await deleteCollaborator(route.params.boardID, removeCollaboratorId)
      collaboratorRemoved.status === 200 ? userStore.collaboratorManager.deleteCollaborator(removeCollaboratorId) : ''
      oldCollaboratorModel.email = ""
      oldCollaboratorModel.accessRight = "READ"
      utilityStore.showDeleteConfirmation = false
}

const cancelAddCollaboratorModal = () => {
  addCollaboratorModal.value = false
  newCollaboratorModel.email = ""
  newCollaboratorModel.accessRight = "READ"
  isEmailValid.value = true
  utilityStore.transactionDisable = false
}

const isButtonDisabled = computed(() => {
  oldCollaboratorModel.email !== newCollaboratorModel.email ? utilityStore.transactionDisable = false : oldCollaboratorModel.accessRight !== newCollaboratorModel.accessRight ? utilityStore.transactionDisable = false : utilityStore.transactionDisable = true
  
  // console.log('new : ' , newCollaboratorModel)
  // console.log('old : ' , oldCollaboratorModel)
  return !newCollaboratorModel.email || utilityStore.transactionDisable || (userStore.userIdentity.email === newCollaboratorModel.email) || watchButtonDisable.value
})


watch(newCollaboratorModel, (newValue, oldValue) => {
  // console.log(newValue)
  if (!emailPattern.test(newValue.email)) {
    watchButtonDisable.value = true
  }

  else if(userStore.userIdentity.email === newValue.email) {
    emailFieldErrorMassage.value = 'Board owner cannot be collaborator of his/her own board'
    isEmailValid.value = false
  }
  else {
    watchButtonDisable.value = false
    isEmailValid.value = true
  }
})

const changeAccessRightModal = (collaborator, changeAccesright) => {
  confirmChangeAccessRight.value = true
  collaboratorSelected = {...collaborator}
  newAccesRight.value = changeAccesright
}

const changeAccessRight = async () => {
  const changeAccessRightResponse =  await changeCollaboratorAccessRisght(route.params.boardID, collaboratorSelected.oid, newAccesRight.value)
  console.log(changeAccessRightResponse)
  userStore.collaboratorManager.changeCollaboratorAccessRight(collaboratorSelected.oid, newAccesRight.value)
  confirmChangeAccessRight.value = false
}

onBeforeMount(async () => {
  utilityStore.isOwnerBoard = false
  utilityStore.isInvitationActive = true
  utilityStore.selectedBoardId = route.params.boardID
  const JWT_TOKEN = localStorage.getItem("JWT_TOKEN");
  if (JWT_TOKEN) {
    const decodedData = window.atob(JWT_TOKEN.split('.')[1]);
    userStore.userIdentity = { ...JSON.parse(decodedData) }

    const fetchBoards = await getAllBoards()
    utilityStore.boardManager.addBoards(fetchBoards)

    utilityStore.boardManager.getBoards()?.personalBoards.forEach(board => board.id === route.params.boardID ? utilityStore.isOwnerBoard = true : "false")
    utilityStore.isOwnerBoard ? utilityStore.selectedBoard = {...utilityStore.boardManager.getBoards()?.personalBoards.filter(board => board.id === route.params.boardID)[0]} : 
    utilityStore.invitationBoardInformation = {...utilityStore.boardManager.getBoards()?.collaboratorBoards.find(board => board.id === route.params.boardID)}
    console.log("Owner Board : ", utilityStore.isOwnerBoard)
    // utilityStore.invitationBoardInformation = {...utilityStore.boardManager.getBoards()?.collaboratorBoards.find(board => board.id === route.params.boardID)}
  }
  else {
    console.log(route.fullPath)
    if(route.fullPath.includes("/collab/invitations")){
      localStorage.setItem("REDIRECT_FULLPATH", route.fullPath)
      router.push('/login')
      return
    }
  }

  try {
    const fetchCollaborators = await getCollaborators(route.params.boardID)
    userStore.collaboratorManager.addCollaborators(fetchCollaborators.data)
    console.log(userStore.collaboratorManager.getCollaborators())
    console.log(utilityStore.invitationBoardInformation)
    if(userStore.collaboratorManager.getCollaborators()?.some(collabUser => collabUser.oid === userStore.userIdentity.oid && collabUser.invitationStatus !== 'PENDING')){
      utilityStore.isInvitationActive = false
      console.log(utilityStore.isInvitationActive)
    }
  }
  catch (error) {
    // console.log("Error fetching Collaborators : ", error.status === 404)
    utilityStore.isInvitationActive = false
    error.status === 404 ? router.push({name: "not-found"})  : "router.push('/error')"
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
      <button @click="addCollaboratorModal = true" :disabled="!utilityStore.isOwnerBoard"
        :class="!utilityStore.isOwnerBoard ? 'bg-gray-600 bg-opacity-15 text-white text-opacity-15 tooltip tooltip-left cursor-not-allowed' : 'hover:bg-opacity-90'"
        class="flex items-center bg-[#E3E3E3] text-center py-2 px-5 rounded text-black text-sm font-semibold tracking-wid ">
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
          <button class="self-start mr-8 mt-6" @click="cancelAddCollaboratorModal">
            <Xmark />
          </button>
        </div>
        <div class="divider m-0 "></div>
        <div class="p-8 pt-3 flex flex-col">
          <!-- board name input -->
          <div class="flex flex-row gap-3">
            <input class="py-1 text-start rounded-lg border border-[#71717A] indent-4 text-white w-full"
              :class="!isEmailValid ? 'border-red-500' : ''" v-model.trim="newCollaboratorModel.email"
              placeholder="Email" maxlength="50" />
            <div class="flex flex-row gap-3 dropdown dropdown-bottom">
              <button tabindex="0" role="button"
                class="flex items-center gap-x-5 bg-[#5A5A5A] bg-opacity-30 px-3 rounded text-white text-sm tracking-wider hover:bg-opacity-90">
                {{newCollaboratorModel.accessRight === 'READ' ? 'Read' : 'Write'}}
                <DropdownIcon />
              </button>
              <ul tabindex="0"
                class="dropdown-content z-[30] shadow border-[0.1px] border-opacity-25 border-[#CCB6B6] bg-[#18181B] rounded-md min-w-32 max-w-fit p-4 mt-1">
                <li class="cursor-pointer p-1 hover:rounded-md hover:bg-white hover:bg-opacity-10"
                  @click="newCollaboratorModel.accessRight = 'READ'">
                  <p class="font-Inter text-center text-opacity-80 tracking-wider font-extralight text-white text-sm">
                    Read
                  </p>
                </li>
                <li class="cursor-pointer p-1 hover:rounded-md hover:bg-white hover:bg-opacity-10 mt-1"
                  @click="newCollaboratorModel.accessRight = 'WRITE'">
                  <p class="font-Inter text-center text-opacity-80 tracking-wider font-extralight text-white text-sm">
                    Write
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <p v-if="!isEmailValid" class="font-Inter text-[15px] ml-3 text-red-500 mt-1">{{ emailFieldErrorMassage }}</p>
          <!-- Collaborators -->
          <!-- <div v-for="i in 7"></div> -->
          <!-- button -->
          <div class="flex justify-end items-center gap-x-[1rem] mt-44">
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
          <tr v-if="userStore.collaboratorManager.getCollaborators().length === 0" class="border-none">
            <td colspan="6" class="text-center font-bold text-xl text-headline text-opacity-50 p-10 tracking-wide">
              No Collaborator
            </td>
          </tr>
          <tr v-else v-for="(collaborator,index) in userStore.collaboratorManager.getCollaborators()"
            class="text-white border-none mt-1" :class="collaborator.invitationStatus === 'PENDING' ? 'text-opacity-50' : 'opacity-100'">
            <td>
              <span v-if="collaborator.invitationStatus === 'PENDING'" class="relative flex h-3 w-3">
                
                <div class="tooltip" data-tip="invite pending">
                  <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-yellow-300"></span>
              </span>
              </div>
              </span>
            </td>
            <td>{{ ++index }}</td>
            <td>{{collaborator.name}}</td>
            <td>{{collaborator.email}}</td>
            <td class="flex justify-center ">
              <div class="dropdown dropdown-bottom">
                <button tabindex="0" role="button" :disabled="!utilityStore.isOwnerBoard"
                  :class="!utilityStore.isOwnerBoard ? 'bg-opacity-15 text-opacity-40 tooltip cursor-not-allowed' : ''"
                  class="flex items-center gap-x-2 bg-[#5A5A5A] bg-opacity-30 px-4 py-2 rounded-3xl text-white text-sm tracking-wider hover:bg-opacity-90">
                  {{ collaborator.accessRight }}
                  <div :class="!utilityStore.isOwnerBoard ? 'opacity-45' : ''"><DropdownIcon /></div>
                </button>
                <ul tabindex="0"
                  class="dropdown-content z-[30] shadow border-[0.1px] border-opacity-25 border-[#CCB6B6] bg-[#18181B] rounded-md min-w-28 max-w-fit p-3 mt-1">
                  <li class="cursor-pointer p-1 hover:rounded-md hover:bg-white hover:bg-opacity-10" @click="collaborator.accessRight === 'WRITE' ? changeAccessRightModal(collaborator, 'READ') : '' " >
                    <p class="font-Inter text-center text-opacity-80 tracking-wider font-extralight text-white text-sm">
                      Read
                    </p>
                  </li>
                  <li class="cursor-pointer p-1 hover:rounded-md hover:bg-white hover:bg-opacity-10 mt-1" @click="collaborator.accessRight === 'READ' ? changeAccessRightModal(collaborator, 'WRITE') : '' ">
                    <p class="font-Inter text-center text-opacity-80 tracking-wider font-extralight text-white text-sm">
                      Write
                    </p>
                  </li>
                </ul>
              </div>
            </td>
            <td>
              <!-- removeCollaborator(collaborator.oid) -->
              <button 
                :disabled="!utilityStore.isOwnerBoard && collaborator.oid !== userStore.userIdentity.oid"
                class="btn btn-sm btn-outline btn-error" 
                :class="collaborator.invitationStatus === 'PENDING' ? 'opacity-60' : 'opacity-100'"
                @click="utilityStore.confirmDeleteCollaborator(collaborator)"> 
                {{ collaborator.invitationStatus === 'PENDING' ? 'Cancel' : collaborator.oid !== userStore.userIdentity.oid ? 'Remove ' : 'Leave'}}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- change accesright modal -->
    <div v-if="confirmChangeAccessRight">
      <div class="fixed inset-0 backdrop-blur-md flex justify-center items-center z-30">
          <div class="itbkk-message bg-[#18181B] rounded-lg w-[45rem] h-auto flex flex-col">
            <h1 class="text-[#F5F5F5] font-bold text-2xl text-opacity-80 flex px-10 pt-9">
              Contributor Access Change !
            </h1>
            <div class="divider m-2"></div>
            <div class="p-8 flex flex-col gap-y-6">
              <p class="itbkk-button-message text-[#D69C27] text-opacity-75 mb-7">
                Do you want to change access right of "{{ collaboratorSelected.name }}" to "{{ newAccesRight }}" ?
              </p>
              <div class="flex justify-end gap-x-[1rem]">
                <button
                  class="itbkk-button-cancel btn text-xs font-semibold text-[#FFFFFF] bg-transparent text-opacity-70 border-none hover:bg-transparent"
                  @click="confirmChangeAccessRight = false">
                  Cancel
                </button>
                <button
                  class="btn px-8 text-xs tracking-widest bg-[#007305] bg-opacity-35 text-[#13FF80] text-opacity-85 hover:border-none hover:bg-base"
                  @click="changeAccessRight">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- delete confirmation -->
    <DeleteConfirmationCollab @remove-collaborator="removeCollaborator(utilityStore.collabSelected.oid)" />
    <!-- delete confirmation -->
  </main>
  <router-view />
</template>

<style scoped></style>
