import {defineStore} from "pinia"
import {ref} from "vue"

export const useUtilityStore = defineStore("utility", () => {
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

  return {convertToStatus, ConvertToEnumStatus}
})
