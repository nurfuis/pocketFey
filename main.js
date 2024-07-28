const debug = true;
let mode = 1;

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

import { resources } from "./src/utils/loadResources.js";
import { foreground_id, gameParams } from "./config/constants.js";
import { events } from "./src/Events.js";
import { loadMap } from "./src/utils/loadMap.js";
import { Vector2 } from "./src/Vector2.js";
import { GameObject } from "./src/GameObject.js";
import { GameLoop } from "./src/GameLoop.js";
import { World } from "./src/World.js";
import { Grid } from "./src/Grid.js";
import { Camera } from "./src/Camera.js";
import { Input } from "./src/Input.js";
import { AutomatedInput } from "./src/utils/AutomatedInput.js";
import { Player } from "./src/Player.js";
import { Inventory } from "./src/Inventory.js";
import { Spawner } from "./src/Spawner.js";
import {
  AUTO_START,
  COLUMNS,
  ROWS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "./src/constants.js";

const gameWrapper = createGameWrapper();
const gameCanvasMain = createGameCanvasMain();
const ctx = gameCanvasMain.getContext("2d");

const offscreenCanvas = createGameOffscreenCanvas();
const offscreenCtx = offscreenCanvas.getContext("2d");

let mapData;
let main;
let world;

export const player = new Player();
const inventory = new Inventory();
player.inventory = inventory;

export let entities;

const spawner = Spawner.getInstance();
const automatedInput = new AutomatedInput();

const update = (delta) => {
  if (!!spawner.spawnQueue && spawner.spawnQueue.length > 0) {
    spawner.update();
  }

  main.stepEntry(delta, main);

  if (!!entities) sortChildren();
};
const draw = () => {
  ctx.clearRect(0, 0, gameCanvasMain.width, gameCanvasMain.height);
  ctx.save();

  main?.camera?.follow(ctx, 0, 0);

  main.draw(ctx, 0, 0);

  ctx.restore();

  offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  ctx.drawImage(offscreenCanvas, 0, 0);

  inventory.draw(ctx, 0, 0);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.name = "mainLoop";

function sortChildren() {
  entities.children.sort((a, b) => {
    const aQuadrant =
      a.position.x >= 0
        ? a.position.y >= 0
          ? 1
          : 4
        : a.position.y >= 0
        ? 2
        : 3;
    const bQuadrant =
      b.position.x >= 0
        ? b.position.y >= 0
          ? 1
          : 4
        : a.position.y >= 0
        ? 2
        : 3;

    if (aQuadrant !== bQuadrant) {
      return aQuadrant - bQuadrant;
    } else {
      if (a.position.y !== b.position.y) {
        return a.position.y - b.position.y;
      } else {
        return a.position.x - b.position.x;
      }
    }
  });
}
function createGameOffscreenCanvas() {
  const gameOffscreenCanvas = document.createElement("canvas");
  gameOffscreenCanvas.width = WORLD_WIDTH;
  gameOffscreenCanvas.height = WORLD_HEIGHT;

  return gameOffscreenCanvas;
}
function createGameCanvasMain() {
  const gameCanvasMain = document.createElement("canvas");
  gameCanvasMain.id = "gameCanvas";
  gameCanvasMain.style.zIndex = "1";

  gameCanvasMain.width = windowWidth;
  gameCanvasMain.height = windowHeight;

  gameCanvasMain.style.backgroundColor = gameParams.backgroundColor;

  gameWrapper.appendChild(gameCanvasMain);
  return gameCanvasMain;
}
function createGameWrapper() {
  const body = document.getElementsByTagName("body");
  const gameWrapper = document.createElement("div");
  gameWrapper.style.position = "relative";
  gameWrapper.style.display = "flex";
  gameWrapper.style.justifyContent = "center";
  gameWrapper.style.alignItems = "center";
  body[0].appendChild(gameWrapper);
  return gameWrapper;
}
function createStartButton() {
  const body = document.getElementsByTagName("body");

  const startContainer = document.createElement("div");
  startContainer.classList.add("container");

  const startChild = document.createElement("div");
  startContainer.appendChild(startChild);

  const startButton = document.createElement("button");
  startButton.textContent = "Start";
  startButton.id = "start";
  startButton.addEventListener("click", () => {
    switch (mode) {
      case 1:
        startMain();
        break;

      case 2:
        startTurnBased();
        break;
      default:
        //
        break;
    }
    startContainer.remove();
    console.log("Start!");
  });

  startChild.appendChild(startButton);

  body[0].appendChild(startContainer);
  return startContainer;
}
function startTurnBased() {
  const TIMER = 600;

  let gameStarted = false;
  let remainingTime = TIMER;
  let timerInterval;

  function endTurn() {
    gameLoop.stop();
    gameLoop.isPaused = true;
    gameStarted = false;
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      remainingTime--;
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        endTurn();
      }
    }, 1000);
  }

  function advance() {
    remainingTime = TIMER;
    startTimer();
    gameLoop.start();
    gameStarted = true;
  }
  init();
  function init() {
    if (!gameStarted) {
      main = new GameObject({ position: new Vector2(0, 0) });

      main.input = new Input(windowWidth / COLUMNS, windowHeight / ROWS);
      main.automatedInput = automatedInput;

      world = new Grid();
      main.addChild(world);

      remainingTime = TIMER;
      startTimer();

      gameStarted = true;

      gameCanvasMain.addEventListener("mousedown", (e) => {
        const rect = gameCanvasMain.getBoundingClientRect();

        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        console.log("Click offset:", clickX, clickY);
      });

      gameLoop.start();
    }
  }
}
async function startMain() {
  mapData = await loadMap();
  main = new GameObject({ position: new Vector2(0, 0) });
  world = new World();

  const worldReady = await world.build(mapData);
  if (debug) console.log("World Ready: ", worldReady);

  main.addChild(world);

  entities = world.children[foreground_id];
  entities.addChild(player);

  const camera = new Camera(world.tileWidth);
  main.camera = camera;
  main.addChild(main.camera);

  main.automatedInput = automatedInput;
  main.input = new Input(world.tileWidth, world.tileHeight, main.camera);

  if (debug) console.log(main);

  gameCanvasMain.addEventListener("mousedown", (e) => {
    const rect = gameCanvasMain.getBoundingClientRect();

    const clickX =
      e.clientX - rect.left - main.camera.position.x - world.tileWidth;
    const clickY =
      e.clientY - rect.top - main.camera.position.y - world.tileHeight;

    console.log("Click offset:", clickX, clickY);
  });
  gameLoop.start();
}
events.on("F1", this, () => {
  switch (mode) {
    case 1:
      startMain();
      break;
    case 2:
      startTurnBased();
      break;
    default:
      break;
  }
});
window.onload = function () {
  if (!AUTO_START) createStartButton();
};
events.on("RESOURCES_LOADED", this, () => {
  if (!!AUTO_START) {
    switch (mode) {
      case 1:
        startMain();
        break;

      case 2:
        startTurnBased();
        break;
      default:
        //
        break;
    }
    const startScreen = document.querySelectorAll(".container")[0];
    if (!!startScreen) startScreen.remove();
  }
  console.log("Resources are Loaded: ", resources);
});
