class StatusManagement {
  constructor(statuses = []) {
    this.statuses = statuses
  }

  addStatuses(newStatus) {
    this.statuses = newStatus
  }

  addStatus(newStatus) {
    // console.log(newStatus)
    this.statuses.push(newStatus)
  }

  deleteStatus(deleteId) {
    this.statuses.splice(
      this.statuses.findIndex((status) => status.id === deleteId),
      1
    )
  }

  deleteTransferStatus(oldId, newId) {
    let index = []

    const findId = this.statuses.forEach((status, indexId) => {
      if (status.id === oldId) {
        index.push(indexId)
      }
    })

    index.forEach((id) => {
      this.statuses[id].id = newId
    })

    // if (findId !== -1) {
    //   this.statuses.splice(findId, 1)
    // }

    index.reverse().forEach((id) => {
      this.statuses.splice(id, 1);
  });

    // console.log(this.statuses)
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
    // console.log(this.statuses);
    return this.statuses
  }
}

export {StatusManagement}
