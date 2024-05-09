import router from "@/router"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"

const ConvertToEnumStatus = {
  "No Status": "NO_STATUS",
  "To Do": "TO_DO",
  "Doing": "DOING",
  "Done": "DONE",
}

const getAllTasks = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/tasks`)
  {
    if (!response.ok) {
      throw {
        status: response.status,
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
        router: router.push("/task"),
        timeout: setTimeout(() => {
          toast(`The requested Task : ${id} does not exist`, {
            type: "error",
            timeout: 2000,
            theme: "dark",
            transition: "flip",
            position: "bottom-right",
          })
        }),
      }
    }
  }
  return response.json()
}

const createTask = async (newTask) => {
  let createTask = {...newTask}
  createTask.status = ConvertToEnumStatus[createTask.status]
  if (createTask.assignees.trim().length === 0) {
    createTask.assignees = null
    
  }
  if (createTask.description.trim().length === 0) {
    createTask.description = null
  }

  console.log(newTask);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v1/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...createTask}),
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

const getAllStatus = async () =>{
  
}

export {getAllTasks, getTask, createTask, deleteTasks, editTask}
