<script setup>
import {ref, reactive, computed, onBeforeMount, watch, nextTick} from "vue"
import {createTask, getAllBoards, findCollabById, uploadFile, downloadFile} from "@/libs/FetchAPI"
import router from "@/router"
import Xmark from "@/components/icons/Xmark.vue"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import {useStatusStyleStore} from "@/stores/useStatusStyleStore"
import DropdownIcon from "@/components/icons/DropdownIcon.vue"
import StatusDetail from "@/components/icons/StatusDetail.vue"
import AssigneeDetail from "@/components/icons/AssigneeDetail.vue"
import WarningIcon from "@/components/icons/WarningIcon.vue"
import AttachIcon from "@/components/icons/AttachIcon.vue"
import CloudUploadIcon from "@/components/icons/CloudUploadIcon.vue"
import DocumentIcon from "@/components/icons/DocumentIcon.vue"
import ImageFileIcon from "@/components/icons/ImageFileIcon.vue"
import PDFIcon from "@/components/icons/PDFIcon.vue"
import VideoFileIcon from "@/components/icons/VideoFileIcon.vue"
import ZIPIcon from "@/components/icons/ZIPIcon.vue"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"
import {useRoute} from "vue-router"
import { useUserStore } from "@/stores/useUserStore"
const userStore = useUserStore()
const route = useRoute()
const utilityStore = useUtilityStore()
const statusStyleStore = useStatusStyleStore()


const isUploading = ref(false)

const newStatus = reactive({
  id: -1,
  name: "",
  description: "",
  color: "",
})

const newTask = reactive({
  title: "",
  description: "",
  assignees: "",
  status3: newStatus.id,
})

const selectStatus = (name, color, id) => {
  newStatus.name = name
  newStatus.color = color
  newStatus.id = id
  newTask.status3 = id
}

const filterStatus = ref({})

const isButtonDisabled = computed(() => {
  if (newStatus.id !== filterStatus.value.id && utilityStore.isLimitEnable) {
    utilityStore.transactionDisable = false
  } else if (
    newStatus.id === filterStatus.value.id &&
    utilityStore.isLimitEnable
  ) {
    utilityStore.transactionDisable = true
  }
  return !newTask.title || utilityStore.transactionDisable
})

const createNewTask = async () => {
  utilityStore.transactionDisable = true
  const filterStatusId = utilityStore.statusManager
    .getStatus()
    .filter((status) => status.id === newStatus.id)

  filterStatus.value = filterStatusId[0]
  if (
    filterStatusId[0].count >= utilityStore.limitStatusNumber &&
    utilityStore.isLimitEnable === true &&
    filterStatusId[0].name !== "No Status" &&
    filterStatusId[0].name !== "Done" &&
    utilityStore.isLimitEnable
  ) {
    toast(
      `The Status ${newStatus.name} will have to many tasks. Please make progress and update status of existing tasks first.`,
      {
        type: "error",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      }
    )
    utilityStore.transactionDisable = true
    return
  }

  try {
    const response = await createTask(route.params.boardID, newTask)
    if (response.status === 201) {
      utilityStore.tasksManager.addTask(response.data)
      utilityStore.statusManager.getStatus()[utilityStore.statusManager.getStatus().findIndex((status) => status.id === newStatus.id)].count += 1

      filterStatus.value = {}
      
      if (selectedFiles.value.length > 0) {
        isUploading.value = true
        const responseUploadedFile = await uploadFile(route.params.boardID, response.data.id, selectedFiles.value)
        if (responseUploadedFile.status === 200) {
          isUploading.value = false
          // router.push(`/board/${utilityStore.selectedBoardId}/task`)
          utilityStore.transactionDisable = false
        }
      }
      setTimeout(() => {
        toast("The task has been successfully added", {
          type: "success",
          timeout: 2000,
          theme: "dark",
          transition: "flip",
          position: "bottom-right",
        })
      }, 200)
      router.push(`/board/${utilityStore.selectedBoardId}/task`)
    } else if (response.status === 400) {
      utilityStore.transactionDisable = false
      toast("Please fill in the required fields", {
        type: "error",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      })
    }

  } catch (error) {
    console.log(error)
  }
}

