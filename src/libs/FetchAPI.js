import router from "@/router"
import {toast} from "vue3-toastify"
import "vue3-toastify/dist/index.css"
// แก้ด้วย
const getAllTasks = async (direction, sortBy, filterStatuses) => {
  let url = `${import.meta.env.VITE_BACKEND_URL}/v2/tasks`

  if (direction || sortBy || filterStatuses) {
    const params = new URLSearchParams()

    if (direction) {
      params.append("direction", direction)
    }
    if (sortBy) {
      if (sortBy.trim().length === 0 && filterStatuses.length === 0) {
        params.delete("sortBy")
      } else {
        params.append("sortBy", sortBy)
      }
    }
    if (filterStatuses) {
      // if (filterStatuses.length === 0) {
      //   params.delete("sortBy")
      //   params.delete("direction")
      // }

      for (let index = 0; index < filterStatuses.length; index++) {
        if (filterStatuses[index] === "") {
          params.delete("filterStatuses")
          // filterStatuses = []
        } else {
          params.append("filterStatuses", filterStatuses[index])
        }
      }
    }
    url += `?${params.toString()}`
  }
  console.log(url)
  const response = await fetch(url)

  if (!response.ok) {
    throw {
      status: response.status,
      router: router.push("/task"),
    }
  }

  return response.json()
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

  createTask.assignees.trim().length === 0 ? (createTask.assignees = null) : ""
  createTask.description.trim().length === 0
    ? (createTask.description = null)
    : ""

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
  newTask.assignees === null || newTask.assignees.trim().length === 0
    ? (newTask.assignees = null)
    : ""
  newTask.description === null || newTask.description.trim().length === 0
    ? (newTask.description = null)
    : ""

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
        router: router.push("/status/manage"),
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
    return response.json()
  }
}

const createStatus = async (newStatus) => {
  let createStatus = {...newStatus}
  createStatus.description.trim().length === 0
    ? (createStatus.description = null)
    : ""
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v2/statuses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createStatus),
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
  newStatus.description === null ? (newStatus.description = null) : ""
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

const toggleStatusLimit = async (newToggleStatus) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v2/statuses/maximum-task`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newToggleStatus),
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
  toggleStatusLimit,
}
