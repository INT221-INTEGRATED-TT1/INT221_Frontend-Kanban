class TaskManagement {
  constructor(tasks = []) {
    this.tasks = tasks
  }

  addTasks(newTask) {
    this.tasks = newTask
  }

  addTask(newTask) {
    this.tasks.push(newTask)
  }

  deleteTask(deleteId) {
    this.tasks.splice(
      this.tasks.findIndex((task) => task.id === deleteId),
      1
    )
  }

  editTask(taskId, newTask) {
    const newTaskWithId = {
      id: taskId,
      ...newTask,
    }
    taskId = parseInt(taskId)
    // console.log(this.tasks)
    const filterId = this.tasks.findIndex((task) => task.id === taskId)
    console.log(filterId);
    // console.log("Remove id is", filterId)
    this.tasks.splice(filterId, 1, newTaskWithId)
  }

  getTasks() {
    return this.tasks
  }
}

export {TaskManagement}
