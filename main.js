const debug = true;

import { resources } from "./src/utils/loadResources.js";
import { foreground_id, gameParams } from "./config/constants.js";
import { events } from "./src/Events.js";
import { loadMap } from "./src/utils/loadMap.js";
import { Vector2 } from "./src/Vector2.js";
import { GameObject } from "./src/GameObject.js";
import { GameLoop } from "./src/GameLoop.js";
import { World } from "./src/World.js";
import { Camera } from "./src/Camera.js";
import { Input } from "./src/Input.js";
import { AutomatedInput } from "./src/utils/AutomatedInput.js";
import { Player } from "./src/Player.js";
import { Inventory } from "./src/Inventory.js";
import { Spawner } from "./src/Spawner.js";

let resourcesLoaded = false;
let gameWrapper;
let gameCanvasMain;
let gameCtx;
let mapData;
let main;
let world;

const spawner = Spawner.getInstance();

export const player = new Player();
const inventory = new Inventory();

export let entities;

const update = (delta) => {
  main.stepEntry(delta, main);
  sortChildren();

  if (!!spawner.spawnQueue && spawner.spawnQueue.length > 0) {
    spawner.update();
  }
};
const draw = () => {
  gameCtx.clearRect(0, 0, gameCanvasMain.width, gameCanvasMain.height);
  gameCtx.save();

  main.camera.follow(gameCtx, 0, 0);

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

  startButton.addEventListener("click", () => {
    launch();
    startContainer.style.display = "none";
    console.log("Start!");
  });

  startChild.appendChild(startButton);

  body[0].appendChild(startContainer);
  return startContainer;
}
async function launch() {
  if (!resourcesLoaded) {
    console.warn("Resources are not loaded");
    return;
  }

  gameWrapper = createGameWrapper();
  gameCanvasMain = createGameCanvasMain();
  gameCtx = gameCanvasMain.getContext("2d");

  mapData = await loadMap();

  main = new GameObject({ position: new Vector2(0, 0) });
  world = new World();

  const worldReady = await world.build(mapData);
  console.log("World Ready: ", worldReady);
  main.world = world;
  main.addChild(world);

  entities = main.world.children[foreground_id];

  player.inventory = inventory;

  entities.addChild(player);

  main.camera = new Camera(main.world.tileWidth);
  main.addChild(main.camera);

  main.automatedInput = new AutomatedInput();
  main.input = new Input(
    main.world.tileWidth,
    main.world.tileHeight,
    main.camera
  );

  if (debug) {
    console.log(main);
  }
  gameLoop.start();
}

window.onload = function () {
  createStartButton();
};

events.on("RESOURCES_LOADED", this, () => {
  resourcesLoaded = true;
  launch();
  console.log("Resources are Loaded: ", resources);
});
