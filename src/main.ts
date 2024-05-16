import Reference from "./layout/DOMReferencer";
import {
  computerCellClicked,
  generateGrid,
  makeComputerCellsFunction,
  toggleEdit,
} from "./layout/GridLayout";
import "./index.css";
import validateInput from "./layout/ValidateInput";
import CreateElements from "./layout/CreateElement";
import Player from "./Utils/Player";
import Ship from "./Utils/Ship";
import CustomizeShips from "./layout/CustomizeBoard";

let player: Player;
let palyerBoardGUI: {
  dialog: HTMLDialogElement;
  playersBoard: HTMLDivElement;
};
let computer: Player;
const nextButton = Reference.byId<HTMLButtonElement>("next");
nextButton?.addEventListener("click", (e) => ButtonClicked(e));

const input = Reference.byId<HTMLInputElement>("player-name-input");
input?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && ButtonClicked) ButtonClicked(e);
});
function ButtonClicked(e: Event): void {
  const buildShipWrapper = Reference.byId<HTMLDivElement>("build-ship-wrapper");
  if (e.type === "keydown")
    e.target?.removeEventListener("keydown", ButtonClicked);
  if (!validateInput(input)) {
    const label = Reference.byId<HTMLLabelElement>("player-name-input-label");
    label?.classList.add("text-red-400");
    const classadd = new CreateElements(input as HTMLInputElement).setClass(
      "ring-2 ring-red-500"
    );
    setTimeout(() => {
      label?.classList.remove("text-red-400");
      classadd.removeClass("ring-2 ring-red-500");
    }, 2000);
    return;
  }
  const playerBoardTitle = Reference.byId<HTMLDivElement>("player-board-title");
  if (playerBoardTitle) {
    if (input?.value) {
      playerBoardTitle.textContent = input.value;
    } else {
      // Handle the case where input.value is undefined (optional)
      playerBoardTitle.textContent = "Player"; // Set to empty string or default value
    }
  }
  toggleEdit();
  player = new Player(input?.value);
  computer = new Player("computer");
  computer.BoardManager.randomize();

  if (buildShipWrapper) {
    const beforeGame = Reference.byId<HTMLDivElement>("before-game");
    if (beforeGame) beforeGame.style.display = "none";
    const duringGmae = Reference.byId<HTMLDivElement>("during-game");
    if (duringGmae) duringGmae.style.display = "block";

    palyerBoardGUI = CustomizeShips(player);
    buildShipWrapper.appendChild(palyerBoardGUI.dialog);
    palyerBoardGUI.dialog.inert = true;
    palyerBoardGUI.dialog.showModal();
    palyerBoardGUI.dialog.inert = false;
    if (nextButton) nextButton.style.display = "none";
  }
}
//Player
const playerContainer = Reference.byId<HTMLDivElement>("player");
playerContainer?.appendChild(generateGrid(10, 10, "player"));

//computer
const computerContainer = Reference.byId<HTMLDivElement>("computer");
const computerBoardGUI = generateGrid(10, 10, "computer");
computerContainer?.appendChild(computerBoardGUI);

//Game Logics
export function gameStart() {
  updateShipCounts();
  updateTurns(true);
  makeComputerCellsFunction(computer);
}
//Update Ship Counts
export function updateShipCounts(): void {
  const playersShip = Reference.byId<HTMLTableCellElement>(
    "ships-remaining-player"
  );
  const computerShip = Reference.byId<HTMLTableCellElement>(
    "ships-remaining-computer"
  );
  if (playersShip)
    playersShip.textContent = String(player.BoardManager.shipCounts());
  if (computerShip)
    computerShip.textContent = String(computer.BoardManager.shipCounts());
}
//Update Turns
export function updateTurns(playerTurn: boolean) {
  if (playerTurn !== undefined && playerTurn === true) {
    toggleEdit(true);
  } else {
    toggleEdit(false);
  }
  updateMissedCounts();
  updateShipCounts();
  if (player.BoardManager.GameOver) {
    announceWinner("computer");
  } else if (computer.BoardManager.GameOver) {
    announceWinner("player");
  }
}
function updateMissedCounts() {
  const playerStat = document.querySelector(
    "#total-missed-player"
  ) as HTMLTableCellElement;
  const computerStat = document.querySelector(
    "#total-missed-computer"
  ) as HTMLTableCellElement;
  const playerData = player.BoardManager.missedShots.missedShotsCount;
  const computerData = computer.BoardManager.missedShots.missedShotsCount;
  playerStat.textContent = String(computerData);
  computerStat.textContent = String(playerData);
}
export function computerAttack() {
  const randomCoordinate = computer.BoardManager.getRandom();
  const x = randomCoordinate?.x as number;
  const y = randomCoordinate?.y as number;

  let cell;
  if (x !== undefined && y !== undefined) {
    cell = getCell(x, y);
  }
  player.BoardManager.receiveAttack([x, y]);

  if (player.Board[x][y] instanceof Ship) {
    cell?.classList.replace("bg-sky-600", "bg-red-600");
  } else if (cell?.getAttribute("clicked") !== "true") {
    cell?.classList.add("bg-white");
  }
  markClicked(x, y);
  updateTurns(true);
}
export function getCell(
  x: number,
  y: number,
  id: string = "player"
): HTMLDivElement | undefined {
  const cells = document.querySelectorAll(`#${id}-cell`);
  for (const cell of cells) {
    const dataX = cell.getAttribute("data-x");
    const dataY = cell.getAttribute("data-y");
    if (dataX === String(x) && dataY === String(y)) {
      return cell as HTMLDivElement;
    }
  }
  return undefined;
}
export function markClicked(x: number, y: number, id: string = "player") {
  const cell = getCell(x, y, id);
  if (cell) {
    cell.setAttribute("clicked", "true");
    cell.removeEventListener("click", (e) => computerCellClicked(e, computer));
  }
}
function announceWinner(winner: string = "player") {
  const dialog = new CreateElements<HTMLDialogElement>(
    "dialog",
    "winner-dialog"
  )
    .setClass(
      "p-32 backdrop:backdrop-blur-3xl text-3xl font-sedanSC text-green-600 bg-gray-900 outline-none rounded-xl text-center flex flex-col gap-4"
    )
    .build();
  const text = new CreateElements<HTMLHeadingElement>("h4").build();
  dialog.appendChild(text);
  if (player && player.getName !== undefined) {
    text.textContent =
      winner === "player" ? `${player.getName} wins!` : `Computer wins! Cry!`;
  } else {
    text.textContent = "Something's messed up!";
  }
  const reLoad = new CreateElements<HTMLButtonElement>("button", "reload")
    .setClass(
      "p-1 rounded-md hover:bg-slate-50 hover:text-blue-800 active:translate-y-2 bg-blue-500 text-white"
    )
    .build();
  reLoad.addEventListener("click", () => {
    location.reload();
  });
  reLoad.textContent = "Reload";
  dialog.appendChild(reLoad);
  document.body.appendChild(dialog);
  dialog.showModal();
}
