import {defineStore} from "pinia"
import {ref} from "vue"
import {useUtilityStore} from "./useUtilityStore"
import {getAllTasks} from "@/libs/FetchAPI"
import { useRoute } from "vue-router"


export const useSortAndFilterStore = defineStore("sortAndFilter", () => {
  const utilityStore = useUtilityStore()
  const filterStatusArray = ref([])
  const sortDirection = ref("")
  const selectedOption = ref("")
  const currentSortBy= ref("createdOn")
  const disableSort = ref(true)
  const route = useRoute()
  const filterOrSortByStatus = async (
    direction,
    sortBy,
    filterStatuses,
    id
  ) => {
    utilityStore.statusManager.updateFilter(id)

    sortDirection.value = direction
    selectedOption.value = direction
    currentSortBy.value = sortBy

    sortDirection.value === direction ? disableSort.value : disableSort.value = false
    
    if (!filterStatusArray.value.includes(filterStatuses) && filterStatuses != '') {
      filterStatusArray.value.push(filterStatuses)
    } else if (filterStatusArray.value.includes(filterStatuses)) {
      const index = filterStatusArray.value.indexOf(filterStatuses)
      if (index !== -1) {
        filterStatusArray.value.splice(index, 1)
      }
    } 

    const sorted = await getAllTasks(
      route.params.boardID,
      currentSortBy.value,
      filterStatusArray.value,
      sortDirection.value
    )
    utilityStore.tasksManager.addTasks(sorted)

    for (const task of utilityStore.tasksManager.getTasks()) {
      task.assignees === null || task.assignees.trim().length === 0
        ? (task.assignees = "Unassigned")
        : ""
    }
  }

  return {
    filterStatusArray,
    sortDirection,
    selectedOption,
    filterOrSortByStatus,
    currentSortBy,
  }
})
