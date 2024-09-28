import { createRouter, createWebHistory } from "vue-router"
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
import BoardHome from "@/views/BoardHome.vue"
import BoardCreate from "@/views/BoardCreate.vue"
import ShareTask from "@/views/ShareTask.vue"
import { authorizedUser } from "@/libs/FetchAPI"

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL), // base url

  routes: [
    { path: "/", redirect: "/login" },
    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
      name: "not-found",
    },
    // {
    //   path: "/task",
    //   component: Task,
    //   name: "task",
    //   children: [
    //     { path: ":id", component: TaskModalDetail,},
    //     { path: ":id/edit", component: TaskEdit,},
    //     { path: "add", component: TaskCreate, name: "create-task" },
    //   ],
    // },
    // {
    //   path: "/status/manage",
    //   component: StatusManage,
    //   children: [
    //     { path: "/status/add", component: StatusCreate, name: "create-task-status" },
    //     { path: "/status/:id/edit", component: StatusEdit, name: "edit-task-status" },
    //   ],
    // },
    {
      path: "/team",
      component: TeamPage,
      name: "team"
    },
    {
      path: "/login",
      component: LoginPage,
      name: "login"
    },
    {
      path: "/board",
      component: BoardHome,
      name: "board-home",
      children: [
        { path: "add", component: BoardCreate, name: "create-board" },
      ],
    },
    // {path: "/board/add", component: BoardCreate, name: "create-board"}
    // {path:"/test", component: TestLen}
    {
      path: "/board/:boardID/task",
      component: Task,
      name: "board-task",
      children: [
        { path: ":taskID", component: TaskModalDetail, },
        { path: ":taskID/edit", component: TaskEdit, },
        { path: "add", component: TaskCreate, name: "create-task" },
        { path: "share", component: ShareTask, name: "share-task" },
      ],
    },
    {
      path: "/board/:boardID/status",
      component: StatusManage,
      name: "board-status",
      children: [
        { path: "add", component: StatusCreate, name: "create-task-status" },
        { path: ":statusID/edit", component: StatusEdit, name: "edit-task-status" },
      ],
    },
  ]

})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  // console.log(accessToken);
  if (accessToken) {
    // console.log(to);
    try {
      const response = await authorizedUser();
      if (response.status === 200) {
        // console.log('Authentication Pass');
        if (to.name === 'login') {
          // If authenticated user tries to access login page, redirect to /board
          next('/board');
        } else {
          // Proceed to the intended route
          next();
        }
      }
      else {
        // Handle unexpected status codes by redirecting to /board
        localStorage.removeItem("JWT_TOKEN")
        next('/login');
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      // Redirect to login page on authentication failure
      next('/login');
    }
  } else {
    if (to.name !== 'login') {
      // If not authenticated, redirect to login
      next('/login');
    } else {
      // If already on the login page, proceed
      next();
    }
  }
});


export default router
