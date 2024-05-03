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
    const taskIndex = this.tasks.findIndex((task) => task.id === deleteId)
    if (taskIndex !== -1) {
      this.tasks.splice(deleteId, 1)
    }
  }

  getTasks() {
    return this.tasks
  }
}

export {TaskManagement}
