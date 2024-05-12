import router from "@/router"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"

const getAllTasks = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v2/tasks`)
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
    `${import.meta.env.VITE_BACKEND_URL}/v2/tasks/${id}`
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
  if (createTask.assignees.trim().length === 0) {
    createTask.assignees = null
  }
  if (createTask.description.trim().length === 0) {
    createTask.description = null
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v2/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...createTask}),
      }
    )
    // console.log(createTask)

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
      `${import.meta.env.VITE_BACKEND_URL}/v2/tasks/${id}`,
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
      `${import.meta.env.VITE_BACKEND_URL}/v2/tasks/${id}`,
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

const getAllStatuses = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/v2/statuses`
  )
  {
    if (!response.ok) {
      throw {
        status: response.status,
        router: router.push("/status/manage"),
      }
    }
    return response.json()
  }
}

const getStatus = async (statusId) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/v2/statuses/${statusId}`
  )
  {
    if (!response.ok) {
      throw {
        status: response.status,
        router: router.push("/status"),
        toast: setTimeout(() => {
          toast("An error has occurred, the status does not exist", {
            type: "error",
            timeout: 2000,
            theme: "dark",
            transition: "flip",
            position: "bottom-right",
          })
        }),
      }
    }
    console.log(typeof statusId)
    return response.json()
  }
}

const countStatus = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v2/statuses/count`
    )
    {
      if (!response.ok) {
        throw {
          status: response.status,
          router: router.push("/status/manage"),
        }
      }
      return response.json()
    }
  } catch (error) {
    throw error
  }
}

const createStatus = async (newStatus) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v2/statuses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus),
      }
    )

    return {
      status: response.status,
      message: "Status created successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const editStatus = async (statusId, newStatus) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v2/statuses/${statusId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStatus),
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

const deleteStatuses = async (statusId) => {
  console.log(typeof statusId)
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v2/statuses/${statusId}`,
      {
        method: "DELETE",
      }
    )
    return {
      status: response.status,
      message: "Status deleted successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const deleteStatusTransfer = async (oldId, newId) => {
  console.log(typeof oldId, typeof newId)
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v2/statuses/${oldId}/${newId}`,
      {
        method: "DELETE",
      }
    )
    return {
      status: response.status,
      message: "Status deleted successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

export {
  getAllTasks,
  getTask,
  createTask,
  deleteTasks,
  editTask,
  getAllStatuses,
  getStatus,
  createStatus,
  editStatus,
  deleteStatuses,
  deleteStatusTransfer,
  countStatus
}
