<script setup>
import router from "@/router"
import { reactive } from "vue"
import { createBoard } from "@/libs/FetchAPI.js"
import { useUserStore } from "@/stores/useUserStore"
import { useUtilityStore } from "@/stores/useUtilityStore.js"

const userStore = useUserStore()
const utilityStore = useUtilityStore()
const { userIdentity } = userStore
const newBoard = reactive({
  name: `${userIdentity.name} personal board`
})
const addNewBoard = async (newBoard) => {
  try {
    const response = await createBoard(newBoard)
    if (response.status === 201) {
      // console.log(response.data);
      utilityStore.boardManager.addBoard(response.data)
      router.push('/board')
    }
    else {
      console.log('something went wrong')
    }
  }
  catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="itbkk-modal-setting fixed inset-0 backdrop-blur-md flex justify-center items-center z-30">
    <div class="bg-[#18181B] rounded-lg w-[45rem] h-auto flex flex-col">
      <h1 class="text-[#F5F5F5] text-opacity-80 font-bold text-2xl flex px-10 pt-6 tracking-wider">
        Create new personal board
      </h1>
      <div class="divider m-0"></div>
      <div class="p-10 pt-5 flex flex-col gap-y-6">
        <div class="text-[#D69C27] text-opacity-85 break-keep tracking-wider">
          enter a name for your board. The name should not be empty and must be 120 characters or less.
        </div>

        <!-- board name input -->
        <div>
          <input class="py-2 text-start rounded-lg border border-[#71717A] indent-4 text-white w-full"
            placeholder="your board name" maxlength="120" v-model.trim="newBoard.name" />
          <span class="flex justify-end mt-2 text-xs required text-normal opacity-45">{{ newBoard.name.length }} /
            120</span>
        </div>
        <!-- button -->
        <div class="flex justify-end items-center gap-x-[1rem]">
          <button
            class="btn text-xs text-[#FFFFFF] tracking-widest bg-transparent text-opacity-70 border-none hover:bg-transparent"
            @click="router.push('/board')">
            Cancel
          </button>
          <button
            class="btn px-8 text-xs tracking-widest bg-[#007305] bg-opacity-35 text-[#13FF80] text-opacity-85 hover:border-none hover:bg-base"
            @click="addNewBoard(newBoard)">
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
