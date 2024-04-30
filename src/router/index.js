import {createRouter, createWebHistory} from "vue-router"
import Task from "@/components/Task.vue"
import TaskModalDetail from "@/components/TaskModalDetail.vue"
import NotFound from "@/components/NotFound.vue"
import {getTasksData} from "@/libs/crud"

const router = createRouter({
  history: createWebHistory(),

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
      ],
    },
    {path: "/notFound", component: NotFound, redirect: "/task"},

    // {path: "/details", component: TaskModalDetail, name: "task-modal-detail"},
    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
      name: "not-found",
      // redirect: "/task",
    },
  ],
})

// router.beforeEach((to, from) => {
//   if (to.name === "not-found") {
//     return {path: "/task"}
//   }
// })

export default router