const selectedFiles = ref([])
// const fileUploaded = ref([])

// Function to check if a file exists in an array based on specific properties
const isInArray = (array, file) => {
  return array.some(item =>
    item.name === file.name &&
    item.size === file.size &&
    item.type === file.type &&
    item.lastModified === file.lastModified
  );
};

const handleFileUpload = (event) => {
  let newSelectedFilesArray = Array.from(event.target.files)
  let fileOverMaxSize = newSelectedFilesArray.filter(file => (file.size / (1024 * 1024)) > 20)

  if (newSelectedFilesArray.length > 0) {
    // Filter files that are not already in selectedFiles.value
    const fileNotExistSelected = newSelectedFilesArray.filter(file => !isInArray(selectedFiles.value, file) && (file.size / (1024 * 1024) <= 20))

    // Append the new files
    selectedFiles.value.push(...fileNotExistSelected)
  }
  
  if(fileOverMaxSize.length > 0 && selectedFiles.value.length > 0){
    let fileOverMaxLength = selectedFiles.value.slice(10, selectedFiles.value.length )
    selectedFiles.value.splice(10, selectedFiles.value.length - 10)
    let errorFilesCombined = fileOverMaxSize.concat(fileOverMaxLength)
    let errorMessage = ''
    errorFilesCombined.forEach(file => errorMessage += "\n" + "- " + file.name)
    toast(
      `- Each task can have at most 20 files. \n - Each file cannot be larger than 200 MB. \n The following files are not added: ${errorMessage} `,
      {
        type: "error",
        timeout: 5000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
        style: {
          width: "500px", // Adjust the width as needed
          maxWidth: "90%", // Prevent it from being too wide on smaller screens
        },
      }
    )
  }

  else if(fileOverMaxSize.length > 0){
    let errorFiles = fileOverMaxSize
    let errorMessage = ''
    errorFiles.forEach(file => errorMessage += "\n" + "- " + file.name)
    toast(
      `Each file cannot be larger than 20 MB. The following files are not added: ${errorMessage} `,
      {
        type: "error",
        timeout: 5000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
        style: {
          width: "500px", // Adjust the width as needed
          maxWidth: "90%", // Prevent it from being too wide on smaller screens
        },
      }
    )
  }

  else if (selectedFiles.value.length > 10) {
    let errorFiles = selectedFiles.value.slice(10, selectedFiles.value.length)
    
    let errorMessage = ''
    errorFiles.forEach(file => errorMessage += "\n" + "- " + file.name)
    selectedFiles.value.splice(10, selectedFiles.value.length - 10)
    toast(
      `Each task can have at most 10 files. The following files are not added: ${errorMessage} `,
      {
        type: "error",
        timeout: 5000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
        style: {
          width: "500px", 
          maxWidth: "90%", 
        },
      }
    )
  }
}


const cancelSelectedFile = (seletedFile) => {
  let deleteFileIndex = selectedFiles.value.findIndex(file => {
    file.name === seletedFile.name &&
    file.size === seletedFile.size 
  })
  selectedFiles.value.splice(deleteFileIndex, 1)
}

