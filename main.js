const debug = true;
let scene = 1;

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

let resourcesLoaded = false;
let gameWrapper;
let gameCanvasMain;
let gameCtx;
let mapData;
let main;
let world;

const automatedInput = new AutomatedInput();
const spawner = Spawner.getInstance();

export const player = new Player();
const inventory = new Inventory();
player.inventory = inventory;

export let entities;

const update = (delta) => {
  main.stepEntry(delta, main);
  if (!!entities) sortChildren();

  if (!!spawner.spawnQueue && spawner.spawnQueue.length > 0) {
    spawner.update();
  }
};
const draw = () => {
  gameCtx.clearRect(0, 0, gameCanvasMain.width, gameCanvasMain.height);
  gameCtx.save();

  main?.camera?.follow(gameCtx, 0, 0);

  main.draw(gameCtx, 0, 0);

  gameCtx.restore();

  inventory.draw(gameCtx, 0, 0);
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

function startTurn() {
  gameWrapper = createGameWrapper("turnBased");
  gameCanvasMain = createGameCanvasMain();
  gameCtx = gameCanvasMain.getContext("2d");

  gameCanvasMain.addEventListener("mousedown", (e) => {
    // Get the bounding rectangle of the canvas element
    const rect = gameCanvasMain.getBoundingClientRect();

    // Calculate click offsets relative to the canvas
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    console.log("Click offset:", clickX, clickY);
  });
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

      main.input = new Input(WORLD_WIDTH / COLUMNS, WORLD_HEIGHT / ROWS);
      main.automatedInput = automatedInput;

      world = new Grid();
      main.addChild(world);

      remainingTime = TIMER;
      startTimer();
      gameLoop.start();
      // document.querySelectorAll(".container")[0].style.display = "none";
      gameStarted = true;
    }
  }
}

function createGameCanvasMain() {
  const gameCanvasMain = document.createElement("canvas");
  gameCanvasMain.id = "gameCanvas";
  gameCanvasMain.style.zIndex = "1";

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
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
    switch (scene) {
      case 1:
        startMain();
        break;

      case 2:
        startTurn();
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
async function startMain() {
  if (!resourcesLoaded) {
    console.error("Resources are not loaded");
    return;
  }
  // make new canvas
  gameWrapper = createGameWrapper("world");
  gameCanvasMain = createGameCanvasMain();
  gameCtx = gameCanvasMain.getContext("2d");

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

  if (debug) {
    console.log(main);
  }
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
  switch (scene) {
    case 1:
      break;
    case 2:
      break;
    default:
      break;
  }
});
window.onload = function () {
  if (!AUTO_START) createStartButton();
};
events.on("RESOURCES_LOADED", this, () => {
  resourcesLoaded = true;
  if (!!AUTO_START) {
    switch (scene) {
      case 1:
        startMain();
        break;

      case 2:
        startTurn();
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
