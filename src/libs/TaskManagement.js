class TaskManagement {
  constructor(tasks = []) {
    this.tasks = tasks
  }

  addTasks(newTask) {
    this.tasks = newTask
  }

  addTask(newTask) {
    newTask.assignees === null ? (newTask.assignees = "Unassigned") : ""
    this.tasks.push(newTask)
  }

  deleteTask(deleteId) {
    this.tasks.splice(
      this.tasks.findIndex((task) => task.id === deleteId),
      1
    )
  }

  editTask(taskId, newTask) {
    newTask.assignees === null ? (newTask.assignees = "Unassigned") : ""
    newTask.description === null
      ? (newTask.description = "No Description Provided")
      : ""

    taskId = parseInt(taskId)
    const newTaskWithId = {
      id: taskId,
      ...newTask,
    }
    // console.log(this.tasks)
    const filterId = this.tasks.findIndex((task) => task.id === taskId)
    // console.log("Remove id is", filterId)
    this.tasks.splice(filterId, 1, newTaskWithId)
  }

  getTasks() {
    // console.log(this.tasks);
    
    return this.tasks
  }
}

export {TaskManagement}
