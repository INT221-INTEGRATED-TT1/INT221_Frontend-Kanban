<script setup>
import {ref, onBeforeMount, computed, reactive} from "vue"
import {getTask, editTask, findCollabById, getUploadedFile, downloadFile, uploadFile, deleteFile} from "@/libs/FetchAPI.js"
import {useRoute} from "vue-router"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import {useStatusStyleStore} from "@/stores/useStatusStyleStore"
import router from "@/router/index.js"
import Xmark from "@/components/icons/Xmark.vue"
import StatusDetail from "@/components/icons/StatusDetail.vue"
import AssigneeDetail from "@/components/icons/AssigneeDetail.vue"
import CreatedDateIcon from "@/components/icons/CreatedDateIcon.vue"
import UpdatedDateIcon from "@/components/icons/UpdatedDateIcon.vue"
import DropdownIcon from "@/components/icons/DropdownIcon.vue"
import TimezoneIcon from "@/components/icons/TimezoneIcon.vue"
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
import { useUserStore } from "@/stores/useUserStore"

const userStore = useUserStore()
const task = ref({})
const route = useRoute()
const utilityStore = useUtilityStore()
const statusStyleStore = useStatusStyleStore()

const newStatus = reactive({
  id: "",
  name: "",
  description: "",
  color: "",
})

const updateTask = reactive({
  title: "",
  description: "",
  assignees: "",
  status3: newStatus.id,
})

const selectStatus = (name, color, id) => {
  newStatus.name = name
  newStatus.color = color
  newStatus.id = id
  updateTask.status3 = id
}

const formatTimezone = () => {
  const options = {
    timeZoneName: "long",
  }
  const formatter = new Intl.DateTimeFormat([], options)
  const {timeZone} = formatter.resolvedOptions()
  return timeZone
}

const filterStatus = ref({})

const editTaskData = async (newTask) => {
  const filterStatusId = utilityStore.statusManager
    .getStatus()
    .filter((status) => status.id === newStatus.id)

  filterStatus.value = filterStatusId[0]

  if (
    filterStatusId[0].count >= utilityStore.limitStatusNumber &&
    utilityStore.isLimitEnable === true &&
    filterStatusId[0].name !== "No Status" &&
    filterStatusId[0].name !== "Done"
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
    const response = await editTask(
      route.params.boardID,
      route.params.taskID,
      newTask
    )

    if (response.status === 200) {
      utilityStore.tasksManager.editTask(route.params.taskID, response.data)
      utilityStore.statusManager.getStatus()[
        utilityStore.statusManager
          .getStatus()
          .findIndex((status) => status.id === task.value.statuses3.id)
      ].count -= 1
      utilityStore.statusManager.getStatus()[
        utilityStore.statusManager
          .getStatus()
          .findIndex((status) => status.id === newStatus.id)
      ].count += 1
      utilityStore.transactionDisable = false
      router.push(`/board/${route.params.boardID}/task`)
      setTimeout(() => {
        toast("The task has been updated", {
          type: "success",
          timeout: 2000,
          theme: "dark",
          transition: "flip",
          position: "bottom-right",
        })
      }, 200)
    }

    if (response.status === 404) {
      utilityStore.transactionDisable = false
      toast("The task does not exist", {
        type: "error",
        timeout: 2000,
        theme: "dark",
        transition: "flip",
        position: "bottom-right",
      })
    }

    if (filesToDelete.value.length > 0) {
      filesToDelete.value.forEach(async (eFile) => {
        await deleteFile(route.params.boardID, route.params.taskID, eFile.fileName)
      })
    }

    if(filesToAdd.value.length > 0){ 
      await uploadFile(route.params.boardID, route.params.taskID, filesToAdd.value)
    }
    

  } catch (error) {
    console.log("Error updating task: ", error)
  }
}

