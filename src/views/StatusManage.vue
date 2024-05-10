<script setup>
import {ref, onBeforeMount} from "vue"
import router from "@/router/index.js"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import {getAllStatuses} from "@/libs/FetchAPI"
import CreateTaskIcon from "@/components/icons/CreateTaskIcon.vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import TitleIcon from "@/components/icons/TitleIcon.vue"
import DeleteIcon from "@/components/icons/DeleteIcon.vue"
import DescIcon from "@/components/icons/DescIcon.vue"
import EditTaskStatus from "@/components/icons/EditStatusIcon.vue"

const utilityStore = useUtilityStore()

const disableBtn = ref(true)
const disabledActionButton = () => {
  for (const status of utilityStore.statusManager.getStatus()) {
    if (status.name === "No Status") {
      disableBtn.value = false
    }
  }
}

const deleteStats = async () => {}

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

        <router-link to="add">
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

    <section
      class="fixed inset-0 flex items-center justify-center backdrop-blur-md"
    >
      <div
        class="itbkk-modal-status w-[40rem] bg-[#1F1F1F] rounded-2xl py-10 transition ease-in-out"
      >
      
    </div>
    </section>

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
              class="itbkk-button-message even:text-[#ECECEC] text-opacity-75 break-all"
            >
              Do you want to delete status "<span
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
                @click="deleteTask(utilityStore.deleteStats)"
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
