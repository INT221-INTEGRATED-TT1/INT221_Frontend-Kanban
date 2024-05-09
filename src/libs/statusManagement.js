class StatusManagement {
  constructor(statuses = []) {
    this.statuses = statuses
  }

    addStatus(newStatus) {
        this.statuses = newStatus
    }

    addStatuses(newStatus){
        this.statuses.push(newStatus)
    }

  getStatus() {
    return this.statuses
  }
}
