<script setup>
import { ref, reactive, computed, onBeforeMount, watch } from "vue"
import router from "@/router"
import Xmark from "@/components/icons/Xmark.vue"
import { useUtilityStore } from "@/stores/useUtilityStore.js"
import { useStatusStyleStore } from "@/stores/useStatusStyleStore"
import UserIcon from "@/components/icons/UserIcon.vue"
import LinkIcon from "@/components/icons/LinkIcon.vue"
import { toast } from "vue3-toastify"
import "vue3-toastify/dist/index.css"
import { useRoute } from "vue-router"

const route = useRoute()
const utilityStore = useUtilityStore()
const statusStyleStore = useStatusStyleStore()

// console.log(utilityStore.selectedBoard)
// const testBoardname = ref('ITBKK SIAM personal board')
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

</script>

<template>
    <div class="itbkk-modal-setting fixed inset-0 backdrop-blur-md flex justify-center items-center z-30">
        <div class="bg-[#18181B] rounded-lg w-[50rem] h-auto flex flex-col">
            <div class="flex flex-row justify-between">
                <p class="text-[#F5F5F5] text-opacity-80 font-bold text-2xl flex px-10 pt-6 pb-3 tracking-wider">
                    Share<span class="text-white">&nbsp{{ utilityStore.tasksManager.getTasks()[0]?.statuses3.boardId.name }}&nbsp</span>board
                </p>
                <button class="flex text-[#005BC4] text-lg self-end mb-3 items-center gap-2">
                    <span>
                        <LinkIcon />
                    </span>Copy Link
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
                        <input type="radio" name="radio-2" class="radio radio-primary" checked="checked" />
                        <p>No Access</p>
                    </div>
                    <div class="flex items-center gap-2 tracking-wider">
                        <input type="radio" name="radio-2" class="radio radio-primary" />
                        <p>Viewer</p>
                    </div>
                </div>

                <!-- People name search input -->
                <div>
                    <input class="py-2 text-start rounded-lg border border-[#71717A] indent-4 text-white w-full"
                        placeholder="Add People" maxlength="120" />
                </div>

                <!-- other people with acces -->
                <p class="text-[#F5F5F5] text-opacity-80 font-medium text-lg flex tracking-wider"> Other People with Access </p>
                <div v-for="(people, index) in testOtherpeopleData" :key="index">
                    <div class="flex text-white text-opacity-85 break-keep  gap-9">
                        <div class=" items-center tracking-wider justify-start">
                            <p>{{ people.name }}</p>
                            <p class="text-[#F5F5F5] text-opacity-50">{{ people.email }}</p>
                        </div>
                        <div class="flex items-center gap-2 tracking-wider">
                            <input type="radio" :name="`radio-${index+3}`" class="radio radio-primary" checked="checked" />
                            <p>Viewer</p>
                        </div>
                        <div class="flex items-center gap-2 tracking-wider">
                            <input type="radio" :name="`radio-${index+3}`" class="radio radio-primary" />
                            <p>Editor</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
