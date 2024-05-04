import {createRouter, createWebHistory} from "vue-router"
import Task from "@/components/Task.vue"
import TaskModalDetail from "@/views/TaskModalDetail.vue"
import NotFound from "@/components/NotFound.vue"
import {getAllTasks, getTask} from "@/libs/FetchAPI.js"
import TaskCreate from "@/views/TaskCreate.vue"
import TaskEdit from "@/views/TaskEdit.vue"

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
          // beforeEnter(to, from, next) {
          //   getTask(to.params.id)
          //   .then((task) => {
          //     next()
          //   })
          //   .catch((error) => {
          //     console.log(error)
          //     router.push("/task")
          //     //  alert(error.message)

          //     setTimeout(() => {
          //       alert(error.message)
          //     }, 1000)
          //   })

          // }
        },
        {
          path: ":id/edit",
          component: TaskEdit,
        },
        {path: "add", component: TaskCreate, name: "create-task"},
      ],
    },

    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
      name: "not-found",
      // redirect: "/task",
    },
  ],
})

export default router
