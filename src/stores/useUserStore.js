import { reactive, ref } from "vue"
import { defineStore } from "pinia"

export const useUserStore = defineStore("userStore", () => {
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

    return {
        userIdentity,
    }
})