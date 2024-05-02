import router from "@/router"

const getAllTasks = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/tasks`)
  {
    if (!response.ok) {
      throw {
        status: response.status,
        message: "The requested does not exist",
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
        message: `The requested Task : ${id} does not exist`,
        router: router.push("/task"),
        alert: alert("The requested Task does not exist"),
      }
    }
  }
  return response.json()
}

const createTask = async (task) => {
  const response = fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
  return (await response).json()
}

export {getAllTasks, getTask, createTask}
