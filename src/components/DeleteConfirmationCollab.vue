<script setup>
import { useUtilityStore } from "@/stores/useUtilityStore.js";

const utilityStore = useUtilityStore();
defineEmits(["removeCollaborator"]);

const cancelDeleteCollaborator = () => {
  utilityStore.showDeleteConfirmation = false;
  utilityStore.transactionDisable = false;
};
</script>
 
<template>
  <!-- delete confirmation Collab -->
  <div>
    <div v-if="utilityStore.showDeleteConfirmation" class="fixed inset-0 backdrop-blur-md flex justify-center items-center">
      <div class="itbkk-message bg-[#18181B] rounded-lg w-[36rem] h-auto flex flex-col">
        <h1 class="text-[#DB1058] font-bold text-2xl text-opacity-80 flex px-10 pt-6">
          Remove a Collaborator
        </h1>
        <div class="divider m-0"></div>
        <div class="p-10 flex flex-col gap-y-4">
          <p class="itbkk-button-message text-normal dark:text-[#ECECEC] text-opacity-75 break-all tracking-wide">
            Do you want to remove {{ utilityStore.collabSelected.name }} from the board?
          </p>
          <div class="flex justify-end gap-x-[1rem]">
            <button
              class="itbkk-button-cancel btn text-xs font-semibold text-[#FFFFFF] bg-transparent text-opacity-70 border-none hover:bg-transparent"
              @click="cancelDeleteCollaborator">
              Cancel
            </button>
            <button
              class="itbkk-button-confirm btn border-[#730000] text-xs font-bold bg-[#730000] hover:bg-opacity-35 border-[##DB1058] hover:bg-[##730000] bg-opacity-[0.14] text-[#DB1058] hover:border-none hover:bg-base"
              @click="$emit('removeCollaborator')">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- delete confirmation Collab -->
</template>
 
<style scoped>
</style>