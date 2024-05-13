import { beforeEach, describe, expect, it, test } from "vitest";
import GameBoard from "./GameBoard";
import Ship from "./Ship";

let game: GameBoard;
beforeEach(() => {
  game = new GameBoard();
});

describe("General Test", () => {
  it("Game Board is correct", () => {
    expect(game.getBoard.length).toBe(10);
  });
});

describe("Placing ship on board", () => {
  it("Place x:1, y:2", () => {
    const positon: [number, number] = [1, 2];
    const shiplength = 4;
    game.placeShip(positon, shiplength);
    const board = game.getBoard;
    for (let i = 0; i < shiplength; i++) {
      expect(board[positon[0]][positon[1] + 1]).toBeInstanceOf(Ship);
    }
  });
});

describe("Receiving Attack", () => {
  it("Record missed shots coordinate", () => {
    game.receiveAttack([3, 4]);
    expect(game.missedShots.missedShotsCount).toBe(1);
    expect(game.missedShots.missedShotsCoor[0]).toStrictEqual([3, 4]);
    game.receiveAttack([4, 4]);
    expect(game.missedShots.missedShotsCount).toBe(2);
    expect(game.missedShots.missedShotsCoor[1]).toStrictEqual([4, 4]);
  });

  it("Record hits", () => {
    game.placeShip([0, 1], 5);
    game.receiveAttack([0, 1]);
    const value = game.getBoard[0][1];
    if (value instanceof Ship) {
      expect(value.totalHit).toBe(1);
      expect(value.isSunk).toBe(false);
    } else {
      expect(value).toBe(0);
    }
  });
});

describe("Ship sunk test with receive attack", () => {
  test("With three attack", () => {
    game.placeShip([0, 1], 3);
    game.receiveAttack([0, 1]);
    game.receiveAttack([0, 1]);
    game.receiveAttack([0, 1]);
    const ship = game.getBoard[0][1];
    if (ship instanceof Ship) {
      expect(ship.isSunk).toBe(true);
    }
  });
  test("With two attack", () => {
    game.placeShip([0, 1], 2);
    game.receiveAttack([0, 1]);
    game.receiveAttack([0, 1]);
    const ship = game.getBoard[0][1];
    if (ship instanceof Ship) {
      expect(ship.isSunk).toBe(true);
    }
  });
});

describe("Game over", () => {
  let game: GameBoard;
  beforeEach(() => {
    game = new GameBoard();
  });
  test("Game over with one hit", () => {
    game.placeShip([3, 4], 4);
    game.receiveAttack([3, 4]);
    expect(game.GameOver).toStrictEqual(false);
  });
  test("Game over with three hit", () => {
    game.placeShip([0, 3], 3);
    game.receiveAttack([0, 3]);
    game.receiveAttack([0, 3]);
    game.receiveAttack([0, 3]);
    expect(game.GameOver).toBe(true);
  });
});
