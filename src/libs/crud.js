const getTasksData = async () => {
  return await fetch(`${import.meta.env.VITE_DB_URL}/v1/tasks`).then((res) =>
    res.json().then(res.status)
  )
}

const getTask = async (id) => {
  return await fetch(`${import.meta.env.VITE_DB_URL}/v1/tasks/${id}`).then(
    (res) => res.json()
  )
}

export {getTasksData, getTask}
