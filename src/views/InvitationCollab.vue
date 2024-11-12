<script setup>
import { ref, onMounted, onBeforeMount, watch, reactive } from "vue"
import GroupCode from "@/components/icons/GroupCode.vue"
import UserSetting from "@/components/UserSetting.vue"
import InvitationIcon from "@/components/icons/InvitationIcon.vue"
import { useUtilityStore } from "@/stores/useUtilityStore.js"
import { acceptBoardCollabInvitation, declineBoardCollabInvitation } from "@/libs/FetchAPI.js"
import { useRoute } from "vue-router"
import router from "@/router/index.js"

const utilityStore = useUtilityStore()
const route = useRoute()

const acceptBoardInvitation = async(boardId) => {
  const acceptInvitationResponse = await acceptBoardCollabInvitation(boardId)
  acceptInvitationResponse.status === 200 ? router.push('/board') : ''
}

const denyBoardInvitation = async(boardId) => {
  const denyInvitationResponse = await declineBoardCollabInvitation(boardId)
  denyInvitationResponse.status === 200 ? router.push('/board') : ''
}

</script>

<template>
  <main class="fixed inset-0 z-30 w-screen h-screen overflow-y-auto bg-animation p-[8rem] pt-[4rem]">
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

    <!-- content -->
    <div class="flex flex-col items-center justify-center gap-4">
      <h1 class="font-Inter text-4xl text-white font-bold tracking-wide">You have invited !</h1>
      <InvitationIcon />
      <p class="font-Inter text-xl text-white tracking-wide">
        <span class="text-red-300">{{ utilityStore.invitationBoardInformation.owner?.name }}</span> 
          has invited you to collaborate with
        <span class="text-green-300">{{ utilityStore.invitationBoardInformation?.accessRight }}</span>  
          on 
        <span class="underline text-blue-400">{{ utilityStore.invitationBoardInformation?.name }}</span></p>
      <div class="flex items-center gap-10 tracking-wider">
        <button class="btn btn-error" @click="denyBoardInvitation(route.params.boardID)">Decline</button>
        <button class="btn btn-success" @click="acceptBoardInvitation(route.params.boardID)">Accept</button>
      </div>
    </div>
  </main>
</template>

<style scoped></style>