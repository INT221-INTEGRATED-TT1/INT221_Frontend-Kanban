import router from "@/router"
import {ConvertToEnumStatus} from "./util"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"

const getAllTasks = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/tasks`)
  {
    if (!response.ok) {
      throw {
        status: response.status,
        toast: toast.error("The requested does not exist"),
        // message: "The requested does not exist",
        router: router.push("/task"),
      }
    }

    return response.json()
  }
}

const getTask = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/v1/tasks/${id}`
  )
  {
    if (!response.ok) {
      throw {
        status: response.status,
        toast: toast.error(`The requested Task : ${id} does not exist`),
        // message: `The requested Task : ${id} does not exist`,
        router: router.push("/task"),
        // alert: alert("The requested Task does not exist"),
      }
    }
  }
  return response.json()
}

const createTask = async (task) => {
  task.status = ConvertToEnumStatus[task.status]
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v1/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...task}),
      }
    )
    return {
      status: response.status,
      message: "Task created successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const deleteTasks = async (id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v1/tasks/${id}`,
      {
        method: "DELETE",
      }
    )
    return {
      status: response.status,
      message: "Task deleted successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const editTask = async (id, newTask) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v1/tasks/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      }
    )
    return {
      status: response.status,
      message: "Task updated successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

export {getAllTasks, getTask, createTask, deleteTasks, editTask}
