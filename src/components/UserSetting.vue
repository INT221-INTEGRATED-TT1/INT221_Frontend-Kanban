<script setup>
import { useUserStore } from "@/stores/useUserStore"
import LogoutIcon from "@/components/icons/LogoutIcon.vue"
import DropdownIcon from "@/components/icons/DropdownIcon.vue"
import router from "@/router/index.js"
const userStore = useUserStore()

const logout = () => {
  localStorage.removeItem("JWT_TOKEN")
  router.push('/login')
}
</script>

<template>
  <div
    class="bg-[#1D1D1F] px-4 py-2 rounded-2xl flex items-center gap-x-2 hover:bg-[#272727] hover:duration-[350ms] dropdown dropdown-bottom dropdown-end">
    <div tabindex="0" role="button" class="itbkk-fullname flex items-center gap-2 text-normal font-Inter">
      {{ userStore.userIdentity.name }}
      <DropdownIcon />
    </div>
    <ul tabindex="0"
      class="dropdown-content z-[30] shadow border-[0.1px] border-opacity-25 border-[#CCB6B6] bg-[#18181B] rounded-md min-w-56 max-w-fit p-4 mt-1">
      <li class="p-1">
        <h3 class="font-Inter tracking-wider font-semibold text-white text-xl">
          {{ userStore.userIdentity.name }}
        </h3>
        <p class="font-Inter tracking-wider text-xs text-opacity-35 mt-1">
          @{{ userStore.userIdentity.role }}
        </p>
      </li>
      <div class="divider h-0 "></div>
      <li class="cursor-pointer p-1 hover:rounded-md hover:bg-white hover:bg-opacity-10" @click="logout()">
        <div class="flex justify-between">
          <span class="font-Inter text-opacity-80 tracking-wider font-extralight text-white text-sm">
            Logout
          </span>
          <LogoutIcon />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>