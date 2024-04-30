import router from "@/router"

const getTasksData = async () => {
  const response = await fetch(`${import.meta.env.VITE_DB_URL}/v1/tasks`)
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
  const response = await fetch(`${import.meta.env.VITE_DB_URL}/v1/tasks/${id}`)
  {
    if (!response.ok) {
      throw {
        status: response.status,
        message: `The requested Task : ${id} does not exist`,
        router: router.push("/"),
        alert: alert("The requested Task does not exist"),

      }
    }
  }
  return response.json()
}

export {getTasksData, getTask}
