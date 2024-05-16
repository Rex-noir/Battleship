import GameBoard from "./GameBoard";
import Ship from "./Ship";

export default class Player {
  private name?: string | null;
  private board: GameBoard;
  constructor(name?: string) {
    this.name = name;
    this.board = new GameBoard();
  }
  get Board(): (number | Ship)[][] {
    return this.board.getBoard;
  }
  set Board(value: (number | Ship)[][]) {
    this.board.Board = value;
  }
  get BoardManager(): GameBoard {
    return this.board;
  }
  get getName(): string | null {
    if (this.name) return this.name;
    return null;
  }
}
