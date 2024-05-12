<script setup>
import {ref, onBeforeMount, reactive} from "vue"
import router from "@/router/index.js"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import {getAllStatuses} from "@/libs/FetchAPI"
import CreateTaskIcon from "@/components/icons/CreateTaskIcon.vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import TitleIcon from "@/components/icons/TitleIcon.vue"
import DeleteIcon from "@/components/icons/DeleteIcon.vue"
import DescIcon from "@/components/icons/DescIcon.vue"
import EditTaskStatus from "@/components/icons/EditStatusIcon.vue"
import {deleteStatuses, deleteStatusTransfer} from "@/libs/FetchAPI"
import Xmark from "@/components/icons/Xmark.vue"
import DropdownIcon from "@/components/icons/DropdownIcon.vue"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"
import AstronautStopSmile from "@/components/icons/AstronautStopSmile.vue"
import AstronautStopSignBlack from "@/components/icons/AstronautStopSignBlack.vue"

const utilityStore = useUtilityStore()
const disableBtn = ref(true)
const disableTransfer = ref(false)

const disabledActionButton = () => {
  for (const status of utilityStore.statusManager.getStatus()) {
    if (status.name === "No Status") {
      disableBtn.value = false
    }
  }
}

const deleteStatus = async (deleteId) => {
  // const tasks = utilityStore.tasksManager.getTasks()

  try {
    const response = await deleteStatuses(deleteId)
    if (response.status === 200) {
      utilityStore.statusManager.deleteStatus(deleteId)
      utilityStore.showDeleteConfirmation = false
      disableTransfer.value = false
      toast("Status has been deleted", {
        type: "success",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      })
    } else if (response.status === 500) {
      utilityStore.showDeleteConfirmation = false
      disableTransfer.value = true
      newStatus.name = utilityStore.statusTitle
      newStatus.color = utilityStore.selectedColor
      toast("Status has been use by another task", {
        type: "error",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      })
    }
  } catch {}
}

const deleteTransfer = async (oldDeleteId, newDeleteId) => {
  const response = await deleteStatusTransfer(oldDeleteId, newDeleteId)
  if (response.status === 200) {
    utilityStore.statusManager.deleteTransferStatus(oldDeleteId, newDeleteId)
    disableTransfer.value = false
    toast("Status has been deleted", {
      type: "success",
      timeout: 2000,
      theme: "dark",
      transition: "flip",
      position: "bottom-right",
    })
  }
}

const newStatus = reactive({
  id: "",
  name: "",
  description: "",
  color: "",
})

const selectStatus = (name, color, id) => {
  newStatus.name = name
  newStatus.color = color
  newStatus.id = id
}

