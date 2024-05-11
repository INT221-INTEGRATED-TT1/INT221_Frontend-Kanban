class TaskManagement {
  constructor(tasks = []) {
    this.tasks = tasks
  }

  addTasks(newTask) {
    this.tasks = newTask
  }

  addTask(newTask) {
    if (newTask.assignees === null) {
      newTask.assignees = "Unassigned"
    }
    this.tasks.push(newTask)
  }

  deleteTask(deleteId) {
    this.tasks.splice(
      this.tasks.findIndex((task) => task.id === deleteId),
      1
    )
  }

  editTask(taskId, newTask) {
    console.log("Task id is", taskId)
    if (newTask.assignees.trim().length === 0) {
      newTask.assignees = "Unassigned"
    }

    taskId = parseInt(taskId)
    const newTaskWithId = {
      id: taskId,
      ...newTask,
    }
    // console.log(this.tasks)
    const filterId = this.tasks.findIndex((task) => task.id === taskId)
    console.log("Remove id is", filterId)
    this.tasks.splice(filterId, 1, newTaskWithId)
  }

  getTasks() {
    return this.tasks
  }
}

export {TaskManagement}
