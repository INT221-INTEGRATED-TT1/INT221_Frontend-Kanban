import {createRouter, createWebHistory} from "vue-router"
import Task from "@/views/Task.vue"
import TaskModalDetail from "@/views/TaskModalDetail.vue"
import NotFound from "@/components/NotFound.vue"
import {getAllTasks, getTask} from "@/libs/FetchAPI.js"
import TaskCreate from "@/views/TaskCreate.vue"
import TaskEdit from "@/views/TaskEdit.vue"
import TestLen from "@/components/TestLen.vue"
import StatusCreate from "@/views/StatusCreate.vue"
import StatusManage from "@/views/StatusManage.vue"

const router = createRouter({
  history: createWebHistory(), // base url

  routes: [
    {path: "/", redirect: "/task"},
    {
      path: "/task",
      component: Task,
      name: "task",
      children: [
        {
          path: ":id",
          component: TaskModalDetail,
        },
        {
          path: ":id/edit",
          component: TaskEdit,
        },
        {path: "add", component: TaskCreate, name: "create-task"},
      ],
    },

    {
      path: "/status",
      children: [
        {
          path: "manage",
          component: StatusManage,

          // children: [
          //   {path: "add", component: StatusCreate, name: "create-task-status"},
          // ],
        },
        {path: "add", component: StatusCreate, name: "create-task-status"},
      ],
    },

    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
      name: "not-found",
      // redirect: "/task",
    },
    // {path:"/test", component: TestLen}
  ],
})

export default router
