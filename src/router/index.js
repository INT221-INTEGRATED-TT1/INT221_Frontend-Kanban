import { createRouter, createWebHistory } from "vue-router"
import Task from "@/components/Task.vue"
import TaskModalDetail from "@/components/TaskModalDetail.vue"
import NotFound from "@/components/NotFound.vue"
import { getTask } from "@/libs/crud"

const router = createRouter({
  history: createWebHistory(),

  routes: [
    { path: "/", redirect: "/task" },
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
                console.log(error);
                router.push("/task")

                setTimeout(() => {
                  alert(error.message)
                }, 1000)
               
                         
              })
          },
        },
      ],
    },
  
  ],
})

// router.beforeEach((to, from) => {
//   if (to.name === "not-found") {
//     return {path: "/task"}
//   }
// })

export default router
