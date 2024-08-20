<script setup>
import LoginPoster from '../components/icons/LoginPoster.vue'
import loginPoster from '../components/icons/loginPoster.png'
import loginPoster3 from '../components/icons/loginPoster3.png'
import MicrosoftLogo from '../components/icons/MicrosoftLogo.vue'
import errorIcon from '../components/icons/errorLoginIcon.vue'
import warningIcon from '../components/icons/WarningIcon.vue'

import { ref, reactive, watch, computed } from "vue"

const username = ref('')
const password = ref('')
const errorLogin = ref(false)
const problemLogin = ref(false)
const disableLoginBtn = ref(false)

const isLoginButtonDisabled = computed(() => {
    // console.log(username.value, typeof(password.value))
    return !(username.value.length > 0 && password.value.length > 0) || disableLoginBtn.value
})

const checkLoginUser = () => {
    if(username.value.length > 50  || password.value.length > 14) {
        errorLogin.value = true
        problemLogin.value = false
        // disableLoginBtn.value = true
        return
    }
    else{
        //errorLogin.value = false
        //problemLogin.value = true
        // errorLogin.value = true
        // problemLogin.value = false
    }
}

</script>

<template>
    <div class="min-h-screen min-w-screen flex bg-[#1F1F1F]">
        <div class="w-2/5 flex items-center justify-center font-Inter tracking-wider">
            <div class="w-full max-w-md p-8 rounded-lg">
                <h1 class="text-5xl text-white mb-3">Welcome Back</h1>
                <h2 class="text-base opacity-30 ml-1 text-white mb-5">Welcome back! Please enter your detail</h2>
                <div v-if="errorLogin" class="itbkk-message w-full flex bg-[#3D1A1A] text-[#E80F0F] py-5 font-thin justify-center items-center tracking-widest gap-1 border border-[#FF0000] rounded-md">
                    <div class="mx-3 p-2"><errorIcon /></div> Username or Password is incorrect.
                </div>
                <div v-if="problemLogin" class="itbkk-message w-full flex bg-[#2E360D] text-[#FFA800] py-5 font-thin justify-center items-center tracking-widest gap-1 border border-[#FF9900] rounded-md">
                    <div class="mx-3 p-2"><warningIcon /></div> There is a problem. Please try again later.
                </div>
                <div class="mb-6 font-Geist">
                    <label for="itbkk-username" class="block pt-5 text-white opacity-40">Username</label>
                    <input id="itbkk-username" class="itbkk-username mt-2 block w-full p-3 border border-[#373737] focus:border-white rounded-md shadow-sm focus:outline-none
                        bg-[#1F1F1F] placeholder-white placeholder-opacity-30" 
                        placeholder="Enter your username"
                        v-model="username"
                        maxlength="50"
                        >
                </div>
                <div class="mb-6 font-Geist">
                    <label for="itbkk-password" class="block text-white opacity-40">Password</label>
                    <input type="password" id="itbkk-password" class="itbkk-password mt-2 block w-full p-3 border border-[#373737] focus:border-white rounded-md shadow-sm focus:outline-none
                        bg-[#1F1F1F] placeholder-white placeholder-opacity-30" 
                        placeholder="Enter your password"
                        v-model="password"
                        maxlength="14"
                        >
                </div>
                <button class="itbkk-button-signin w-full btn bg-white hover:bg-black hover:text-white text-black py-3 font-Geist font-medium rounded-md transition"
                    :disabled="isLoginButtonDisabled"
                    @click="checkLoginUser">
                    Sign In
                </button>
                <button class="w-full btn mt-5 bg-[#2F2F2F] hover:bg-black hover:text-white text-white py-3 font-Geist font-medium rounded-md transition">
                    <div class="flex justify-center items-center gap-2">
                        <MicrosoftLogo />Sign in with Microsoft
                    </div>
                </button>
            </div>
        </div>

        <!-- <div class="w-1/2 flex items-center justify-start">
             <LoginPoster />
        </div> -->

        <div class="w-3/5 flex">
            <div class="w-full h-full bg-center bg-cover" :style="{ backgroundImage: `url(${loginPoster3})` }"></div>
        </div>
        <!-- <div class="w-2/3 flex">
            <div class="w-full h-full bg-center bg-cover"
                :style="{ backgroundImage: `url(https://cdn.discordapp.com/attachments/1227109861922308170/1273681182781079603/abstract-samsung-background-digital-art-4k-wallpaper-uhdpaper.com-1260h.jpg?ex=66bf7f89&is=66be2e09&hm=28637ed2d2425ac9028047dc2e958271883aa7a43835fe473606de1cd95a262f&)` }">
            </div>
        </div> -->

    </div>
</template>

<style scoped></style>