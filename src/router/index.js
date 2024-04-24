import {createRouter, createWebHistory} from "vue-router"
import Task from "@/components/Task.vue"
import TaskModalDetail from "@/components/TaskModalDetail.vue"

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {path: "/", redirect: "/task"},
    {
      path: "/task",
      component: Task,
      name: "task",
      // children: [{path: "/details", component: TaskModalDetail}],
      children: [{path: "details/:id", component: TaskModalDetail}],
    },
    
    {path: "/details", component: TaskModalDetail}
  ],
})


export default router
