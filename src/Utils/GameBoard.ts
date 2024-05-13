import Ship from "./Ship";

export default class GameBoard {
  private readonly grid: number;
  private board: (number | Ship)[][];
  private totalShots: number;
  private missedShotsCoor: [number, number][];
  private missedShotsCount: number;

  constructor() {
    this.grid = 10;
    this.board = this.generateBoard(this.grid, 0);
    this.totalShots = 0;
    this.missedShotsCoor = [];
    this.missedShotsCount = 0;
  }
  private generateBoard(grid: number, val: Ship | number): (number | Ship)[][] {
    const arr = Array.from({ length: grid }).map(() =>
      Array.from({ length: grid }).fill(val)
    ) as (number | Ship)[][];
    return arr;
  }
  //Getters
  get getBoard(): (number | Ship)[][] {
    return this.board;
  }
  get missedShots(): {
    missedShotsCoor: [number, number][];
    missedShotsCount: number;
  } {
    return {
      missedShotsCoor: this.missedShotsCoor,
      missedShotsCount: this.missedShotsCount,
    };
  }
  get GameOver(): boolean {
    return this.board.every((row) => {
      return row.every((cell) => {
        return !(cell instanceof Ship && cell.isSunk !== true);
      });
    });
  }
  //
  placeShip([x, y]: number[], length: number): void {
    const ship = new Ship(length);
    for (let i = 0; i < length; i++) {
      this.board[x][y + i] = ship;
    }
  }
  receiveAttack([x, y]: number[]): void {
    this.totalShots++;
    if (this.board[x][y] instanceof Ship) {
      const ship = this.board[x][y] as Ship;
      ship.hit();
    } else {
      this.missedShotsCount++;
      this.missedShotsCoor.push([x, y]);
    }
  }
}
