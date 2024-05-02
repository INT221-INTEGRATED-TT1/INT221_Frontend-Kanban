class TaskManagement {
  constructor(tasks = []) {
    this.tasks = tasks
  }

  addTasks(newTask) {
    this.tasks = newTask
  }

  getTasks() {
    return this.tasks
  }
}

export {TaskManagement}
