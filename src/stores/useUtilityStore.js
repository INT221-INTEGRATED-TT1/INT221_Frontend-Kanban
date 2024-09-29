import {TaskManagement} from "@/libs/TaskManagement"
import {StatusManagement} from "@/libs/statusManagement"
import {BoardManagement} from "@/libs/BoardManagement"
import {defineStore} from "pinia"
import {ref} from "vue"

export const useUtilityStore = defineStore("utility", () => {
  const tasksManager = ref(new TaskManagement())
  const statusManager = ref(new StatusManagement())
  const boardManager = ref(new BoardManagement())
  const selectedId = ref("")
  const taskTitleConfirm = ref("")
  const statusTitle = ref("")
  const showDeleteConfirmation = ref(false)
  const showStatusSettingMenu = ref(false)
  const selectedColor = ref(null)
  const disableTransfer = ref(false)
  const transactionDisable = ref(false)
  const isLimitEnable = ref(false)
  const limitStatusNumber = ref(10)
  const selectedBoardId = ref('')
  const selectedBoard = ref({
    id : "",
    name : "",
    createdOn : "",
    updatedOn : "",
    ownerId : ""
  })
  const isOwnerBoard = ref(false)

  const confirmDeleteStatus = (statuses) => {
    selectedId.value = statuses.id
    statusTitle.value = statuses.name
    selectedColor.value = statuses.color
    transactionDisable.value = true
    statuses.count > 0
      ? (disableTransfer.value = true)
      : (showDeleteConfirmation.value = true)
  }

  const confirmDeleteTask = (taskId, taskTitle) => {
    showDeleteConfirmation.value = true
    selectedId.value = taskId
    taskTitleConfirm.value = taskTitle
  }

  const limitStatus = () => {
    showStatusSettingMenu.value = true
  }

  const formatDateTime = (baseFormatDate) => {
    const date = new Date(baseFormatDate)
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
    const formattedDate = date
      .toLocaleString("en-GB", options)
      .replace(/\//g, "/")
      .replace(",", "")
  
    return formattedDate
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
    limitStatus,
    isLimitEnable,
    limitStatusNumber,
    boardManager,
    selectedBoard,
    selectedBoardId,
    formatDateTime,
    isOwnerBoard
  }
})
