import router from "@/router"
import { toast } from "vue3-toastify"
import "vue3-toastify/dist/index.css"

// แก้ด้วย
const getAccessToken = () => localStorage.getItem("JWT_TOKEN");
const getRefreshToken = () => localStorage.getItem("JWT_REFRESH_TOKEN");

const getAllTasks = async (boardID, sortBy = "createdOn", filterStatuses = "", direction = "ASC") => {
  let url = `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardID}/tasks`
  // console.log(getAccessToken())
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
      headers: { "Authorization": `Bearer ${getAccessToken()}`,},
    })
    if (!response.ok) {
      throw await response.json()
    }
    return response.json()
  }
  catch (error) {
    throw error
  }
}

const getTask = async (boardId, taskId) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${getAccessToken()}`,
    },
  })
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

  return response.json()
}

const createTask = async (boardId, newTask) => {
  // newTask.assignees.trim().length === 0 ? (newTask.assignees = null) : ""
  // newTask.description.trim().length === 0 ? (newTask.description = null) : ""
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ ...newTask }),
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

const deleteTask = async (boardId, taskId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
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

const editTask = async (boardId, taskId, newTask) => {
  newTask.assignees === null || newTask.assignees.trim().length === 0 ? (newTask.assignees = null) : ""
  newTask.description === null || newTask.description.trim().length === 0 ? (newTask.description = null) : ""
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
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

const getAllStatuses = async (boardId) => {
  try {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${getAccessToken()}`,},
    })
    if (!response.ok) {
      throw await response.json()
    }
    return response.json()
  }
  catch (error) {
    throw error
  }
}

const getStatus = async (boardId, statusId) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses/${statusId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
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

const createStatus = async (boardId, newStatus) => {
  // newStatus.description.trim().length === 0 ? newStatus.description = null : ""
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
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

const editStatus = async (boardId, statusId, newStatus) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses/${statusId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
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

const deleteStatuses = async (boardId, statusId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses/${statusId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
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

const deleteStatusTransfer = async (boardId, oldId, newId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/statuses/${oldId}/${newId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
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

const toggleStatusLimit = async (newToggleStatus) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/maximum-task`,
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
      `${import.meta.env.VITE_BACKEND_URL}/login`,
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

const authorizedUser = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/login/validate-token`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
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
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v3/boards`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
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
  // const createBoard = { ...newBoard }
  // console.log(newBoard);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ ...newBoard }),
      }
    )
    return {
      status: response.status,
      message: "Board created successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const deleteBoard = async (boardId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
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

const updateBoardVisibility = async (boardId, visibilityString) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ visibility : visibilityString }),
      }
    )
    return response.json()
  } catch (error) {
    throw error
  }
}

const getNewAccessToken = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/token`,
      {
        method: "POST",
        headers: {
          "x-refresh-token": `${getRefreshToken()}`,
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

const getCollaborators = async (boardId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/collabs`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
        },
      } 
    )
    
    if (!response.ok) {
      throw response
    }
    return {
      status: response.status,
      message: "getCollaborators successfully",
      data: await response.json(),
    }
  } 
  catch (error) {
    throw error
  }
}

const addCollaborator = async (boardId, newCollaborator) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/collabs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(newCollaborator),
      }
    )
    return {
      status: response.status,
      message: "add a collaborator successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const deleteCollaborator = async (boardId, collaboratorId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/collabs/${collaboratorId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
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

const changeCollaboratorAccessRisght = async (boardId, collaboratorId, newAccessRight) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/collabs/${collaboratorId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ accessRight : newAccessRight }),
      }
    )
    return response.json()
  } catch (error) {
    throw error
  }
}

const findCollabById = async (boardId, collaboratorId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/collabs/${collaboratorId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
        },
      }
    )
    return response.json()
  } catch (error) {
    throw error
  }
}

const acceptBoardCollabInvitation = async (boardId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/collabs/invitations/accept`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        }
      }
    )
    return {
      status: response.status,
      message: "acceptBoardCollabInvitation successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const declineBoardCollabInvitation = async (boardId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/collabs/invitations/decline`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
        }
      }
    )
    return {
      status: response.status,
      message: "declineBoardCollabInvitation successfully",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const getUploadedFile = async (boardId, taskId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks/${taskId}/attachments`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
        }
      }
    )
    return {
      status: response.status,
      message: "Get I chob Function",
      data: await response.json(),
    }
  } catch (error) {
    throw error
  }
}

const uploadFile = async (boardId, taskId, files) => {
  try {
    const formData = new FormData()
    files.forEach(file => { formData.append("file", file)});
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks/${taskId}/attachments`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`
        },
        body: formData,
      }
    )
    return {
      status: response.status,
      message: "Files uploaded successfully",
      data: await response.text(),
    }
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error
  }
}

const downloadFile = async (boardId, taskId, fileName) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks/${taskId}/${fileName}/attachments`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
        }
      }
    )
    return {
      status: response.status,
      message: "Get a file Function",
      headers: response.headers,
      blob: await response.blob(),
    }
  } catch (error) {
    throw error
  }
}

const deleteFile = async (boardId, taskId, fileName) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v3/boards/${boardId}/tasks/${taskId}/${fileName}/attachments`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
        }
      }
    )
    return {
      status: response.status,
      message: "delete a file Function",
      headers: response.headers,
      blob: await response.text(),
    }
  } catch (error) {
    throw error
  }
}

export {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
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
  deleteBoard,
  updateBoardVisibility,
  getNewAccessToken,
  getCollaborators,
  addCollaborator,
  deleteCollaborator,
  changeCollaboratorAccessRisght,
  findCollabById,
  acceptBoardCollabInvitation,
  declineBoardCollabInvitation,
  getUploadedFile,
  uploadFile,
  downloadFile,
  deleteFile
}
