class CollaboratorManagement {
  constructor(collaborators = []) {
    this.collaborators = collaborators
  }

  addCollaborators(newCollaborators) {
    this.collaborators = newCollaborators
  }

  addCollaborator(newCollaborator, newCollaborators) {
    const findCollaboratorId = newCollaborators.find(collaborator => collaborator.name === newCollaborator.collaboratorName).oid
    let migrateNewCollaborator = {
      oid : findCollaboratorId,
      name : newCollaborator.collaboratorName,
      email : newCollaborator.collaboratorEmail,
      accessRight : newCollaborator.accessRight,
      addedOn : '2024-10-14T03:11:41Z',
      invitationStatus : newCollaborator.invitationStatus,
    }

    this.collaborators.push(migrateNewCollaborator)
  }

  deleteCollaborator(collaboratorId) {
    this.collaborators.splice(this.collaborators.findIndex((collaborators) => collaborators.oid === collaboratorId),1)
  }

  changeCollaboratorAccessRight(collaboratorId, newAccessRight) {
    const filterCollaboratorIndex = this.collaborators.findIndex((collaborator) => collaborator.oid === collaboratorId)
    this.collaborators[filterCollaboratorIndex].accessRight = newAccessRight
  }

  getCollaborators() {
    return this.collaborators
  }
}

export {CollaboratorManagement}
