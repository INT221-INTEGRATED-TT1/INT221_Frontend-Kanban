class CollaboratorManagement {
  constructor(collaborators = []) {
    this.collaborators = collaborators
  }

  addCollaborators(newCollaborators) {
    this.collaborators = newCollaborators
  }

  addCollaborator(newCollaborator) {
    let migrateNewCollaborator = {
      oid : newCollaborator.boardId,
      name : newCollaborator.collaboratorName,
      email : newCollaborator.collaboratorEmail,
      accessRight : newCollaborator.accessRight,
      addedOn : '2024-10-14T03:11:41Z',
    }

    this.collaborators.push(migrateNewCollaborator)
  }

  deleteCollaborator(collaboratorId) {
    this.collaborators.splice(this.collaborators.findIndex((collaborators) => collaborators.id === collaboratorId),1)
  }

  getCollaborators() {
    return this.collaborators
  }
}

export {CollaboratorManagement}
