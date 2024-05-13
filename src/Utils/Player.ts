import GameBoard from "./GameBoard";

export default class Player {
  private name?: string;
  private board: GameBoard;
  constructor(name?: string) {
    this.name = name;
    this.board = new GameBoard();
  }
  get Board(): GameBoard {
    return this.board;
  }
}
