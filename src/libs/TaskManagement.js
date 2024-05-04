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

  editTask(taskId, newTask) {
    console.log(this.tasks);
    const filterId = this.tasks.findIndex((task) => task.id === taskId)
    this.tasks.splice(filterId, 1, newTask)
  }

  getTasks() {
    // console.log(this.tasks);
    return this.tasks
  }
}

export {TaskManagement}
