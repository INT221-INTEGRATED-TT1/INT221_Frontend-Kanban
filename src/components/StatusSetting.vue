<script setup>
import {ref,computed,watch} from "vue"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import {useStatusStyleStore} from "@/stores/useStatusStyleStore"
import WarningIcon from "@/components/icons/WarningIcon.vue"

const utilityStore = useUtilityStore()
const isLimitEnable = ref(false)
const statusStyleStore = useStatusStyleStore()
const inputLimitNumber = ref(10)

const computeExceedTaskLimit = computed(()=>{
  return utilityStore.statusManager.getStatus().filter(status => status.count >= inputLimitNumber.value)
})
// watch((inputLimitNumber) ,(newValue)=>{
//   console.log(newValue);
// })
</script>

<template>
  <div
    class="fixed inset-0 backdrop-blur-md flex justify-center items-center z-30"
    v-if="utilityStore.showStatusSettingMenu"
  >
    <div
      class="itbkk-message bg-[#18181B] rounded-lg w-[35rem] h-auto flex flex-col"
    >
      <h1
        class="text-[#F5F5F5] text-opacity-80 font-bold text-2xl flex px-10 pt-6"
      >
        Status Setting
      </h1>
      <div class="divider m-0"></div>
      <div class="p-10 flex flex-col gap-y-6">
        <div
          class="itbkk-button-message text-[#D8D8D8] text-opacity-75 break-keep tracking-wide"
        >
          User can limit the number of tasks in a status by setting the Maximum
          tasks in each status.
          <div>
            (except
            <span class="text-[#ECECEC] text-opacity-90">"No Status"</span> and
            <span class="text-[#65EE6C] text-opacity-65">"Done"</span>)
          </div>
        </div>

        <!-- toggle limit -->
        <div class="flex gap-x-5 items-center">
          <label class="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="isLimitEnable"
              class="sr-only peer"
            />
            <div
              class="relative w-11 h-6 bg-transparent peer-focus:outline-none ring-2 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#406EF0]"
            ></div>
            <span
              class="ms-3 text-sm font-medium text-[#FFFFFF] dark:text-gray-300 tracking-wider"
              >{{ isLimitEnable ? "Enabled" : "Disabled" }}</span
            >
          </label>

          <input
            class="w-[5rem] p-1 rounded-lg text-center pl-5 border border-[#71717A]"
            v-model="inputLimitNumber"
            type="number"
            min="1"
            :disabled="!isLimitEnable"
            :class="{'cursor-not-allowed': isLimitEnable === false}"
          />
        </div>

        <div class="flex gap-x-3 items-center" v-show="isLimitEnable">
          <WarningIcon />

          <div class="text-[13px] text-[#D69C27] tracking-wider">
            These statuses that have reached the task limit No additional tasks
            can be added to these statuses at this time.
          </div>
        </div>
        <div class="flex flex-wrap w-full gap-3 " v-show="isLimitEnable">
          <div
            v-for="(status, index) in computeExceedTaskLimit"
            :key="index"
            class="rounded-2xl py-1 px-3 text-[14px] w-fit font-bold border border-[#2e2e2e]   truncate text-center tracking-normal font-Inter "
            :class="statusStyleStore.statusCustomStyle(status.color)"

          >
            {{ status.name }}
          </div>
        </div>

        <!-- button -->
        <div class="flex justify-end gap-x-[1rem]">
          <button
            class="itbkk-button-cancel btn text-xs text-[#FFFFFF] tracking-widest bg-transparent text-opacity-70 border-none hover:bg-transparent"
            @click="utilityStore.showStatusSettingMenu = false"
          >
            Cancel
          </button>
          <button
            class="itbkk-button-confirm btn text-xs tracking-widest bg-[#007305] bg-opacity-35 text-[#13FF80] hover:border-none hover:bg-base"
            @click=""
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
