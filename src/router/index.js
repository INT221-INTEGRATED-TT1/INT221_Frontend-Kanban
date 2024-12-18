import { createRouter, createWebHistory } from "vue-router"
import Task from "@/views/Task.vue"
import TaskModalDetail from "@/views/TaskModalDetail.vue"
import NotFound from "@/components/NotFound.vue"
import Forbidden from "@/components/Forbidden.vue"
import TaskCreate from "@/views/TaskCreate.vue"
import TaskEdit from "@/views/TaskEdit.vue"
import TestLen from "@/components/TestLen.vue"
import StatusCreate from "@/views/StatusCreate.vue"
import StatusManage from "@/views/StatusManage.vue"
import StatusEdit from "@/views/StatusEdit.vue"
import BoardCollab from "@/views/BoardCollab.vue"
import TeamPage from "@/views/TeamPage.vue"
import LoginPage from "@/views/LoginPage.vue"
import BoardHome from "@/views/BoardHome.vue"
import BoardCreate from "@/views/BoardCreate.vue"
import InvitationCollab from "@/views/InvitationCollab.vue"
// import ShareTask from "@/views/ShareTask.vue"
import { authorizedUser, getNewAccessToken } from "@/libs/FetchAPI"

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL), // base url

  routes: [
    { path: "/", redirect: "/login" },
    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
      name: "not-found",
    },
    {
      path: "/team",
      component: TeamPage,
      name: "team"
    },
    {
      path: "/error",
      component: Forbidden,
      name: "access-denied"
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
    {path:"/test", component: InvitationCollab},
    {
      path: "/board/:boardID/task",
      component: Task,
      name: "board-task",
      // beforeEnter: async (to, from, next) => {
      //   // การทำงานก่อนที่จะอนุญาตให้เข้าถึง route ลูก
      //   console.log("Starting task setup in Task component...");
        
      //   // ตัวอย่างการทำงาน (เช่น โหลดข้อมูล หรือเช็คเงื่อนไขบางอย่าง)
      //   await new Promise((resolve) => setTimeout(resolve, 500));
        
      //   console.log("Task setup completed");
      //   next(); // อนุญาตให้เข้าถึง route ลูก
      // },
      children: [
        { path: ":taskID", component: TaskModalDetail, },
        { path: ":taskID/edit", component: TaskEdit, },
        { path: "add", component: TaskCreate, name: "create-task" },
        // { path: "share", component: ShareTask, name: "share-task" },
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
    {
      path: "/board/:boardID/collab",
      component: BoardCollab,
      name: "board-collab",
      children: [
        { path: "invitations", component: InvitationCollab, name: "collab-invitations" },
      ],
    },
    
  ]

})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  // console.log(accessToken);
  // console.log(to.fullPath)
  if (/\/board\/.{10}$/.test(to.fullPath)) { next(`${to.fullPath}/task`) }
  if (accessToken) {
    // console.log(to);
    try {
      const authzUserResponse = await authorizedUser();
      if (authzUserResponse.status === 200) {
        // console.log('Authentication Pass');
        const redirect = localStorage.getItem("REDIRECT_FULLPATH");
        if (to.name === 'login') {
          // If authenticated user tries to access login page, redirect to /board
          next('/board');
        }
        else if (redirect) {
          next(redirect)
          localStorage.removeItem("REDIRECT_FULLPATH");
        }
        else {
          // Proceed to the intended route
          next();
        }
      }
      else {
        // Handle unexpected status codes by redirecting to /board
        const authzRefreshTokenResponse = await getNewAccessToken();
        if (authzRefreshTokenResponse.status === 200) {
          localStorage.setItem("JWT_TOKEN", authzRefreshTokenResponse.data.access_token)
          next();
        }
        else {
          localStorage.removeItem("JWT_TOKEN")
          localStorage.removeItem("JWT_REFRESH_TOKEN")
          next('/login');
        }
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      // Redirect to login page on authentication failure
      next('/login');
    }
  } else {
    if (to.name === 'error') next('/error');
    else {
      // If not authenticated, redirect to login
      if (to.name === 'board-home') {
        next('/login');
      }
      // If already on the login page, proceed
      else next();
    }
  }
});


export default router
