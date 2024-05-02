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

  getTasks() {
    return this.tasks
  }
}

export {TaskManagement}
