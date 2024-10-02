<script setup>
import { ref, reactive, computed, onBeforeMount, watch } from "vue"
import { updateBoardVisibility } from "@/libs/FetchAPI.js"
import router from "@/router"
import Xmark from "@/components/icons/Xmark.vue"
import { useUtilityStore } from "@/stores/useUtilityStore.js"
import { useStatusStyleStore } from "@/stores/useStatusStyleStore"
import UserIcon from "@/components/icons/UserIcon.vue"
import LinkIcon from "@/components/icons/LinkIcon.vue"
import { toast } from "vue3-toastify"
import "vue3-toastify/dist/index.css"
import { useRoute } from "vue-router"
import BoardVisibilityChange from "@/components/BoardVisibilityChange.vue"

const route = useRoute()
const utilityStore = useUtilityStore()
const currentVisibility = ref('')
const copyLinkClicked = ref(false)
const testOtherpeopleData = reactive([
    {
        name: "Natsaran Sae-oung",
        email: "natsaran@kmutt.ac.th"
    },
    {
        name: "Akkarawit Sittiprakran",
        email: "akkarawit@kmutt.ac.th"
    },
    {
        name: "Papangkorn Poomm",
        email: "papangkorn@kmutt.ac.th"
    },
])
const changeVisibilityBoardRadioClick = async (visibility) => {
    currentVisibility.value === visibility ? utilityStore.showChangeBoardVisibilityConfirmation = false : utilityStore.showChangeBoardVisibilityConfirmation = true
    currentVisibility.value = visibility
}

const copyToClipboard = async () => {
    window.location.origin.includes('localhost') ? await navigator.clipboard.writeText((window.location.origin + route.fullPath).slice(0, -6)) : 
    await navigator.clipboard.writeText(window.location.origin + `${import.meta.env.VITE_PROD_BASE_URL}` + route.fullPath.slice(0, -6))
    copyLinkClicked.value = true
}

const CancelChangeVisibilityBoard = () => {
    utilityStore.showChangeBoardVisibilityConfirmation = false
    currentVisibility.value === 'PRIVATE' ? currentVisibility.value = 'PUBLIC' : currentVisibility.value = 'PRIVATE'
}

const isRadioChecked = computed(() => {
    return currentVisibility.value
})

const changeVisibilityBoard = async () => {
    await updateBoardVisibility(route.params.boardID, currentVisibility.value)
    utilityStore.boardManager.changeVisibilityBoard(route.params.boardID, currentVisibility.value)
    utilityStore.showChangeBoardVisibilityConfirmation = false
}

onBeforeMount(async () => {
    copyLinkClicked.value = false
    currentVisibility.value = utilityStore.boardManager.getBoards().filter(board => board.id === route.params.boardID)[0].visibility
    console.log(currentVisibility.value)
    console.log(window.location.origin + route.fullPath)
    // await navigator.clipboard.writeText((window.location.origin + route.fullPath).slice(0, -6))
})

</script>

<template>
    <div class="itbkk-modal-setting fixed inset-0 backdrop-blur-md flex justify-center items-center z-30">
        <div class="bg-[#18181B] rounded-lg w-[50rem] h-auto flex flex-col">
            <div class="flex flex-row justify-between">
                <p class="text-[#F5F5F5] text-opacity-80 font-bold text-2xl flex px-10 pt-6 pb-3 tracking-wider">
                    Share<span class="text-white">&nbsp{{
                        utilityStore.tasksManager.getTasks()[0]?.statuses3.boardId.name }}&nbsp</span>board
                </p>
                <button class="flex text-[#005BC4] text-lg self-end mb-3 items-center gap-2" @click="copyToClipboard">
                    <LinkIcon />
                    <span v-if="copyLinkClicked"> Link copied to clipboard! </span>
                    <span v-else> Copy Link </span>
                </button>
                <button class="self-start mr-5 mt-5" @click="router.back">
                    <Xmark />
                </button>
            </div>
            <div class="divider m-0"></div>
            <div class="p-10 pt-5 flex flex-col gap-y-6">
                <div class="flex text-white text-opacity-85 break-keep items-center gap-9">
                    <span class="flex items-center gap-2 tracking-wider">
                        <UserIcon />Anyone with the link
                    </span>
                    <div class="flex items-center gap-2 tracking-wider">
                        <input type="radio" name="radio-2" :checked="isRadioChecked === 'PRIVATE'"
                            class="radio radio-primary" @click="changeVisibilityBoardRadioClick('PRIVATE')" />
                        <p>No Access</p>
                    </div>
                    <div class="flex items-center gap-2 tracking-wider">
                        <input type="radio" name="radio-2" :checked="isRadioChecked === 'PUBLIC'"
                            class="radio radio-primary" @click="changeVisibilityBoardRadioClick('PUBLIC')" />
                        <p>Viewer</p>
                    </div>
                </div>

                <!-- People name search input -->
                <div>
                    <input class="py-2 text-start rounded-lg border border-[#71717A] indent-4 text-white w-full"
                        placeholder="Add People" maxlength="120" />
                </div>

                <!-- other people with acces -->
                <p class="text-[#F5F5F5] text-opacity-80 font-medium text-lg flex tracking-wider"> Other People with
                    Access </p>
                <div v-for="(people, index) in testOtherpeopleData" :key="index">
                    <div class="flex text-white text-opacity-85 break-keep  gap-9">
                        <div class=" items-center tracking-wider justify-start">
                            <p>{{ people.name }}</p>
                            <p class="text-[#F5F5F5] text-opacity-50">{{ people.email }}</p>
                        </div>
                        <div class="flex items-center gap-2 tracking-wider">
                            <input type="radio" :name="`radio-${index + 3}`" class="radio radio-primary" />
                            <p>Viewer</p>
                        </div>
                        <div class="flex items-center gap-2 tracking-wider">
                            <input type="radio" :name="`radio-${index + 3}`" class="radio radio-primary" />
                            <p>Editor</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <BoardVisibilityChange v-if="utilityStore.showChangeBoardVisibilityConfirmation"/> -->
    <div v-if="utilityStore.showChangeBoardVisibilityConfirmation">
        <div class="fixed inset-0 backdrop-blur-md flex justify-center items-center z-30">
            <div class="itbkk-message bg-[#18181B] rounded-lg w-[34rem] h-auto flex flex-col">
                <h1 class="text-[#F5F5F5] font-bold text-2xl text-opacity-80 flex px-10 pt-9">
                    Board Visibility Change !
                </h1>
                <div class="divider m-2"></div>
                <div class="p-8 flex flex-col gap-y-6">
                    <p class="itbkk-button-message text-[#D69C27] text-opacity-75 mb-7">
                        Only the board owner can access and manage this board when it's set to private. Do you want to change the visibility to <span class="text-blue-500 font-bold underline underline-offset-2">{{currentVisibility === 'PUBLIC'? 'Public': 'Private'}}</span> ?
                    </p>
                    <div class="flex justify-end gap-x-[1rem]">
                        <button
                            class="itbkk-button-cancel btn text-xs font-semibold text-[#FFFFFF] bg-transparent text-opacity-70 border-none hover:bg-transparent"
                            @click="CancelChangeVisibilityBoard">
                            Cancel
                        </button>
                        <button
                            class="btn px-8 text-xs tracking-widest bg-[#007305] bg-opacity-35 text-[#13FF80] text-opacity-85 hover:border-none hover:bg-base"
                            @click="changeVisibilityBoard">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
