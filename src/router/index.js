import {createRouter, createMemoryHistory} from "vue-router"
import Table from "@/components/Table.vue"

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

const routes = createRouter({
  routes: [{path: "/table", component: Table, name: "table"}],
})

export default router
