import router from "@/router"
import { toast } from "vue3-toastify"
import "vue3-toastify/dist/index.css"

// แก้ด้วย
const getAllTasks = async (direction, sortBy, filterStatuses) => {
  let url = `${import.meta.env.VITE_BACKEND_URL}/v2/tasks`
  // console.log(filterStatuses)
  if (direction || sortBy || filterStatuses) {
    const params = new URLSearchParams()

    if (direction) {
      params.append("direction", direction)
    }
    if (sortBy) {
      if (sortBy.trim().length === 0) {
        params.delete("sortBy")
      } else {
        params.append("sortBy", sortBy)
      }
    }
    if (filterStatuses.length) {
      for (let index = 0; index < filterStatuses.length; index++) {
        if (filterStatuses[index] === "") {

        } else if (filterStatuses) {
          params.append("filterStatuses", filterStatuses[index])
        }
      }
    }

    url += `?${params.toString()}`
  }
  // console.log(url)
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
  let createTask = { ...newTask }

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
        body: JSON.stringify({ ...createTask }),
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
  let createStatus = { ...newStatus }
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

const authenticateUser = async (userCredentials) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/authentications/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      }
    )

    return {
      status: response.status,
      message: "successfully get user info",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const authorizedUser = async (accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/authentications/validate-token`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    )

    return {
      status: response.status,
      message: "Authorized user successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const getAllBoards = async () => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v3/boards`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  )
  {
    if (!response.ok) {
      throw {
        status: response.status,
        router: router.push("/board"),
      }
    }
    return response.json()
  }
}

const createBoard = async (newBoard) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  const createBoard = { ...newBoard }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...createBoard }),
      }
    )
    // console.log(createTask)

    return {
      status: response.status,
      message: "Board created successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const getAllTasks3 = async (boardID, direction, sortBy, filterStatuses) => {
  console.log(boardID)
  const accessToken = localStorage.getItem("JWT_TOKEN");
  let url = `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardID}/tasks`
  // console.log(filterStatuses)
  if (direction || sortBy || filterStatuses) {
    const params = new URLSearchParams()

    if (direction) {
      params.append("direction", direction)
    }
    if (sortBy) {
      if (sortBy.trim().length === 0) {
        params.delete("sortBy")
      } else {
        params.append("sortBy", sortBy)
      }
    }
    if (filterStatuses.length) {
      for (let index = 0; index < filterStatuses.length; index++) {
        if (filterStatuses[index] === "") {

        } else if (filterStatuses) {
          params.append("filterStatuses", filterStatuses[index])
        }
      }
    }

    url += `?${params.toString()}`

  }
  console.log(url)
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    })
    if (!response.ok) {
      throw {
        status: response.status,
        router: router.push(`/board/${boardID}/task`),
      }
    }
    return response.json()
  }
  catch (error) {
    throw error
  }

}

const getTask3 = async (boardId, taskId) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  }

  )
  {
    if (!response.ok) {
      throw {
        status: response.status,
        router: router.push(`/board/${boardId}/task`),
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

const createTask3 = async (boardId, newTask) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  let createTask = { ...newTask }

  createTask.assignees.trim().length === 0 ? (createTask.assignees = null) : ""
  createTask.description.trim().length === 0
    ? (createTask.description = null)
    : ""

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...createTask }),
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

const editTask3 = async (boardId, taskId, newTask) => {
  newTask.assignees === null || newTask.assignees.trim().length === 0
    ? (newTask.assignees = null)
    : ""
  newTask.description === null || newTask.description.trim().length === 0
    ? (newTask.description = null)
    : ""

  const accessToken = localStorage.getItem("JWT_TOKEN");
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
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

const deleteTask3 = async (boardId, taskId) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
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

const getAllStatuses3 = async (boardId) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  }
  )
  {
    if (!response.ok) {
      throw {
        status: response.status,
        router: router.push(`/board/${boardId}/status`),
      }
    }
    return response.json()
  }
}

const getStatus3 = async (boardId, statusId) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses/${statusId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  )
  {
    if (!response.ok) {
      throw {
        status: response.status,
        router: router.push(`/board/${boardId}/status`),
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

const createStatus3 = async (boardId, newStatus) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  let createStatus = { ...newStatus }
  createStatus.description.trim().length === 0
    ? (createStatus.description = null)
    : ""
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
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

const editStatus3 = async (boardId, statusId, newStatus) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  newStatus.description === null ? (newStatus.description = null) : ""
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses/${statusId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
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

const deleteStatuses3 = async (boardId, statusId) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses/${statusId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
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

const deleteStatusTransfer3 = async (boardId, oldId, newId) => {
  const accessToken = localStorage.getItem("JWT_TOKEN");
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses/${oldId}/${newId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
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
  toggleStatusLimit,
  authenticateUser,
  authorizedUser,
  getAllBoards,
  createBoard,
  getAllTasks3,
  getTask3,
  createTask3,
  editTask3,
  deleteTask3,
  getAllStatuses3,
  getStatus3,
  createStatus3,
  editStatus3,
  deleteStatuses3,
  deleteStatusTransfer3,
}
