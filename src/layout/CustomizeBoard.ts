import GameBoard from "../Utils/GameBoard";
import Player from "../Utils/Player";
import Ship from "../Utils/Ship";
import { gameStart } from "../main";
import CreateElements from "./CreateElement";
import { addEventListener, generateGrid, toggleEdit } from "./GridLayout";

let player: Player;
let board: HTMLDivElement;
let message: HTMLSpanElement;
let dialog: HTMLDialogElement;

export default function CustomizeShips(playerData?: Player): {
  dialog: HTMLDialogElement;
  playersBoard: HTMLDivElement;
} {
  player = playerData as Player;
  board = generateGrid(10, 10, "player");
  addEventListener(board, "player", player.BoardManager);
  dialog = new CreateElements<HTMLDialogElement>(
    "dialog",
    "bulid-ship-container"
  )
    .setClass("backdrop:backdrop-blur-lg p-4 bg-slate-800 rounded-lg")
    .build();
  const container = new CreateElements<HTMLDivElement>(
    "div",
    "dialog-container"
  )
    .setClass(
      "flex flex-col gap-4 justify-center items-center font-sedanSC text-green-400"
    )
    .build();
  const Title = new CreateElements<HTMLHeadingElement>("h3", "dialog-title")
    .setClass("text-3xl")
    .build();
  Title.textContent = "Major, place your ships on the radar!";

  message = new CreateElements<HTMLSpanElement>(
    "span",
    "dialog-message"
  ).build();

  const buttonsContainer = new CreateElements<HTMLDivElement>(
    "div",
    "dialog-buttons-container"
  )
    .setClass(
      "flex gap-2 child:p-3 child-hover:text-sky-600 child-active:translate-y-1"
    )
    .build();

  const randomizeButton = new CreateElements<HTMLButtonElement>(
    "button",
    "randomize-button"
  ).build();
  randomizeButton.textContent = "Random";

  const ConfirmButton = new CreateElements<HTMLButtonElement>(
    "button",
    "confirm-button"
  ).build();
  ConfirmButton.textContent = "Confirm";

  const ResetButton = new CreateElements<HTMLButtonElement>(
    "button",
    "reset-button"
  ).build();
  ResetButton.textContent = "Reset";
  buttonsContainer.appendChild(randomizeButton);
  buttonsContainer.appendChild(ConfirmButton);
  buttonsContainer.appendChild(ResetButton);

  container.appendChild(Title);
  container.appendChild(message);
  container.appendChild(board);
  container.appendChild(buttonsContainer);
  dialog.appendChild(container);

  //add event listeners to each buttons
  randomizeButton.addEventListener("click", randomize);
  ResetButton.addEventListener("click", reset);
  ConfirmButton.addEventListener("click", confirmPlay);

  return { dialog: dialog, playersBoard: board };
}
function randomize() {
  const newBoard = new GameBoard(player.Board).newBoard();
  const board = new GameBoard(newBoard).randomize();
  player.Board = board;
  replace(board);
}
function replace(board: (number | Ship)[][]) {
  const rows = document.querySelectorAll("#player-row-container");
  rows.forEach((row) => {
    const cells = row.querySelectorAll("#player-cell");
    cells.forEach((cell) => {
      const x = Number(cell.getAttribute("data-x"));
      const y = Number(cell.getAttribute("data-y"));
      if (player.Board && board[x][y] instanceof Ship) {
        if (!cell.classList.contains("bg-sky-600")) {
          cell.classList.add("bg-sky-600");
        }
      } else {
        cell.classList.remove("bg-sky-600");
      }
    });
  });
}
function confirmPlay() {
  const shipCounts = new GameBoard(player.Board).shipCounts();
  if (shipCounts < 5) {
    message.textContent = "Ship size is less than 5";
  }
  if (shipCounts > 5) {
    message.textContent = "Ship size is more than 5";
  }
  if (shipCounts === 5) {
    toggleEdit();
    replace(player.Board);
    gameStart();
    dialog.close();
  }
}
function reset() {
  const board = new GameBoard(player.Board).newBoard();
  player.Board = board;
  const rows = document.querySelectorAll("#player-row-container");
  rows.forEach((row) => {
    const cells = row.querySelectorAll("#player-cell");
    cells.forEach((cell) => {
      if (cell.classList.contains("bg-sky-600")) {
        cell.classList.remove("bg-sky-600");
      }
    });
  });
  replace(board);
}
