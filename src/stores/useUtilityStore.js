import {TaskManagement} from "@/libs/TaskManagement"
import {StatusManagement} from "@/libs/statusManagement"
import {defineStore} from "pinia"
import {ref} from "vue"

export const useUtilityStore = defineStore("utility", () => {
  const tasksManager = ref(new TaskManagement())
  const statusManager = ref(new StatusManagement())
  const selectedId = ref("")
  const taskTitleConfirm = ref("")
  const statusTitle = ref("")
  const showDeleteConfirmation = ref(false)
  const showStatusSettingMenu = ref(false)
  const selectedColor = ref(null)
  const disableTransfer = ref(false)
  const transactionDisable = ref(false)

  const confirmDeleteStatus = (statuses) => {
    selectedId.value = statuses.id
    statusTitle.value = statuses.name
    selectedColor.value = statuses.color
    statuses.count > 0
      ? (disableTransfer.value = true)
      : (showDeleteConfirmation.value = true)
  }

  const confirmDeleteTask = (taskId, taskTitle) => {
    showDeleteConfirmation.value = true
    selectedId.value = taskId
    taskTitleConfirm.value = taskTitle
  }

  const limitStatus = () =>{
    showStatusSettingMenu.value = true
  }

  return {
    tasksManager,
    selectedId,
    showDeleteConfirmation,
    taskTitleConfirm,
    statusManager,
    selectedColor,
    statusTitle,
    confirmDeleteStatus,
    confirmDeleteTask,
    disableTransfer,
    transactionDisable,
    showStatusSettingMenu,
    limitStatus
  }
})