const getFile = async (file) => {
  const url = window.URL.createObjectURL(file)
  const fileType = file.type
  const supportedTypes = [
    "text/plain",       // .txt
    "application/rtf",  // .rtf
    "image/jpeg",       // .jpg
    "image/png",        // .png
    "application/pdf"   // .pdf
  ];
  if (supportedTypes.includes(fileType)) {
    // Open in a new tab for supported types
    window.open(url, "_blank");
  } else {
    // Trigger download for unsupported types
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

const computedFilesSize = computed(() => {
  if(selectedFiles.value.length > 0) {
    return (selectedFiles.value.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)).toFixed(2)
  }
  return 0
})

onBeforeMount(async () => {
  utilityStore.isOwnerBoard = false
  const JWT_TOKEN = localStorage.getItem("JWT_TOKEN");
  if (JWT_TOKEN) {
    try {
      const fetchBoards = await getAllBoards()
      utilityStore.boardManager.addBoards(fetchBoards)
      utilityStore.selectedBoardId = route.params.boardID

      utilityStore.boardManager.getBoards()?.personalBoards.forEach(board => board.id === route.params.boardID ? utilityStore.isOwnerBoard = true : "false")

      if (!utilityStore.isOwnerBoard) {
        const collabIdentity = await findCollabById(route.params.boardID, userStore.userIdentity.oid)
        utilityStore.collabAccessRight = collabIdentity.accessRight
        collabIdentity.accessRight === 'WRITE' ? utilityStore.isOwnerBoard = true : utilityStore.isOwnerBoard = false
      }

      const firstStatus = utilityStore.statusManager.getStatus()[0]

      newTask.status3 = newStatus.id = firstStatus.id
      newStatus.name = firstStatus.name
      newStatus.description = firstStatus.description
      newStatus.color = firstStatus.color

    } catch (error) {
      console.log(error)
      router.push('/error')
      return
    }
  }
  
  if (!utilityStore.isOwnerBoard) {
        router.push('/error')
        return
      }
})
</script>

<template>
  <section
    class="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-md"
  >
    <div
      class="w-[60rem] bg-[#1F1F1F] rounded-2xl px-24 py-10 transition ease-in-out"
    >
      <h1
        class="text-[12px] text-headline text-opacity-[0.43] font-bold text-center mt-5 tracking-wider"
      >
        Create Task
      </h1>
      <!-- close modal -->
      <div class="flex justify-end">
        <button
          @click="router.push(`/board/${utilityStore.selectedBoardId}/task`)"
        >
          <span>
            <Xmark />
          </span>
        </button>
      </div>

      <div class="flex flex-col gap-y-7">
        <!-- Title -->
        <div>
          <textarea
            class="itbkk-title bg-[#1A1B1D] rounded-xl outline-none resize-none w-full text-2xl font-semibold text-headline mt-5 p-4 pl-6"
            maxlength="100"
            placeholder="Enter Task Title"
            required
            v-model.trim="newTask.title"
          >
          </textarea>
          <span class="required flex justify-end text-xs text-normal opacity-45"
            >{{ newTask.title.length }} / 100</span
          >
        </div>

        <div class="grid grid-cols-1 grid-rows-2 gap-y-5">
          <!-- Status -->
          <div class="flex gap-x-10 items-center">
            <div
              class="itbkk-status text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-3"
            >
              <span>
                <StatusDetail />
              </span>
              Status
            </div>
            <div class="dropdown dropdown-right">
              <div
                tabindex="0"
                role="button"
                class="rounded-xl px-2 py-1 font-bold text-[16px] text-center tracking-wider flex items-center gap-x-3"
                :class="statusStyleStore.statusCustomStyle(newStatus.color)"
              >
                {{ newStatus.name }}
                <span>
                  <DropdownIcon />
                </span>
              </div>
              <div class="dropdown-content z-[1] menu shadow rounded-lg bg-[#3D3C3C] w-52 break-all max-h-52 overflow-y-auto cursor-pointer">
                <ul tabindex="0">
                  <li
                    v-for="status in utilityStore.statusManager.getStatus()"
                    :key="status.id"
                    @click="selectStatus(status.name, status.color, status.id)"
                    :class="statusStyleStore.statusCustomStyle(status.color)"
                    class="p-1 hover:bg-[#4D4D4D] hover:text-[#D8D8D8] transition ease-in-out duration-200 rounded-md bg-transparent"
                  >
                    {{ status.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- Status -->

          <!-- Assignees -->
          <div class="flex gap-x-10 items-center">
            <div class="itbkk-assignees text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4">
              <span>
                <AssigneeDetail />
              </span>
              Assignees
            </div>

            <div class="flex items-end gap-x-5">
              <textarea
                maxlength="30"
                rows="1"
                placeholder="Enter Assignees"
                v-model.trim="newTask.assignees"
                class="rounded-md bg-[#1A1B1D] text-[#F99B1D] resize-none font-normal text-[14px] text-opacity-90 textarea-xs italic w-[20rem] outline-none"
              ></textarea>
              <span class="text-xs text-normal opacity-45"
                >{{ newTask.assignees.length }} / 30</span
              >
            </div>
          </div>
          <!-- Assignees -->

          <!-- Attachment -->
          <div class="flex gap-x-10 items-center">
            <div class="itbkk-assignees text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4">
              <span>
                <AttachIcon />
              </span>
              Attachment
            </div>

            <div>
              <label class="flex items-center gap-2 rounded-lg bg-[#3D3C3C] px-3 py-1 w-auto cursor-pointer" :class="selectedFiles.length === 10 ? 'opacity-30' : 'opacity-100'" >
                <input type="file" class="hidden" :disabled="selectedFiles.length === 10 ? true : false" multiple @change="handleFileUpload"/>
                <CloudUploadIcon/>
                <span class="font-Geist tracking-wide">upload file</span>
                <span v-show="isUploading" class="loading loading-spinner loading-xs"></span>
              </label>
            </div>
          </div>

          <!-- Files -->
          <div class="flex items-center justify-between font-Inter text-white tracking-wide">
            <p >Files ({{ selectedFiles.length }}/10) </p>
            <p class="text-sm">{{ computedFilesSize }}/200 MB</p>
          </div>
          <div v-if="selectedFiles.length > 0" class="h-44 overflow-y-auto pl-3 ">
            <div class="flex flex-col gap-2 w-9/12">
              <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center border border-[#B8B8B8] border-opacity-20 p-3 pl-8 rounded-md gap-6">
                <div v-if="file.name && /\.(mp4|mov|avi|mkv|wmv|flv|webm|mpeg|mpg|3gp)$/i.test(file.name)"><VideoFileIcon class="h-16"/></div>
                <div v-else-if="file.name && /\.(jpeg|jpg|png|gif|bmp|tiff|tif|webp|svg)$/i.test(file.name)"><ImageFileIcon class="h-16"/></div>
                <div v-else-if="file.name.toLowerCase().endsWith('.zip')"><ZIPIcon class="h-16"/></div>
                <div v-else-if="file.name.toLowerCase().endsWith('.pdf')"><PDFIcon class="h-16"/></div>
                <div v-else><DocumentIcon class="h-16"/></div>
                <div class="font-Inter gap-1 cursor-pointer" @click="getFile(file)">
                  <p class="text-white text-sm hover:underline tracking-wider">{{ file.name }}</p>
                  <p class="text-white text-sm text-opacity-30">{{ (file.size / (1024 * 1024)).toFixed(2) }} MB</p>
                </div>
                <button class="ml-auto mr-2 text-red-500 self-start" @click="cancelSelectedFile(file)">x</button>
              </div>
            </div>
          </div>
          <!-- Files -->
        
          <!-- Attachment -->

          <!-- Description -->
          <div class="flex flex-col">
            <textarea
              class="itbkk-description textarea bg-[#D9D9D9] bg-opacity-5 text-normal text opacity-80 textarea-bordered resize-none mt-5"
              rows="4"
              placeholder="Enter Task Description"
              v-model.trim="newTask.description"
              maxlength="500"
            ></textarea>
            <span class="text-xs text-normal opacity-45 flex justify-end pt-2"
              >{{ newTask.description.length }} / 500</span
            >
          </div>
          <!-- Description -->

          <!-- button operation -->
          <div class="flex justify-between">
            <div
              :class="utilityStore.isLimitEnable ? '' : 'invisible'"
              class="text-[#D69C27] flex items-center gap-x-3"
            >
              <WarningIcon width="20" height="20" />
              <span class="mt-1 tracking-wider">Limit Statuses is enabled</span>
            </div>

            <div class="flex gap-x-3">
              <button
                @click="
                  router.push(`/board/${route.params.boardID}/task`)
                "
                class="itbkk-button-cancel btn border-[#DB1058] px-14 bg-opacity-35 text-[#DB1058] w-[4rem] hover:border-none hover:bg-opacity-30 bg-transparent"
              >
                CANCEL
              </button>
              <button
                @click="createNewTask()"
                :disabled="isButtonDisabled"
                class="itbkk-button-confirm btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] border-[#007305] hover:border-none bg-transparent hover:bg-base"
              >
                SAVE
              </button>
            </div>
          </div>
          <!-- button operation -->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
textarea:placeholder-shown {
  font-style: italic;
  font-weight: 300;
  font-size: medium;
}
</style>
