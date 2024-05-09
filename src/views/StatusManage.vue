<script setup>
import {ref, onBeforeMount} from "vue"
import router from "@/router/index.js"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import {getAllStatuses} from "@/libs/FetchAPI"
import CreateTaskIcon from "@/components/icons/CreateTaskIcon.vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import TitleIcon from "@/components/icons/TitleIcon.vue"
import StatusIcon from "@/components/icons/StatusIcon.vue"
import DeleteIcon from "@/components/icons/DeleteIcon.vue"
import EditTaskIcon from "@/components/icons/EditTaskIcon.vue"
import DescIcon from "@/components/icons/DescIcon.vue"
import EditTaskStatus from "@/components/icons/EditStatusIcon.vue"

const utilityStore = useUtilityStore()

onBeforeMount(async () => {
  try {
    const fetchData = await getAllStatuses()
    utilityStore.statusManager.addStatuses(fetchData)
    console.log(utilityStore.statusManager.getStatus())

    // console.log(fetchData);
  } catch (error) {
    console.log(error)
  }
})

const disableBtn = ref(true)
const disabledActionButton = () => {
  for (const status of utilityStore.statusManager.getStatus()) {
    if (status.name === "No Status") {
      disableBtn.value = false
    }
  }
}
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
              <div class="tooltip tooltip-edit" :data-tip="statuses.name === 'No Status' ? '' : 'Edit' ">
                <button
                  @click="router.push(`/status/${statuses.id}/edit`)"
                  class="itbkk-button-edit"
                  :disabled="statuses.name === 'No Status' ? disabledActionButton : false"
                  :class="{'opacity-50 cursor-not-allowed': statuses.name === 'No Status'}"
                >
                  <EditTaskStatus />
                </button>
              </div>
              <div class="tooltip text-normal tooltip-error" :class="statuses.name === 'No Status' ? '': ''" :data-tip="statuses.name === 'No Status' ? '' : 'Delete'">
                <button
                  class="itbkk-button-delete"
                  :disabled="statuses.name === 'No Status' ? disabledActionButton : false"
                  :class="{'opacity-50 cursor-not-allowed': statuses.name === 'No Status'}"
                >
                  <DeleteIcon width="22" height="31" />
                </button>
              </div>
              <!-- </div> -->
            </td>
            <!-- <td v-else class="flex gap-x-3 justify-center items-center">
              <div class="tooltip tooltip-edit" data-tip="Edit">
                <button class="itbkk-button-edit opacity-50 disabled">
                  <EditTaskStatus />
                </button>
              </div>
              <div class="tooltip tooltip-error text-normal" data-tip="Delete">
                <button class="itbkk-button-delete opacity-50 disabled ">
                  <DeleteIcon width="22" height="31" />
                </button>
              </div>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
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
