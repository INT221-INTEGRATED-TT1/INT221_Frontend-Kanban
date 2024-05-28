<script setup>
import {useSortAndFilterStore} from "@/stores/useSortAndFilterStore.js"
import SortDesc from "@/components/icons/sortDESC.vue"
import SortASC from "@/components/icons/SortASC.vue"
import dropdownSort from "@/components/icons/dropdownSort.vue"
import SortRecently from "@/components/icons/SortRecently.vue"
import SelectedDot from "@/components/icons/SelectedDot.vue"
import StatusIcon from "@/components/icons/StatusIcon.vue"

const sortAndFilterStore = useSortAndFilterStore()
</script>

<template>
  <div class="itbkk-status-sort dropdown">
    <div
      tabindex="0"
      role="button"
      class="flex gap-x-3 justify-center items-center"
    >
      <StatusIcon />Status <dropdownSort />
    </div>
    <ul
      tabindex="0"
      class="dropdown-content z-[1] menu m-0 mt-2 shadow bg-[#2b2b2b] rounded-md w-52"
    >
      <li
        class="p-0"
        @click="
          sortAndFilterStore.filterOrSortByStatus('ASC', 'status.name', '', '')
        "
        :class="{
          'text-white': sortAndFilterStore.selectedOption === 'ASC',
        }"
      >
        <span
          ><SortASC /> Ascending
          <SelectedDot
            v-show="sortAndFilterStore.selectedOption === 'ASC' ? true : false"
          />
        </span>
      </li>
      <li
        class="p-0"
        @click="
          sortAndFilterStore.filterOrSortByStatus('DESC', 'status.name', '', '')
        "
        :class="{
          'text-white': sortAndFilterStore.selectedOption === 'DESC',
        }"
      >
        <span
          ><SortDesc /> Descending
          <SelectedDot
            v-show="sortAndFilterStore.selectedOption === 'DESC' ? true : false"
          />
        </span>
      </li>
      <div class="divider m-0"></div>
      <li
        class="p-0"
        @click="sortAndFilterStore.filterOrSortByStatus('', '', '', '')"
        :class="{
          'text-white': sortAndFilterStore.selectedOption === '',
        }"
      >
        <span
          ><SortRecently /> Last Created
          <SelectedDot
            v-show="sortAndFilterStore.selectedOption === '' ? true : false"
          />
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
