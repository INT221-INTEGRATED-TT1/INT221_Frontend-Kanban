<script setup>
import { ref, onBeforeMount, reactive, watch } from "vue";
import router from "@/router/index.js";
import { useUtilityStore } from "@/stores/useUtilityStore.js";
import { useStatusStyleStore } from "@/stores/useStatusStyleStore.js";
import {useSortAndFilterStore} from "@/stores/useSortAndFilterStore.js"
import {useUserStore} from "@/stores/useUserStore"
import {
  deleteStatuses,
  getAllStatuses,
  getAllBoards,
  deleteStatusTransfer,
  findCollabById,
} from "@/libs/FetchAPI";
import StatusSetting from "@/components/StatusSetting.vue";
import CreateTaskIcon from "@/components/icons/CreateTaskIcon.vue";
import GroupCode from "@/components/icons/GroupCode.vue";
import TitleIcon from "@/components/icons/TitleIcon.vue";
import DeleteIcon from "@/components/icons/DeleteIcon.vue";
import DescIcon from "@/components/icons/DescIcon.vue";
import EditTaskStatus from "@/components/icons/EditStatusIcon.vue";
import Xmark from "@/components/icons/Xmark.vue";
import DropdownIcon from "@/components/icons/DropdownIcon.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import AstronautStopSmile from "@/components/icons/AstronautStopSmile.vue";
import AstronautStopSignBlack from "@/components/icons/AstronautStopSignBlack.vue";
import DeleteConfirmationStatus from "@/components/DeleteConfirmationStatus.vue";
import {useRoute} from "vue-router"
import SettingIcon from "@/components/icons/SettingIcon.vue";
import UserSetting from "@/components/UserSetting.vue"

const route = useRoute()
const utilityStore = useUtilityStore();
const statusStyleStore = useStatusStyleStore();
const sortAndFilterStore = useSortAndFilterStore()
const userStore = useUserStore()
const disableBtn = ref(true);

const disabledActionButton = () => {
  for (const status of utilityStore.statusManager.getStatus()) {
    if (status.statusName === "No Status") {
      disableBtn.value = false;
    }
  }
};

const deleteModal = (statuses) => {
  newStatus.name = statuses.name;
  newStatus.color = statuses.color;
  utilityStore.confirmDeleteStatus(statuses);
};