onBeforeMount(async () => {
  try {
    const fetchData = await getAllStatuses()
    utilityStore.statusManager.addStatuses(fetchData)
    // console.log(utilityStore.statusManager.getStatus())
    // console.log(fetchData);
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <main class="w-screen h-screen overflow-y-auto bg-animation p-[4rem]">
    <div class="flex justify-between">
      <div>
        <router-link to="/">
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

      <div class="flex items-center gap-x-3">
        <!-- <span class="cursor-pointer"><FilterIcon /></span> -->
        <router-link to="/">
          <div
            class="itbkk-button-home bg-[#D9D9D9] text-base border-[#4C4C4C] border-[3px] px-3 py-[0.35rem] rounded-2xl tracking-wider hover:bg-transparent hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#B136FD] hover:from-[28%] hover:via-[#E95689] hover:via-[59%] hover:to-[#ED9E2F] hover:to-[88%] duration-500 ease-in-out cursor-pointer"
          >
            Home
          </div>
        </router-link>

        <router-link to="/status/add">
          <div
            class="border-secondary border-[0.1px] border-opacity-75 px-3 py-1 rounded-lg flex items-center gap-x-2 hover:bg-[#272727] hover:duration-[350ms] cursor-pointer"
          >
            <span><CreateTaskIcon /></span>
            <button class="itbkk-button-add text-normal text-opacity-75">
              New Status
            </button>
          </div>
        </router-link>
      </div>
    </div>

    <div class="pt-14">
      <table class="table border-collapse bg-[#141414] text-center">
        <thead
          class="itbkk-item bg-[#38383b] text-headline text-opacity-75 text-[16px] tracking-widest"
        >
          <tr>
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
          >
            <td class="w-[8rem]">{{ ++index }}</td>
            <td class="text-start w-[30rem]">
              <div
                class="rounded-2xl p-2 font-semibold text-[16px] w-fit px-5 text-center tracking-normal font-Inter"
                :class="utilityStore.statusCustomStyle(statuses.color)"
              >
                <span>
                  {{ statuses.name }}
                </span>
              </div>
            </td>
            <td class="text-start">{{ statuses.description }}</td>
            <td class="flex gap-x-3 justify-center items-center">
              <!-- <div class="flex gap-x-2"> -->
              <div
                class="tooltip tooltip-edit"
                :data-tip="
                  statuses.name === 'No Status'
                    ? 'Cannot Edit No Status'
                    : 'Edit'
                "
              >
                <button
                  @click="router.push(`/status/${statuses.id}/edit`)"
                  class="itbkk-button-edit"
                  :disabled="
                    statuses.name === 'No Status' ? disabledActionButton : false
                  "
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      statuses.name === 'No Status',
                  }"
                >
                  <EditTaskStatus />
                </button>
              </div>
              <div
                class="tooltip text-normal tooltip-error"
                :data-tip="
                  statuses.name === 'No Status'
                    ? 'Cannot Delete No Status'
                    : 'Delete'
                "
              >
                <button
                  class="itbkk-button-delete"
                  @click="
                    utilityStore.confirmDeleteStatus(
                      statuses.id,
                      statuses.name,
                      statuses.color
                    )
                  "
                  :disabled="
                    statuses.name === 'No Status' ? disabledActionButton : false
                  "
                  :class="{
                    'opacity-50 cursor-not-allowed ':
                      statuses.name === 'No Status',
                  }"
                >
                  <DeleteIcon width="22" height="31" />
                </button>
              </div>
              <!-- </div> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- transfer status -->
    <section
      v-show="disableTransfer"
      class="fixed inset-0 flex items-center justify-center backdrop-blur-md"
    >
      <div
        class="itbkk-modal-status w-[40rem] bg-[#1F1F1F] rounded-2xl py-10 transition ease-in-out px-12"
      >
        <h1
          class="text-[12px] text-headline text-opacity-[0.43] font-bold text-center mt-5 tracking-widest"
        >
          Transfer Status
        </h1>
        <!-- close modal -->
        <div class="flex justify-end">
          <button @click="disableTransfer = false">
            <span><Xmark /></span>
          </button>
        </div>
        <!-- close modal -->

        <div class="w-full flex pt-10 gap-x-5">
          <AstronautStopSignBlack
            v-show="newStatus.name === utilityStore.statusTitle ? true : false"
          />

          <AstronautStopSmile
            v-show="newStatus.name !== utilityStore.statusTitle ? true : false"
          />

          <div class="pt-16">
            <div class="tracking-wide text-opacity-[0.43]">
              There is some task associated with the
              <span
                class="font-bold tracking-wider"
                :style="{color: utilityStore.selectedColor}"
                >{{ utilityStore.statusTitle }}</span
              >
              status.
            </div>
            <div class="flex items-center pt-10 gap-x-5">
              <div class="font-Gemunu font-bold text-xl tracking-wider">
                Transfer to
              </div>
              <!-- Status -->
              <div class="dropdown dropdown-bottom">
                <div
                  tabindex="0"
                  role="button"
                  class="rounded-xl px-2 py-1 font-bold text-[16px] text-center tracking-wider flex items-center gap-x-3 break-all"
                  :class="utilityStore.statusCustomStyle(newStatus.color)"
                >
                  {{ newStatus.name }}
                  <span><DropdownIcon /></span>
                </div>

                <div
                  class="dropdown-content z-[1] menu shadow rounded-lg bg-[#3D3C3C] w-52 break-all max-h-52 overflow-y-scroll cursor-pointer"
                >
                  <ul tabindex="0">
                    <li
                      v-for="status in utilityStore.statusManager.getStatus()"
                      :key="status.id"
                      @click="
                        selectStatus(status.name, status.color, status.id)
                      "
                      :class="utilityStore.statusCustomStyle(status.color)"
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
            @click="disableTransfer = false"
            class="itbkk-button-cancel btn border-[#DB1058] px-14 bg-opacity-35 text-[#DB1058] w-[4rem] bg-button"
          >
            CANCEL
          </button>
          <button
            @click="deleteTransfer(utilityStore.selectedId, newStatus.id)"
            :disabled="newStatus.name === utilityStore.statusTitle"
            class="itbkk-button-confirm btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] bg-button"
          >
            SAVE
          </button>
        </div>
      </div>
    </section>
    <!-- transfer status -->

    <!-- delete confirmation -->
    <div>
      <div
        class="fixed inset-0 backdrop-blur-md flex justify-center items-center"
        v-if="utilityStore.showDeleteConfirmation"
      >
        <div
          class="itbkk-message bg-[#18181B] rounded-lg w-[30rem] h-[15rem] flex flex-col"
        >
          <h1
            class="text-[#DB1058] font-bold text-2xl text-opacity-80 flex px-10 pt-6"
          >
            Delete a Task
          </h1>
          <div class="divider m-0"></div>
          <div class="p-10 flex flex-col gap-y-6">
            <p
              class="itbkk-button-message even:text-[#ECECEC] text-opacity-75 break-all tracking-wide"
            >
              Do you want to delete status "<span
                class="font-bold tracking-wider"
                :style="{color: utilityStore.selectedColor}"
                >{{ utilityStore.statusTitle }}</span
              >" ?
            </p>
            <div class="flex justify-end">
              <button
                class="itbkk-button-cancel btn text-xs font-semibold px-[2rem] text-[#FFFFFF] bg-transparent text-opacity-70 border-none hover:bg-transparent"
                @click="utilityStore.showDeleteConfirmation = false"
              >
                Cancel
              </button>
              <button
                class="itbkk-button-confirm btn border-[#730000] text-xs font-bold px-[2rem] bg-[#730000] hover:bg-opacity-35 border-[##DB1058] hover:bg-[##730000] bg-opacity-[0.14] text-[#DB1058]"
                @click="deleteStatus(utilityStore.selectedId)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- delete confirmation -->
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
