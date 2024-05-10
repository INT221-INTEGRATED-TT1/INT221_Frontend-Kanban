class StatusManagement {
  constructor(statuses = []) {
    this.statuses = statuses
  }

  addStatuses(newStatus) {
    this.statuses = newStatus
  }

  addStatus(newStatus) {
    console.log(newStatus)
    this.statuses.push(newStatus)
  }

  deleteStatus(deleteId) {
    this.statuses.splice(
      this.statuses.findIndex((status) => status.id === deleteId),
      1
    )
  }

  editStatus(statusId, newStatus) {
    // console.log("Task id is", taskId)
    // if (newTask.assignees.trim().length === 0) {
    //   newTask.assignees = "Unassigned"
    // }

    statusId = parseInt(statusId)
    const newStatusWithId = {
      id: statusId,
      ...newStatus,
    }
    // console.log(this.tasks)
    const filterId = this.statuses.findIndex((status) => status.id === statusId)
    // console.log("Remove id is", filterId)
    this.statuses.splice(filterId, 1, newStatusWithId)
  }

  getStatus() {
    return this.statuses
  }
}

export {StatusManagement}
