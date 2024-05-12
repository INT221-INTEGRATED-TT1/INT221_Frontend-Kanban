import {TaskManagement} from "@/libs/TaskManagement"
import {StatusManagement} from "@/libs/statusManagement"
import {defineStore} from "pinia"
import {reactive, ref} from "vue"

export const useUtilityStore = defineStore("utility", () => {
  const tasksManager = ref(new TaskManagement())
  const statusManager = ref(new StatusManagement())
  const selectedId = ref("")
  const taskTitleConfirm = ref("")
  const statusTitle = ref("")
  const showDeleteConfirmation = ref(false)
  const selectedColor = ref(null)

  const statusCustomStyle = (selectedColor) => {
    return {
      "bg-[#043109]  text-[#4ec84b]": selectedColor === "#1A9338",
      "bg-[#321b00] text-[#ffbd00] ": selectedColor === "#E79D13",
      "bg-[#102049]  text-[#2697FF] ": selectedColor === "#0090FF",
      "bg-[#E5484D] bg-opacity-[0.31] text-[#F8426E]":
        selectedColor === "#E5484D",
      "bg-[#8E4EC6] bg-opacity-[0.31] text-[#D223FD]":
        selectedColor === "#8E4EC6",
      "bg-[#5A5A5A] bg-opacity-[0.31] text-[#ededed]":
        selectedColor === "#5A5A5A",
      "bg-[#12A594] bg-opacity-[0.31] text-[#23DF9B]":
        selectedColor === "#12A594",
      "bg-[#E9EB87] bg-opacity-[0.31] text-[#E8DF1B]":
        selectedColor === "#E9EB87",
      "bg-[#008080] bg-opacity-[0.31] text-[#20C392]":
        selectedColor === "#008080",
      "bg-[#B31957] bg-opacity-[0.31] text-[#E31D70]":
        selectedColor === "#B31957",
      "bg-[#4B0082] bg-opacity-[0.31] text-[#B200CF]":
        selectedColor === "#4B0082",
      "bg-[#833407] bg-opacity-[0.31] text-[#BE6F26]":
        selectedColor === "#BE6F26",
    }
  }

  const presetColors = reactive([
    "#1A9338",
    "#E79D13",
    "#0090FF",
    "#E5484D",
    "#8E4EC6",
    "#5A5A5A",
    "#12A594",
    "#E9EB87",
    "#008080",
    "#B31957",
    "#4B0082",
    "#BE6F26",
  ])

  const confirmDeleteStatus = (statusId, statusName, statusColor) => {
    showDeleteConfirmation.value = true
    selectedId.value = statusId
    statusTitle.value = statusName
    selectedColor.value = statusColor
  }

  const confirmDeleteTask = (taskId, taskTitle) => {
    showDeleteConfirmation.value = true
    selectedId.value = taskId
    taskTitleConfirm.value = taskTitle
  }

  return {
    tasksManager,
    selectedId,
    showDeleteConfirmation,
    taskTitleConfirm,
    statusCustomStyle,
    statusManager,
    presetColors,
    selectedColor,
    statusTitle,
    confirmDeleteStatus,
    confirmDeleteTask,
  }
})
