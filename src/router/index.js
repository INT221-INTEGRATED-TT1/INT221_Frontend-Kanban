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

          async beforeEnter(to) {
            const id = parseInt(to.params.id)
            const tasks = await getTasksData()
            const taskIdExist = tasks.some((task) => task.id === id)
            if (!taskIdExist)
              return {
                name: "not-found",
                params: {pathMatch: to.path.substring(1).split("/")},
                query: to.query,
                hash: to.hash,
              }
          },
        },
      ],
    },

    // {path: "/details", component: TaskModalDetail, name: "task-modal-detail"},
    {path: "/:pathMatch(.*)*", component: NotFound, name: "not-found", },
  ],
})

export default router
