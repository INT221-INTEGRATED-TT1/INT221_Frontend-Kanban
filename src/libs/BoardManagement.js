class BoardManagement {
  constructor(boards = []) {
    this.boards = boards
  }

  addBoards(newBoard) {
    this.boards = newBoard
  }

  addBoard(newBoard) {
    
    this.boards.push(newBoard)
  }

  // deleteBoard(deleteId) {
  //   this.boards.splice(
  //     this.boards.findIndex((Board) => Board.id === deleteId),
  //     1
  //   )
  // }

  // editBoard(boardId, newBoard) {
  //   // console.log("Board id is", BoardId)
  //   newBoard.assignees === null ? (newBoard.assignees = "Unassigned") : ""
  //   newBoard.description === null
  //     ? (newBoard.description = "No Description Provided")
  //     : ""

  //   boardId = parseInt(boardId)
  //   const newBoardWithId = {
  //     id: boardId,
  //     ...newBoard,
  //   }
  //   // console.log(this.boards)
  //   const filterId = this.boards.findIndex((Board) => Board.id === BoardId)
  //   // console.log("Remove id is", filterId)
  //   this.boards.splice(filterId, 1, newBoardWithId)
  // }

  getBoards() {
    return this.boards
  }
}

export {BoardManagement}
