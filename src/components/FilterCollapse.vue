<script setup>
import {ref, onBeforeMount} from "vue"
import {getAllStatuses} from "@/libs/FetchAPI.js"
import {useUtilityStore} from "@/stores/useUtilityStore.js"
import {useSortAndFilterStore} from "@/stores/useSortAndFilterStore.js"
import {useStatusStyleStore} from "@/stores/useStatusStyleStore"
import {useRoute} from "vue-router"
import router from "@/router/index.js"
import FilterIcon from "@/components/icons/FilterIcon.vue"

const route = useRoute()
const utilityStore = useUtilityStore()
const sortAndFilterStore = useSortAndFilterStore()
const statusStyleStore = useStatusStyleStore()

onBeforeMount(async () => {
  try {
    const fetchStatuses = await getAllStatuses(route.params.boardID)
    utilityStore.statusManager.addStatuses(fetchStatuses)
    utilityStore.statusManager.addFilteredField()
    
  } catch (error) {
    // localStorage.removeItem("JWT_TOKEN")
    console.log("Error fetching tasks : ", error.message)
    error.status === 404 ? router.push({name: 'not-found'}) : router.push('/error')
  }
})
</script>

<template>

  <div class="mb-5 collapse">
    <h1
      class="itbkk-status-filter flex items-center text-normal gap-x-3 collapse-title tracking-wider"
    >
      <FilterIcon /> Filters
    </h1>
    <input type="checkbox" />

    <div class="collapse-content m-0">
      <div class="divider p-2"></div>
      <div class="flex gap-x-3 gap-y-2 flex-wrap">
        <div
          v-for="(status, index) in utilityStore.statusManager.getStatus()"
          :key="index"
          class="itbkk-filter-item itbkk-status-choice rounded-2xl py-1 px-3 text-[14px] w-fit font-bold border border-[#2e2e2e] cursor-pointer hover:bg-base-300 truncate text-center tracking-normal font-Inter hover:duration-75"
          :class="
            status.filtered === true
              ? statusStyleStore.statusCustomStyle(status.color)
              : ''
          "
          @click="
            sortAndFilterStore.filterOrSortByStatus(
              sortAndFilterStore.sortDirection,
              sortAndFilterStore.currentSortBy,
              status.name,
              status.id
            )
          "
        >
          {{ status.name }}
        </div>
      </div>
      <div class="divider p-2"></div>
    </div>
  </div>
</template>

<style scoped></style>
