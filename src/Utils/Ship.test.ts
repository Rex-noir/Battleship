import { describe, expect, test } from "vitest";
import Ship from "./Ship.ts";

const ship = new Ship(3);

describe("Test Hit function", () => {
  test("3 times Hit makes the ship sunk", () => {
    for (let i = 0; i < 3; i++) {
      ship.hit();
    }
    expect(ship.isSunk).toBe(true);
  });
});

describe("Test Object Overall", () => {
  test("Get Length", () => {
    expect(ship.Length).toBe(3);
  });
});
