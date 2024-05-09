class StatusManagement {
  constructor(statuses = []) {
    this.statuses = statuses
  }

  addStatuses(newStatus) {
    this.statuses = newStatus
  }

  addStatus(newStatus) {
    console.log(newStatus);
    this.statuses.push(newStatus)
  }

  getStatus() {
    return this.statuses
  }
}

export {StatusManagement}
