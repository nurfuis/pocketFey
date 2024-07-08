const debug = false;

const MAP_ID = 0;
const FOREGROUND = 2;

export let gameParams = {};

fetch("./config/gameParams.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    gameParams = data;
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

import { loadResources } from "./src/utils/loadResources.js";
import { loadMap } from "./src/utils/loadMap.js";

import { Vector2 } from "./src/Vector2.js";
import { GameObject } from "./src/GameObject.js";
import { GameLoop } from "./src/GameLoop.js";
import { World } from "./src/World.js";
import { Camera } from "./src/Camera.js";
import { Input } from "./src/Input.js";
import { Player } from "./src/Player.js";

const gameWrapper = createGameWrapper();

const gameCanvasMain = createGameCanvasMain();
const gameCtx = gameCanvasMain.getContext("2d");

const resources = await loadResources();
const mapData = await loadMap(MAP_ID);


const main = new GameObject({ position: new Vector2(0, 0) });
const world = new World();

world.build(resources, mapData);

main.addChild(world);

const camera = new Camera(world);
main.addChild(camera);

const input = new Input(world, camera);
main.input = input;

const player = new Player(resources);
world.children[FOREGROUND].addChild(player);

console.log(main);

const update = (delta) => {
  main.stepEntry(delta, main);
};

const draw = () => {
  gameCtx.clearRect(0, 0, gameCanvasMain.width, gameCanvasMain.height);
  gameCtx.save();

  camera.follow(gameCtx, 0, 0);

  main.draw(gameCtx, 0, 0);

  gameCtx.restore();
};

const gameLoop = new GameLoop(update, draw);
gameLoop.name = "mainLoop";
gameLoop.start();

function createGameCanvasMain() {
  const gameCanvasMain = document.createElement("canvas");
  gameCanvasMain.style.zIndex = "1";
  gameCanvasMain.width = gameParams.width;
  gameCanvasMain.height = gameParams.height;
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

if (debug) {
  console.log(main);
}
