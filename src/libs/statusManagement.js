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
  

    this.statuses.forEach((status, indexId) => {
      if (status.id === oldId) {
        index.push(indexId)
      }
    })

    index.forEach((indexId) => {
      this.statuses[indexId].id = newId
    })

    console.log(index.reverse());

    index.reverse().forEach((id) => {
      this.statuses.splice(id, 1)
    })

    // console.log(this.statuses)
  }

  editStatus(statusId, newStatus) {
    statusId = parseInt(statusId)
    const newStatusWithId = {
      id: statusId,
      ...newStatus,
    }
    const filterId = this.statuses.findIndex((status) => status.id === statusId)
    this.statuses.splice(filterId, 1, newStatusWithId)
  }

  getStatus() {
    // console.log(this.statuses);
    return this.statuses
  }
}

export {StatusManagement}
