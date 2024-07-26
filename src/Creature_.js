import { Entity } from "./Entity_";
import { Vector2 } from "../../utils/Vector2";
import { UP, DOWN, LEFT, RIGHT } from "../../utils/input/Input";

import { getVonNeumannNeighborIds } from "../../helpers/calc/getVonNeumannNeighborIds";
import { checkAABB, gridSize } from "../src/utils/grid.js";

export class Creature extends Entity {
  constructor() {
    super({
      position: new Vector2(0, 0),
    });
    this.type = "creature";
    this.moveHistory = [];
    this.tryMoveAttempts = 0;

    this.width = gridSize;
    this.height = gridSize;
    this.radius = gridSize / 2;
  }
  scan() {
    const neighbors = getVonNeumannNeighborIds(this);

    let openSpaces = [];

    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      neighbor.isBlocked = checkAABB(neighbor.x, neighbor.y, this).collision;

      if (!neighbor.isBlocked) {
        openSpaces.push(neighbor.direction);
      }
      switch (neighbor.direction) {
        case UP:
          this._up = neighbor;
        case RIGHT:
          this._right = neighbor;
        case DOWN:
          this._down = neighbor;
        case LEFT:
          this._left = neighbor;
      }
    }

    this._openSpaces = openSpaces;

    const numOpenSpaces = openSpaces.length;
    this._numOpenSpaces = numOpenSpaces;

    const randomIndex = Math.floor(Math.random() * numOpenSpaces);
    this._randomOpenDirection = openSpaces[randomIndex];
  }

  step() {
    this.moveHistory.push(this.direction);

    if (this.moveHistory.length > 20) {
      this.moveHistory.shift();
    }

    if (this.brain) {
      this.controller.update();
    }
  }

  drawImage(ctx, x, y) {
    if (this.debug) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "red";
      ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }
  }
}
