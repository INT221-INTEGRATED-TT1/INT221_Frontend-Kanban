<script setup>
import router from "@/router/index.js"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import CreateTaskIcon from "@/components/icons/CreateTaskIcon.vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import TitleIcon from "@/components/icons/TitleIcon.vue"
import StatusIcon from "@/components/icons/StatusIcon.vue"
import DeleteIcon from "@/components/icons/DeleteIcon.vue"
import EditTaskIcon from "@/components/icons/EditTaskIcon.vue"
import DescIcon from "@/components/icons/DescIcon.vue"
import EditTaskStatus from "@/components/icons/EditStatusIcon.vue"
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
            class="itbkk-manage-status bg-[#D9D9D9] text-base border-[#4C4C4C] border-[3px] px-3 py-[0.35rem] rounded-2xl tracking-wider hover:bg-transparent hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#B136FD] hover:from-[28%] hover:via-[#E95689] hover:via-[59%] hover:to-[#ED9E2F] hover:to-[88%] duration-500 ease-in-out cursor-pointer"
          >
            Home
          </div>
        </router-link>

        <router-link :to="{name: 'create-task-status'}">
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
          class="bg-[#38383b] text-headline text-opacity-75 text-[16px] tracking-widest"
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
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td class="flex gap-x-3 justify-center items-center">
              <!-- <div class="flex gap-x-2"> -->
              <div class="tooltip tooltip-edit" data-tip="Edit">
                <button><EditTaskStatus /></button>
              </div>
              <div class="tooltip tooltip-error text-normal" data-tip="Delete">
                <button><DeleteIcon width="22" height="31" /></button>
              </div>
              <!-- </div> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
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
