import { getCell } from "../main";
import Ship from "./Ship";

export default class GameBoard {
  private readonly grid: number;
  private board: (number | Ship)[][];
  private totalShots: number;
  private missedShotsCoor: [number, number][];
  private missedShotsCount: number;

  constructor(board?: (number | Ship)[][]) {
    this.grid = 10;
    if (board) this.board = board;
    else this.board = this.generateBoard(this.grid, 0);
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
  //setters
  set Board(board: (number | Ship)[][]) {
    this.board = board;
  }
  //Getters
  get getBoard(): (number | Ship)[][] {
    return this.board;
  }
  setMark(x: number, y: number): void {
    this.board[x][y] = 10000;
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
  //random valid coordinate
  getRandom(): { x: number | boolean; y: number | boolean } | undefined {
    let found = false;
    let x: number = 0;
    let y: number = 0;
    while (!found) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      if (getCell(x, y)?.getAttribute("clicked") === null) {
        found = true;
        return { x: x, y: y };
      }
    }
    if (found) return { x: x, y: y };
    return undefined;
  }
  isClicked(x: number, y: number, id: string = "player"): boolean {
    const cell = getCell(x, y, id);
    if (cell && cell.getAttribute("clicked") === null) {
      return false;
    }
    return true;
  }
  checkHit(x: number, y: number): number | false {
    if (this.board[x][y] instanceof Ship) {
      const ship = this.board[x][y] as Ship;
      return ship.totalHit;
    }
    return false;
  }
  //place ship
  placeShip(
    [x, y]: number[],
    length: number,
    orientation: "horizontal" | "vertical",
    obj?: Ship
  ): boolean {
    const maxX = this.board.length;
    const maxY = this.board[0].length;
    let ship;
    if (
      x < 0 ||
      y < 0 ||
      (orientation === "horizontal" && y + length > maxY) ||
      (orientation === "vertical" && x + length > maxX)
    ) {
      throw new Error("Placement coordinates are out of bound");
    }
    if (!obj) {
      ship = new Ship(length);
    } else {
      ship = obj;
    }
    if (orientation === "horizontal") {
      for (let i = 0; i < length; i++) {
        this.board[x][y + i] = ship;
      }
      return true;
    } else if (orientation === "vertical") {
      for (let i = 0; i < length; i++) {
        this.board[x + i][y] = ship;
      }
      return true;
    } else {
      throw new Error('Invalid orientation. Use "horizontal" or "vertical".');
    }
  }
  receiveAttack([x, y]: number[]): boolean {
    this.totalShots++;
    if (this.board[x][y] instanceof Ship) {
      const ship = this.board[x][y] as Ship;
      ship.hit();
      return true;
    } else {
      this.missedShotsCount++;
      this.missedShotsCoor.push([x, y]);
      return false;
    }
  }
  randomize() {
    let totalShips = 5;
    while (totalShips > 0) {
      const length = Math.floor(Math.random() * 3) + 2;
      const startX = Math.floor(Math.random() * this.board.length);
      const startY = Math.floor(Math.random() * this.board.length);

      const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";

      let isValidPosition = true;
      for (let i = startX - 1; i <= startX + 1; i++) {
        for (let j = startY - 1; j <= startY + 1; j++) {
          if (
            i >= 0 &&
            i < this.board.length &&
            j >= 0 &&
            j < this.board.length
          ) {
            if (this.board[i][j] !== 0) {
              isValidPosition = false;
              break;
            }
          }
        }
        if (!isValidPosition) {
          break;
        }
      }

      // If the position is valid, place the ship
      if (isValidPosition) {
        try {
          this.placeShip([startX, startY], length, orientation);
          totalShips--;
        } catch (error) {
          continue;
        }
      }
    }
    return this.board;
  }
  newBoard() {
    this.board = this.generateBoard(10, 0);
    return this.board;
  }
  shipCounts(obj?: Ship): number {
    const uniqueShips = new Set<Ship>();
    let sameShips = 0;
    this.board.forEach((row) => {
      row.forEach((cell) => {
        if (!obj && cell instanceof Ship && !cell.isSunk) {
          uniqueShips.add(cell);
        } else if (obj && cell === obj) {
          sameShips++;
        }
      });
    });
    if (obj) return sameShips;
    return uniqueShips.size;
  }
}
