class BoardManagement {
  constructor(boards = []) {
    this.boards = boards
  }

  addBoards(newBoards) {
    this.boards = newBoards
  }

  addBoard(newBoard) {
    this.boards.personalBoards.push(newBoard)
  }

  // findBoardVisibility(boardId){
  //   this.boards.filter(board => board.id = boardId)[0]
  //   // console.log("findboard : ",this.boards.filter(board => board.id = boardId)[0],this.boards.filter(board => board.id = boardId)[0].visibility)
  // }

  changeVisibilityBoard(boardId, newVisibility){
    // console.log(this.boards[this.boards.findIndex(board => board.id === boardId)].visibility)
    this.boards[this.boards.findIndex(board => board.id === boardId)].visibility = newVisibility
    // console.log(this.boards[this.boards.findIndex(board => board.id === boardId)].visibility)
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
