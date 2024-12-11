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
    this.boards.personalBoards[this.boards.personalBoards.findIndex(board => board.id === boardId)].visibility = newVisibility
    // console.log(this.boards[this.boards.findIndex(board => board.id === boardId)].visibility)
  }

  deleteBoard(deleteId) {
    this.boards.personalBoards.splice(this.boards.personalBoards.findIndex((Board) => Board.id === deleteId),1)
  }

  getBoards() {
    return this.boards
  }
}

export {BoardManagement}