const deleteStatus = async (deleteId) => {
  // console.log(statuses.value)
  try {
    const response = await deleteStatuses(route.params.boardID, deleteId);
    if (response.status === 200) {
      utilityStore.statusManager.deleteStatus(deleteId);
      utilityStore.showDeleteConfirmation = false;
      utilityStore.disableTransfer = false;
      utilityStore.transactionDisable = false;
      toast("The status has been deleted", {
        type: "success",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const newTransferStatusId = ref(-1);

const deleteTransfer = async (oldDeleteId, newDeleteId) => {
  utilityStore.transactionDisable = true;

  const filterOldStatus = utilityStore.statusManager
    .getStatus()
    .filter((status) => status.id === oldDeleteId)[0];
  const filterNewStatus = utilityStore.statusManager
    .getStatus()
    .filter((status) => status.id === newDeleteId)[0];
  if (
    filterOldStatus.count + filterNewStatus.count >
      utilityStore.limitStatusNumber &&
    filterNewStatus.name !== "No Status" &&
    filterNewStatus.name !== "Done" &&
    utilityStore.isLimitEnable
  ) {
    newTransferStatusId.value = newDeleteId;
    toast(
      `Cannot transfer to ${filterNewStatus.name} number of tasks in ${filterOldStatus.name} status exceeds the limit. Please choose another status to transfer to.`,
      {
        type: "error",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      }
    );
    return;
  }
  const response = await deleteStatusTransfer(route.params.boardID, oldDeleteId, newDeleteId);
  if (response.status === 200) {
    utilityStore.statusManager.deleteTransferStatus(oldDeleteId, newDeleteId);
    utilityStore.disableTransfer = false;
    utilityStore.transactionDisable = false;
    toast("The task(s) have been transferred and the status has been deleted", {
      type: "success",
      timeout: 2000,
      theme: "dark",
      transition: "flip",
      position: "bottom-right",
    });
  } else if (response.status === 404) {
    utilityStore.disableTransfer = false;
    utilityStore.transactionDisable = true;

    toast("An  error has occurred, the status does not exist", {
      type: "error",
      timeout: 2000,
      theme: "dark",
      transition: "flip",
      position: "bottom-right",
    });
  }
};

const cancelTransferStatus = () =>{
  utilityStore.disableTransfer = false
  utilityStore.transactionDisable = false
}

const newStatus = reactive({
  id: -1,
  name: "",
  description: "",
  color: "",
});

const selectStatus = (status) => {
  // console.log(status)
  newStatus.name = status.name;
  newStatus.color = status.color;
  newStatus.id = status.id;
};

watch(newStatus, () => {
  newStatus.id !== newTransferStatusId.value
    ? (utilityStore.transactionDisable = false)
    : (utilityStore.transactionDisable = true);
});

onBeforeMount(async () => {
  utilityStore.isOwnerBoard = false
  const JWT_TOKEN = localStorage.getItem("JWT_TOKEN");
  if (JWT_TOKEN) {
    const decodedData = window.atob(JWT_TOKEN.split('.')[1]);
    userStore.userIdentity = { ...JSON.parse(decodedData) }

    const fetchBoards = await getAllBoards()
    utilityStore.boardManager.addBoards(fetchBoards[0])
    utilityStore.selectedBoardId = route.params.boardID
    utilityStore.boardManager.getBoards()?.personalBoards.forEach(board => board.id === route.params.boardID ? utilityStore.isOwnerBoard = true : "false")

    utilityStore.isOwnerBoard ? 
    utilityStore.selectedBoard = {...utilityStore.boardManager.getBoards()?.personalBoards.filter(board => board.id === route.params.boardID)[0]} : 
    utilityStore.selectedBoard = {...utilityStore.boardManager.getBoards()?.collaboratorBoards.filter(board => board.id === route.params.boardID)[0]}

    
    // utilityStore.boardManager.getBoards()?.collaboratorBoards.forEach(board => board.id === route.params.boardID ? utilityStore.isOwnerBoard = true : "false")
    console.log("Owner Board : ",utilityStore.isOwnerBoard)
    if(!utilityStore.isOwnerBoard){
      const collabIdentity = await findCollabById(route.params.boardID, userStore.userIdentity.oid)
      utilityStore.collabAccessRight = collabIdentity.accessRight
      console.log(collabIdentity.accessRight)
      collabIdentity.accessRight === 'WRITE' ? utilityStore.isOwnerBoard = true : utilityStore.isOwnerBoard = false
    }
  }
  try {
    const fetchData = await getAllStatuses(route.params.boardID);
    utilityStore.statusManager.addStatuses(fetchData);
    
    sortAndFilterStore.filterStatusArray = []
    for (const status of utilityStore.statusManager.getStatus()) {
      if (status.description === null) {
        status.description = "No description is provided";
      }
    }
    // console.log(utilityStore.statusManager.getStatus())
    utilityStore.isStatusesMounted = true
  } catch (error) {
    // localStorage.removeItem("JWT_TOKEN")
    // console.log("Error fetching tasks : ", error)
    // error.status === 404 ? router.push({name: 'not-found'}) : router.push('/error')
  }
});

</script>

<template>
  <main class="w-screen h-screen overflow-y-auto bg-animation p-[4rem]">
    <div class="flex justify-between">
      <div>
        <router-link to="/board">
          <!-- <h1
            class="text-headline font-extrabold text-3xl text-opacity-70 tracking-in-expand"
          >
            IT-BangMod Kradan Kanban
          </h1> -->
          <div class="flex items-center gap-3 font-semibold text-[#ffffff] text-3xl "> 
            <span class="text-headline text-sm text-opacity-50"> < </span>{{ utilityStore.selectedBoard.name }}
          </div>
        </router-link>

        <div class="opacity-0 ml-[22rem] ">
          <GroupCode />
        </div>
      </div>

      <div class="flex items-center gap-x-3">
        <!-- <span class="cursor-pointer"><FilterIcon /></span> -->
        <router-link :to="`/board/${route.params.boardID}/task`">
          <div
            class="itbkk-button-home bg-[#D9D9D9] text-base border-[#4C4C4C] border-[3px] px-3 py-[0.35rem] rounded-2xl tracking-wider hover:bg-transparent hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#B136FD] hover:from-[28%] hover:via-[#E95689] hover:via-[59%] hover:to-[#ED9E2F] hover:to-[88%] duration-500 ease-in-out cursor-pointer"
          >
            Tasks
          </div>
        </router-link>

        <router-link to="status/add">
          <button :disabled="!utilityStore.isOwnerBoard"
            :class="!utilityStore.isOwnerBoard ? 'bg-gray-600 bg-opacity-15 tooltip tooltip-top border-opacity-15 text-opacity-15 cursor-not-allowed'
            : 'border-opacity-75 hover:bg-[#272727] hover:duration-[350ms] cursor-pointer text-opacity-75'"
            data-tip="You need to be board owner to perform this action."
            class="itbkk-button-add border-secondary border-[0.1px] px-3 py-1 rounded-lg flex items-center gap-x-2 text-normal">
            <span :class="!utilityStore.isOwnerBoard ? 'opacity-15' : ''"><CreateTaskIcon /></span>
            <!-- <button class="itbkk-button-add text-normal text-opacity-75"> -->
              Add Status
            <!-- </button> -->
          </button>
        </router-link>

        <UserSetting />

        <button v-if="utilityStore.isOwnerBoard"
          class="itbkk-status-setting hover:bg-[#1f1f1f] px-1 tracking-wider rounded-xl border border-[#E3E3E3] border-opacity-50"
          @click="utilityStore.limitStatus"
        >
          <SettingIcon />
        </button>
      </div>
    </div>

    <div class="pt-14">
      <table class="table border-collapse bg-[#141414] text-center">
        <thead
          class="bg-[#38383b] text-headline text-opacity-75 text-[16px] tracking-widest"
        >
          <tr class="itbkk-item border-none">
            <th class="rounded-tl-xl"></th>
            <th>
              <div class="flex gap-x-3 items-center">
                <span><TitleIcon /></span>
                Name
              </div>
            </th>
            <th>
              <div class="flex gap-x-3 items-center">
                <span><DescIcon /></span>
                Description
              </div>
            </th>
            <th class="rounded-tr-xl">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(statuses, index) in utilityStore.statusManager.getStatus()"
            class="border-none"
          >
            <td class="w-[8rem] text-[#dcc6c6]">{{ ++index }}</td>
            <td class="itbkk-status-name text-start w-[30rem]">
              <div
                class="rounded-2xl p-2 font-semibold text-[16px] w-fit px-5 text-center tracking-normal font-Inter"
                :class="statusStyleStore.statusCustomStyle(statuses.color)"
              >
                <span>
                  {{ statuses.name }}
                </span>
              </div>
            </td>
            <td
              class="itbkk-status-description text-start"
              :class="
                statuses.description === 'No description is provided'
                  ? 'italic text-gray-500'
                  : 'text-[#F99B1D]'
              "
            >
              <div class="w-[20rem] truncate tracking-wider">
                {{ statuses.description }}
              </div>
            </td>
            <td v-if="utilityStore.isOwnerBoard" class="flex gap-x-3 justify-center items-center">
              <!-- <div class="flex gap-x-2"> -->
              <div
                class="tooltip tooltip-edit" :data-tip=" statuses.name === 'No Status' || statuses.name === 'Done' ? 'Cannot Edit' : 'Edit' ">
                <button
                  @click="router.push(`status/${statuses.id}/edit`)"
                  class="itbkk-button-edit"
                  :disabled="statuses.name === 'No Status' || statuses.name === 'Done' ? disabledActionButton : false"
                  :class="{'opacity-50 cursor-not-allowed': statuses.name === 'No Status' || statuses.name === 'Done',}">
                  <EditTaskStatus />
                </button>
              </div>
              <div
                class="tooltip text-normal tooltip-error":data-tip="statuses.name === 'No Status' || statuses.name === 'Done' ? 'Cannot Delete' : 'Delete'">
                <button
                  class="itbkk-button-delete"
                  @click="deleteModal(statuses)":disabled="statuses.name === 'No Status' || statuses.name === 'Done' ? disabledActionButton: false"
                  :class="{'opacity-50 cursor-not-allowed ': statuses.name === 'No Status' || statuses.name === 'Done',}" >
                  <DeleteIcon width="22" height="31" />
                </button>
              </div>
              <!-- </div> -->
            </td>
            <td v-else class="flex gap-x-3 justify-center items-center">
              <div class="tooltip tooltip-edit" data-tip="Cannot Edit" >
                <button class="itbkk-button-edit opacity-50 cursor-not-allowed " disabled="true" >
                  <EditTaskStatus />
                </button>
              </div>
              <div class="tooltip text-normal tooltip-error" data-tip="Cannot Delete" >
                <button class="itbkk-button-delete opacity-50 cursor-not-allowed " disabled="true" >
                  <DeleteIcon width="22" height="31"/>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- transfer status -->
    <section
      v-show="utilityStore.disableTransfer"
      class="fixed inset-0 flex items-center justify-center backdrop-blur-md"
    >
      <div
        class="itbkk-modal-status w-[45rem] bg-[#1F1F1F] rounded-2xl py-10 transition ease-in-out px-12"
      >
        <h1
          class="text-[12px] font-extrabold text-center mt-5 tracking-widest bg-transparent text-transparent bg-clip-text bg-gradient-to-r from-[#B136FD] from-[28%] via-[#E95689] via-[59%] to-[#ED9E2F] to-[88%]"
        >
          Transfer Status
        </h1>
        <!-- close modal -->
        <div class="flex justify-end">
          <button @click="utilityStore.disableTransfer = false">
            <span><Xmark /></span>
          </button>
        </div>
        <!-- close modal -->

        <div class="w-full flex pt-10 gap-x-5">
          <div>
            <AstronautStopSignBlack
              v-show="
                newStatus.name === utilityStore.statusTitle ? true : false
              "
            />

            <AstronautStopSmile
              v-show="
                newStatus.name !== utilityStore.statusTitle ? true : false
              "
            />
          </div>

          <div class="pt-16">
            <div class="tracking-wide text-opacity-[0.43] text-[#ECECEC]">
              There is some task associated with the
              <h1
                class="font-bold tracking-wider break-all"
                :style="{ color: utilityStore.selectedColor }"
              >
                {{ utilityStore.statusTitle }}
              </h1>
              status.
            </div>
            <div class="flex items-center pt-10 gap-x-5">
              <div
                class="font-Gemunu font-bold text-xl tracking-wider text-[#ECECEC]"
              >
                Transfer to
              </div>
              <!-- Status -->
              <div class="dropdown dropdown-bottom">
                <div
                  tabindex="0"
                  role="button"
                  class="rounded-xl px-2 py-1 font-bold text-[16px] text-center tracking-wider flex items-center mx-auto gap-x-3 max-w-[10rem] break-all"
                  :class="statusStyleStore.statusCustomStyle(newStatus.color)"
                >
                  <h1 class="truncate">{{ newStatus.name }}</h1>
                  <span><DropdownIcon /></span>
                </div>

                <div
                  class="dropdown-content z-[1] menu shadow rounded-lg bg-[#3D3C3C] w-52 block max-h-52 overflow-y-auto cursor-pointer"
                >
                  <ul
                    tabindex="0"
                    v-for="status in utilityStore.statusManager.getStatus()"
                    :key="status.id"
                  >
                    <li
                      v-if="utilityStore.selectedId !== status.id"
                      @click="selectStatus(status)"
                      :class="statusStyleStore.statusCustomStyle(status.color)"
                      class="p-1 hover:bg-[#4D4D4D] hover:text-[#D8D8D8] transition ease-in-out duration-200 rounded-md bg-transparent"
                    >
                      {{ status.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center pt-6 gap-x-5">
          <button
            @click="cancelTransferStatus()"
            class="itbkk-button-cancel btn border-[#DB1058] px-14 bg-opacity-35 text-[#DB1058] w-[4rem] hover:border-none bg-transparent hover:bg-base"
          >
            CANCEL
          </button>
          <button
            @click="deleteTransfer(utilityStore.selectedId, newStatus.id)"
            :disabled="
              newStatus.name === utilityStore.statusTitle ||
              utilityStore.transactionDisable
            "
            class="itbkk-button-confirm btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] border-[#007305] hover:border-none bg-transparent hover:bg-base"
          >
            SAVE
          </button>
        </div>
      </div>
    </section>
    <!-- transfer status -->

    <!-- status limit setting -->
    <StatusSetting />
    <!-- status limit setting -->

    <!-- delete confirmation Status -->
    <DeleteConfirmationStatus
      @delete-status="deleteStatus(utilityStore.selectedId)"
    />
    <!-- delete confirmation Status -->
  </main>

  <router-view />
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Gemunu+Libre:wght@200..800&display=swap");

.tooltip-error {
  --tooltip-color: #dc3b62;
  --tooltip-text-color: #dedfe0;
  font-weight: 300;
}

.tooltip-edit {
  --tooltip-color: #18181b;
  --tooltip-text-color: #dedfe0;
  font-weight: 300;
}
</style>
