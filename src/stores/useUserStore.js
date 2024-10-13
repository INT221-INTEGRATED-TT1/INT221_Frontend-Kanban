import { reactive, ref } from "vue"
import {CollaboratorManagement} from "@/libs/CollaboratorManagement"
import { defineStore } from "pinia"

export const useUserStore = defineStore("userStore", () => {
    const collaboratorManager = ref(new CollaboratorManagement())
    const userIdentity = reactive({
        "role": "",
        "name": "",
        "oid": "",
        "email": "",
        "sub": "",
        "iat": 0,
        "exp": 0,
        "iss": ""
    })

    const getUserIdentity = () => {
        const JWT_TOKEN = localStorage.getItem("JWT_TOKEN");
        if (JWT_TOKEN) {
            const decodedData = window.atob(JWT_TOKEN.split('.')[1]);
            userIdentity = { ...JSON.parse(decodedData) }
        }
    }

    return {
        collaboratorManager,
        userIdentity,
        getUserIdentity,
    }
})