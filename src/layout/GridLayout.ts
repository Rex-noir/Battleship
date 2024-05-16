import CreateElements from "./CreateElement";
import "./../index.css";
import Ship from "../Utils/Ship";
import GameBoard from "../Utils/GameBoard";
import Reference from "./DOMReferencer";
import Player from "../Utils/Player";
import { computerAttack, markClicked } from "../main";

let mousedown = false;
let edit = false;
let isPlayersTUrn = true;
let ship: Ship | null;

export function generateGrid(
  row: number,
  col: number,
  id: string
): HTMLDivElement {
  const container = new CreateElements<HTMLDivElement>(
    "div",
    `${id}-board-container`
  )
    .setClass(
      "border-solid border-green-700 border-2 rounded-lg flex flex-col p-1 shadow-lg shadow-sky-300"
    )
    .build();
  for (let i = 0; i < row; i++) {
    const row = new CreateElements<HTMLDivElement>("div", `${id}-row-container`)
      .setClass("flex")
      .build();
    for (let j = 0; j < col; j++) {
      const cell = new CreateElements<HTMLDivElement>("div", `${id}-cell`)
        .setAttribute("data-x", `${i}`)
        .setAttribute("data-y", `${j}`)
        .setClass(
          "p-2 border-solid border-2 border-black bg-green-600 w-10 h-10"
        )
        .build();
      row.appendChild(cell);
    }
    container.appendChild(row);
  }
  return container;
}

export function addEventListener(
  container: HTMLDivElement,
  id: string,
  board: GameBoard
) {
  const cells = container.querySelectorAll(`#${id}-cell`);
  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      cellsSelected(e, board);
    });
    cell.addEventListener("dblclick", (e) => {
      cellsSelected(e, board);
    });
    cell.addEventListener("mousedown", (e) => {
      mousedown = true;
      cellsSelected(e, board);
    });
    cell.addEventListener("mouseup", () => {
      mousedown = false;
      ship = null;
    });
    cell.addEventListener("mousemove", (e) => {
      cellsSelected(e, board);
    });
    container.addEventListener("mouseleave", () => {
      mousedown = false;
      ship = null;
    });
  });
}
export function toggleEdit(playersturn?: boolean) {
  if (playersturn !== undefined) {
    isPlayersTUrn = playersturn;
  } else {
    edit = !edit;
  }
}
export function cellsSelected(e: Event, board?: GameBoard) {
  const cell = e.target as HTMLDivElement;
  if ((mousedown && edit) || e.type === "click") {
    const x = Number(cell.getAttribute("data-x"));
    const y = Number(cell.getAttribute("data-y"));
    if (
      board &&
      !(board?.getBoard[x][y] instanceof Ship) &&
      board.shipCounts() < 5
    )
      updateBoard(x, y, cell, board);
  }
}

function updateBoard(
  x: number,
  y: number,
  cell: HTMLDivElement,
  board: GameBoard
): void {
  if (board && !(board.getBoard[x][y] instanceof Ship)) {
    if (!ship) ship = new Ship(1);
    if (board.shipCounts(ship) > 4) return;
    board?.placeShip([x, y], 1, "horizontal", ship);
    cell.classList.add("bg-sky-600");
  }
}

export function makeComputerCellsFunction(computer: Player) {
  const boardContainer = Reference.byId<HTMLDivElement>(
    "computer-board-container"
  );
  if (boardContainer) {
    const cells = boardContainer.querySelectorAll("#computer-cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => computerCellClicked(e, computer));
      cell.classList.add("hover:bg-[url('./../../asset/scope.svg')]");
    });
  }
}
export function computerCellClicked(e: Event, computer: Player): void {
  const element = e.target as HTMLDivElement;
  if (isPlayersTUrn && element.getAttribute("clicked") !== "true") {
    const board = computer.Board;
    const cell = e.target as HTMLDivElement;
    const x = Number(cell.getAttribute("data-x"));
    const y = Number(cell.getAttribute("data-y"));

    computer.BoardManager.receiveAttack([x, y]);
    if (board[x][y] instanceof Ship) {
      cell.classList.add("bg-red-600");
    } else {
      cell.classList.add("bg-white");
    }
    markClicked(x, y, "computer");
    setTimeout(() => {
      computerAttack();
    }, 500);
  }
}
