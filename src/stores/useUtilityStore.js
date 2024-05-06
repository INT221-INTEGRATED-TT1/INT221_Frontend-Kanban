import {TaskManagement} from "@/libs/TaskManagement"
import {defineStore} from "pinia"
import {ref} from "vue"

export const useUtilityStore = defineStore("utility", () => {
  const tasksManager = ref(new TaskManagement())
  const selectedTaskId = ref("")
  const taskTitle = ref("")
  const showDeleteConfirmation = ref(false)

  // const getStatusStyle = (status) => {
  //   return {
  //     "bg-[#5A5A5A] bg-opacity-30 text-[#D8D8D8] ": status === "NO_STATUS",
  //     "bg-[#FF8E25] text-[#FF881B] bg-opacity-30": status === "TO_DO",
  //     "bg-[#173CFF] bg-opacity-30 text-[#2697FF] ": status === "DOING",
  //     "bg-[#007305] bg-opacity-30 text-[#65EE6C]": status === "DONE",
  //   }
  // }

  const convertToStatus = ref({
    NO_STATUS: "No Status",
    TO_DO: "To Do",
    DOING: "Doing",
    DONE: "Done",
  })

  const ConvertToEnumStatus = ref({
    "No Status": "NO_STATUS",
    "To Do": "TO_DO",
    "Doing": "DOING",
    "Done": "DONE",
  })

  const getStatusStyle = (status) => {
    return {
      "bg-[#5A5A5A] bg-opacity-30 text-[#ededed] ": status === "NO_STATUS",
      "bg-[#321b00] text-[#ffbd00] ": status === "TO_DO",
      "bg-[#102049]  text-[#2697FF] ": status === "DOING",
      "bg-[#043109]  text-[#4ec84b]": status === "DONE",
    }
  }

  return {
    convertToStatus,
    getStatusStyle,
    tasksManager,
    selectedTaskId,
    showDeleteConfirmation,
    taskTitle,
    ConvertToEnumStatus,
  }
})
