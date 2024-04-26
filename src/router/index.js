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
          path: "details/:id",
          component: TaskModalDetail,
          async beforeEnter(to, from, next) {
            const id = parseInt(to.params.id)
            try {
              const tasks = await getTasksData()
              const taskIdExist = tasks.some((task) => task.id === id)
              if (taskIdExist) {
                next()
              } else {
                next({name: "not-found"})
              }
            } catch (error) {
              console.error("Error fetching tasks data:", error)
              next({name: "not-found"})
            }
          },
        },
      ],
    },

    {path: "/details", component: TaskModalDetail, name: "task-modal-detail"},
    {path: "/:pathMatch(.*)*", component: NotFound, name: "not-found"},
  ],
})

export default router
