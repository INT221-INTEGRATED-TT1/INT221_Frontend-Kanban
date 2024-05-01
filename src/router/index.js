import {createRouter, createWebHistory} from "vue-router"
import Task from "@/components/Task.vue"
import TaskModalDetail from "@/views/TaskModalDetail.vue"
import NotFound from "@/views/NotFound.vue"
import {getTask} from "@/libs/FetchAPI"

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
          beforeEnter(to, from, next) {
            getTask(to.params.id)
              .then((task) => {
                next()
              })
              .catch((error) => {
                console.log(error)
                router.push("/task")
                //  alert(error.message)

                setTimeout(() => {
                  alert(error.message)
                }, 1000)
              })
          },
        },
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

// router.beforeEach((to, from) => {
//   if (to.name === "not-found") {
//     return {path: "/task"}
//   }
// })

export default router
