class TaskManagement {
  constructor(tasks = []) {
    this.tasks = tasks
  }

  addTasks(newTask) {
    this.tasks = newTask
  }

  addTask(newTask) {
    console.log(this.tasks)
    this.tasks.push(newTask)
  }

  deleteTask(deleteId) {
    this.tasks.splice(
      this.tasks.findIndex((task) => task.id === deleteId),
      1
    )
  }

  editTask(taskId, newTask) {
    const filterId = this.tasks.findIndex((task) => task.id === taskId)
    console.log("Remove id is", filterId);
    this.tasks.splice(filterId, 1, newTaskWithId)
  }

  getTasks() {
    // console.log(this.tasks);
    return this.tasks
  }
}

export {TaskManagement}
