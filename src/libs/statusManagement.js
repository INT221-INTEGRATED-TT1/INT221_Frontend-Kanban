class StatusManagement {
  constructor(statuses = []) {
    this.statuses = statuses
  }

  addStatuses(newStatus) {
    this.statuses = newStatus
  }

  addStatus(newStatus) {
    newStatus.statusDescription === null || newStatus.statusDescription.trim().length === 0
      ? (newStatus.statusDescription = "No description is provided")
      : ""
    const remakeNewStatus = {
      id : newStatus.statusID,
      name : newStatus.statusName,
      description : newStatus.statusDescription,
      color : newStatus.statusColor
    }
      // console.log("newStatus", newStatus);
      
    const newStatusWithCount = {
      ...remakeNewStatus,
      count: 0,
    }
    // console.log(newStatus)
    this.statuses.push(newStatusWithCount)
  }

  deleteStatus(deleteId) {
    this.statuses.splice(
      this.statuses.findIndex((status) => status.id === deleteId),
      1
    )
  }

  deleteTransferStatus(oldId, newId) {
    this.deleteStatus(oldId)
    const findStatusIndex = this.statuses.findIndex(
      (status) => status.id === newId
    )
    this.statuses[findStatusIndex].count++
  }

  editStatus(statusId, newStatus) {
    newStatus.description === null || newStatus.description.trim().length === 0
      ? (newStatus.description = "No description is provided")
      : ""

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

  addFilteredField() {
    this.statuses.forEach((status) => {
      status.filtered = false
    })
  }

  updateFilter(id) {
    this.statuses.forEach((status) => {
      if (status.id === id) {
        status.filtered = !status.filtered
      }
    })
  }

  clearFilter() {
    this.statuses.forEach((status) => {
      status.filtered = false
    })
  }
}

export {StatusManagement}
