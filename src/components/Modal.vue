<script setup>
import {ref} from "vue"
</script>

<template>
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
            Do you want to delete status "{{ utilityStore.statusTitle }}"?
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
              @click="deleteTask(utilityStore.selectedId)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- delete confirmation -->
</template>

<style scoped></style>
