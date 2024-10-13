class CollaboratorManagement {
  constructor(collaborators = []) {
    this.collaborators = collaborators
  }

  addCollaborators(newcollaborators) {
    this.collaborators = newcollaborators
  }

  addCollaborator(newcollaborators) {
    this.collaborators.push(newcollaborators)
  }

  deleteCollaborator(collaboratorId) {
    this.collaborators.splice(this.collaborators.findIndex((collaborators) => collaborators.id === collaboratorId),1)
  }

  getCollaborators() {
    return this.collaborators
  }
}

export {CollaboratorManagement}