const isButtonDisable = computed(() => {
  if (newStatus.id !== filterStatus.value.id) {utilityStore.transactionDisable = false}
  const isTaskUnchanged = (updateTask.title === task.value.title && updateTask.description === task.value.description && updateTask.assignees === task.value.assignees && updateTask.status3 === task.value.statuses3.id)
  const hasFileChanges = (filesToAdd.value.length > 0 || filesToDelete.value.length > 0);
  const shouldUpdate = (isTaskUnchanged || !updateTask.title || utilityStore.transactionDisable) && !hasFileChanges
  return shouldUpdate
})

const fileUploaded = ref([])
let fileNotExistSelected = []
let originalfileUploaded = []
const filesToAdd = ref([])
const filesToDelete = ref([])

// Function to check if a file exists in an array based on specific properties
const isInArray = (array, file) => {
  return array.some(item =>
    item.fileName === file.name &&
    item.fileSize === file.name
    // item.type === file.type &&
    // item.lastModified === file.lastModified
  );
};

const isInArraySameAttr = (array, file) => {
  return array.some(item =>
    item.fileName === file.fileName &&
    item.fileSize === file.fileSize
  )
};

const handleFileUpload = (event) => {
  const newSelectedFilesArray = Array.from(event.target.files);
  let fileOverMaxSize = []
  let fileOverMaxLength = []
  let fileSameName = []

  if (newSelectedFilesArray.length > 0) {
    fileOverMaxSize = []
    fileSameName = []
    // Check for files not already uploaded
    fileNotExistSelected = newSelectedFilesArray.filter(file => !isInArray(fileUploaded.value, file))

    fileNotExistSelected.forEach(file => {
      //check if each file size > 20MB
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 20) {
        fileOverMaxSize.push({
          fileName: file.name,
          fileSize: file.size,
          lastModified: file.lastModifiedDate,
        });
        return;
      }

      //Check if the file is the same name of some item in fileUploaded
      if (fileUploaded.value.some(item => item.fileName === file.name)) {
        fileSameName.push({
          fileName: file.name,
          fileSize: file.size,
          lastModified: file.lastModifiedDate,
        })
        return;
      }

      //Check if the file is not already in fileuploaded
      if (!isInArray(fileUploaded.value, file)) {
        fileUploaded.value.push({
          fileName: file.name,
          fileSize: file.size,
          lastModified: file.lastModifiedDate,
        });
        // Add file to `filesToAdd` if it's not part of `originalfileUploaded`
        if (!isInArray(originalfileUploaded, file)) {
          filesToAdd.value.push(file);
        }
      }
      
      // Remove file from `filesToDelete` if it was previously marked for deletion
      const deleteIndex = filesToDelete.value.findIndex(fileToDelete => (fileToDelete.fileName === file.name) && (fileToDelete.fileSize === file.size));
      if (deleteIndex !== -1) {
        filesToDelete.value.splice(deleteIndex, 1);
      }

    })

  }

  // Clear Files that over slot
  if (fileUploaded.value.length > 10) {
    fileOverMaxLength = fileUploaded.value.slice(10, fileUploaded.value.length)
    fileUploaded.value.splice(10, fileUploaded.value.length - 10)
    fileOverMaxLength.forEach(errorItem => {
      const deleteIndex = filesToAdd.value.findIndex(fileToDelete => (fileToDelete.name === errorItem.fileName) && (fileToDelete.size === errorItem.fileSize));
      if (deleteIndex !== -1) { filesToAdd.value.splice(deleteIndex, 1); }
    })
  }

  if(fileOverMaxSize.length > 0 || fileOverMaxLength.length > 0 || fileSameName.length > 0){
    let errorFilesCombined = []
    let errorMessage = ''
    let errorFiles = ''
    if(fileOverMaxSize.length > 0){
      errorMessage += '• Each file cannot be larger than 20 MB. \n '
    }
    if(fileOverMaxLength.length > 0){
      errorMessage += '• Each task can have at most 10 files. \n '
    }
    if(fileSameName.length > 0){
      errorMessage += '• File with the same filename cannot be added or updated to the attachments. Please delete the attachment and add again to update the file. \n '
    }
    errorMessage += 'The following files are not added: \n '
    errorFilesCombined = [...fileOverMaxSize, ...fileOverMaxLength, ...fileSameName]
    errorFilesCombined.forEach(file => errorFiles += "\n" + "- " + file.fileName)
    toast(
      `${errorMessage} ${errorFiles} `,
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

const cancelSelectedOrDeleteFile = (file) => {
  if (isInArraySameAttr(originalfileUploaded, file)) {
    const indexInUploaded = fileUploaded.value.findIndex(
      fileUpload => fileUpload.fileName === file.fileName
    );

    if (indexInUploaded !== -1) {
      fileUploaded.value.splice(indexInUploaded, 1);
      filesToDelete.value.push(file);
    } else {
      console.warn(`File ${file.fileName} not found in fileUploaded.`);
    }
  } 
  else if (isInArray(filesToAdd.value, file)) {
    const indexInFilesToAdd = filesToAdd.value.findIndex(
      fileInAdd => fileInAdd.name === file.fileName
    );
    const indexInUploaded = fileUploaded.value.findIndex(
      fileUpload => fileUpload.fileName === file.fileName
    );

    if (indexInFilesToAdd !== -1) {
      filesToAdd.value.splice(indexInFilesToAdd, 1);
    } else {
      console.warn(`File ${file.fileName} not found in filesToAdd.`);
    }

    if (indexInUploaded !== -1) {
      fileUploaded.value.splice(indexInUploaded, 1);
    } else {
      console.warn(`File ${file.fileName} not found in fileUploaded.`);
    }
  } 
  else {
    console.log(`File ${file.fileName} not found in any list, no action taken.`);
  }

};

const computedFilesSize = computed(() => {
  if(fileUploaded.value.length > 0) {
    return (fileUploaded.value.reduce((sum, file) => sum + file.fileSize, 0) / (1024 * 1024)).toFixed(2)
  }
  return 0
})

const getFile = async (fileName) => {
  const responseDownloadFile = await downloadFile(route.params.boardID, route.params.taskID, fileName)
  const url = window.URL.createObjectURL(responseDownloadFile.blob)
  const fileType = responseDownloadFile.headers.get("Content-Type")
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
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

onBeforeMount(async () => {
  const JWT_TOKEN = localStorage.getItem("JWT_TOKEN")
  const decodedData = window.atob(JWT_TOKEN.split('.')[1])
  userStore.userIdentity = { ...JSON.parse(decodedData) }
  try {
    const fetchTask = await getTask(route.params.boardID, route.params.taskID)
    fetchTask.board.ownerId === userStore.userIdentity.oid ? utilityStore.isOwnerBoard = true : "false"

    if (!utilityStore.isOwnerBoard) {
      // router.push(`/board/${route.params.boardID}/task`).then(() => {
      //   toast(
      //     `You don't have permission to edit this board`,
      //     {
      //       type: "error",
      //       timeout: 2000,
      //       theme: "dark",
      //       transition: "flip",
      //       position: "bottom-right",
      //     })
      // })

      const collabIdentity = await findCollabById(route.params.boardID, userStore.userIdentity.oid)
      utilityStore.collabAccessRight = collabIdentity.accessRight
      collabIdentity.accessRight === 'WRITE' ? utilityStore.isOwnerBoard = true : utilityStore.isOwnerBoard = false
      
      if(utilityStore.isOwnerBoard === false) {
          router.push('/error')
          return
      }
    }

    task.value = fetchTask

    task.value.createdOn = utilityStore.formatDateTime(task.value.createdOn)
    task.value.updatedOn = utilityStore.formatDateTime(task.value.updatedOn)

    updateTask.title = task.value.title
    updateTask.description = task.value.description
    updateTask.assignees = task.value.assignees
    updateTask.status3 = task.value.statuses3.id

    newStatus.id = task.value.statuses3.id
    newStatus.name = task.value.statuses3.name
    newStatus.description = task.value.statuses3.description
    newStatus.color = task.value.statuses3.color

    const responseGetFileUploaded = await getUploadedFile(route.params.boardID, route.params.taskID)
    fileUploaded.value = responseGetFileUploaded.data
    originalfileUploaded = [...fileUploaded.value ]

  } catch (error) {
    console.log(`Error fetching task ${route.params.boardID}: `, error)
    return
  }
})
</script>

<template>
  <section class="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-sm">
    <div class="w-[60rem] bg-[#1F1F1F] rounded-2xl px-24 py-10">
      <h1 class="text-[12px] text-headline text-opacity-[0.43] font-bold text-center mt-5 tracking-wider">
        Task Editing
      </h1>
      <!-- close modal -->
      <div class="flex justify-end">
        <button @click="router.push(`/board/${route.params.boardID}/task`)">
          <span>
            <Xmark />
          </span>
        </button>
      </div>

      <!-- Title -->
      <div class="flex flex-col gap-y-5 mt-5">
        <textarea
          class="itbkk-title bg-[#1A1B1D] rounded-xl outline-none resize-none w-full text-2xl font-semibold text-headline p-4 pl-6 "
          maxlength="100"
          rows="1"
          :placeholder="task.title"
          v-model.trim="updateTask.title"
        >
        </textarea>

        <div class="grid grid-cols-1 grid-rows-4 gap-y-4">
          <!-- Status -->
          <div class="flex gap-x-10 items-center">
            <div class="itbkk-status text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-3">
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

              <div
                class="dropdown-content z-[1] menu shadow rounded-lg bg-[#3D3C3C] w-52 break-all max-h-52 overflow-y-auto cursor-pointer"
              >
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

          <!-- Assignees -->
          <div class="flex gap-x-10 items-center">
            <div class="text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4">
              <span>
                <AssigneeDetail />
              </span>
              Assignees
            </div>

            <textarea
              maxlength="30"
              rows="1"
              class="itbkk-assignees rounded-md bg-[#1A1B1D] resize-none font-normal text-[14px] text-opacity-90 textarea-xs italic w-[20rem]"
              :class="
                task.assignees === 'Unassigned'
                  ? 'italic text-gray-500'
                  : ' text-[#F99B1D]'
              "
              v-model.trim="updateTask.assignees"
              placeholder="Enter assignees"
            ></textarea>
          </div>

          <!-- CreatedOn -->
          <div class="flex gap-x-10 items-center">
            <div class="text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4">
              <span>
                <CreatedDateIcon />
              </span>
              Created On
            </div>
            <div
              class="itbkk-created-on font-normal text-[14px] text-headline text-opacity-50 tracking-widest"
            >
              {{ task.createdOn }}
            </div>
          </div>

          <!-- UpdatedOn -->
          <div class="flex gap-x-10 items-center">
            <div class="text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4">
              <span>
                <UpdatedDateIcon />
              </span>
              Updated On
            </div>
            <div class="itbkk-updated-on font-normal text-[14px] text-headline text-opacity-50 tracking-widest">
              {{ task.updatedOn }}
            </div>
          </div>

          <!-- Attachment -->
          <div class="flex gap-x-10 items-center">
            <div class="itbkk-assignees text-xl text-headline text-opacity-70 tracking-wider w-[10rem] flex items-center gap-x-4">
              <span>
                <AttachIcon />
              </span>
              Attachment
            </div>

          <!-- Uploadfile Button -->
            <div>
              <label class="flex items-center gap-2 rounded-lg bg-[#3D3C3C] px-3 py-1 w-auto cursor-pointer" :class="fileUploaded.length === 10 ? 'opacity-30' : 'opacity-100'">
                <input type="file" class="hidden" :disabled="fileUploaded.length === 10 ? true : false" multiple @change="handleFileUpload"/>
                <CloudUploadIcon/>
                <span class="font-Geist text-white text-opacity-80 tracking-wide">upload file</span>
              </label>
            </div>
          </div>

          <!-- Files -->
          <div class="flex items-center justify-between font-Inter text-white tracking-wide">
            <p >Files ({{ fileUploaded.length > 0 ? fileUploaded.length : 0 }}/10)</p>
            <p class="text-sm">{{ computedFilesSize }}/200 MB</p>
          </div>
          <div v-if="fileUploaded.length > 0" class="h-44 overflow-y-auto pl-3 ">
            <div class="flex flex-col gap-2 w-9/12">
              <div v-for="(file, index) in fileUploaded" :key="index" class="flex items-center border border-[#B8B8B8] border-opacity-20 p-3 pl-8 rounded-md gap-6">
                <div v-if="file.fileName && /\.(mp4|mov|avi|mkv|wmv|flv|webm|mpeg|mpg|3gp)$/i.test(file.fileName)"><VideoFileIcon class="h-16"/></div>
                <div v-else-if="file.fileName && /\.(jpeg|jpg|png|gif|bmp|tiff|tif|webp|svg)$/i.test(file.fileName)"><ImageFileIcon class="h-16"/></div>
                <div v-else-if="file.fileName.toLowerCase().endsWith('.zip')"><ZIPIcon class="h-16"/></div>
                <div v-else-if="file.fileName.toLowerCase().endsWith('.pdf')"><PDFIcon class="h-16"/></div>
                <div v-else><DocumentIcon class="h-16"/></div>
                <div class="font-Inter gap-1 cursor-pointer" @click="getFile(file.fileName)">
                  <p class="text-white text-sm hover:underline tracking-wider">{{ file.fileName }}</p>
                  <p class="text-white text-sm text-opacity-30">{{ (file.fileSize / (1024 * 1024)).toFixed(2) }} MB</p>
                </div>
                <button class="ml-auto mr-2 text-red-500 self-start" @click="cancelSelectedOrDeleteFile(file)">x</button>
              </div>
            </div>
          </div>
          <!-- Files -->

          <!-- Description -->
          <textarea
            class="itbkk-description textarea bg-[#D9D9D9] bg-opacity-5 text-normal text opacity-80 textarea-bordered resize-none mt-8"
            rows="4"
            maxlength="500"
            :class="
              task.description === 'No Description Provided'
                ? 'italic text-gray-500'
                : 'text-normal text opacity-80'
            "
            v-model.trim="updateTask.description"
            placeholder="Enter description"
          ></textarea>

          <!-- <textarea style="resize: none; overflow: hidden; min-height: 100px;" @input="resizeTextarea" class="texarea textarea-bordered rounded w-full p-2" placeholder="Title" ref="textArea"></textarea> -->
        </div>

        <!-- Button Operation -->
        <div class="flex justify-between">
          <!-- timezone -->
          <div class="itbkk-timezone flex items-center gap-x-2">
            <div
              class="text-[1.1rem] font-bold text-headline text-opacity-70 flex items-center gap-x-3"
            >
              <span>
                <TimezoneIcon /> </span
              >TimeZone :
            </div>

            <div class="text-[1rem] text-headline text-opacity-55 pt-[3px]">
              {{ formatTimezone() }}
            </div>
          </div>

          <div
            :class="utilityStore.isLimitEnable ? '' : 'invisible'"
            class="text-[#D69C27] flex items-center gap-x-2"
          >
            <WarningIcon width="15" height="15" />
            <span class="tracking-wider text-xs"
              >Limit Statuses is enabled</span
            >
          </div>

          <div class="flex gap-x-3">
            <button
              @click="router.push(`/board/${route.params.boardID}/task`)"
              class="itbkk-button-cancel btn border-[#DB1058] px-14 bg-opacity-35 text-[#DB1058] w-[4rem] hover:border-none hover:bg-opacity-30 bg-transparent"
            >
              CANCEL
            </button>
            <button
              :disabled="isButtonDisable"
              @click="editTaskData(updateTask)"
              class="itbkk-button-confirm btn px-14 bg-[#007305] bg-opacity-35 text-[#13FF80] w-[4rem] border-[#007305] hover:border-none bg-transparent hover:bg-base"
            >
              SAVE
            </button>
          </div>
        </div>
        <!-- Button Operation -->
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
