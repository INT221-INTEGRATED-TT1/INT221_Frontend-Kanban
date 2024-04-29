const getTasksData = async () => {
  return await fetch(`${import.meta.env.VITE_DB_URL}/v1/tasks`).then((res) =>
    res.json().then(res.status)
  )
}

const getTask = async (id) => {
  const response = await fetch(`${import.meta.env.VITE_DB_URL}/v1/tasks/${id}`)
  {
    if (!response.ok) {
      throw {status: response.status, message: `Task ${id} not found`}
    }
  }
  return response.json()
}

export {getTasksData, getTask}
