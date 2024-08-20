import {createRouter, createWebHistory} from "vue-router"
import Task from "@/views/Task.vue"
import TaskModalDetail from "@/views/TaskModalDetail.vue"
import NotFound from "@/components/NotFound.vue"
import TaskCreate from "@/views/TaskCreate.vue"
import TaskEdit from "@/views/TaskEdit.vue"
import TestLen from "@/components/TestLen.vue"
import StatusCreate from "@/views/StatusCreate.vue"
import StatusManage from "@/views/StatusManage.vue"
import StatusEdit from "@/views/StatusEdit.vue"
import TeamPage from "@/views/TeamPage.vue"
import LoginPage from "@/views/LoginPage.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL), // base url

  routes: [
    {path: "/", redirect: "/login"},
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
      path: "/status/manage",
      component: StatusManage,
      children: [
        {path: "/status/add", component: StatusCreate, name: "create-task-status"},
        {path: "/status/:id/edit", component: StatusEdit, name: "edit-task-status"},
      ],
    },

    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
      name: "not-found",
    },
    {
      path:"/team",
      component: TeamPage,
      name:"team"
    },
    
    {
      path: "/login",
      component: LoginPage,
      name: "login"
    },
    
    // {path:"/test", component: TestLen}

  ]

})

export default router
