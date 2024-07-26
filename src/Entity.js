import { entities } from "../main.js";
import { GameObject } from "./GameObject.js";
import { Vector2 } from "./Vector2.js";

export class Entity extends GameObject {
  constructor() {
    super({
      position: new Vector2(0, 0),
    });
    this.speed = 1;
    this.destinationPosition = this.position.duplicate();
    this.moveHistory = [];
    this.tryMoveAttempts = 0;
  }
  moveTowards() {
    let distanceToTravelX = this.destinationPosition.x - this.position.x;
    let distanceToTravelY = this.destinationPosition.y - this.position.y;

    let distance = Math.sqrt(distanceToTravelX ** 2 + distanceToTravelY ** 2);

    if (distance <= this.speed) {
      this.position.x = this.destinationPosition.x;
      this.position.y = this.destinationPosition.y;
    } else {
      let normalizedX = distanceToTravelX / distance;
      let normalizedY = distanceToTravelY / distance;

      const newX = this.position.x + normalizedX * this.speed;
      const newY = this.position.y + normalizedY * this.speed;

      const newPosition = new Vector2(newX, newY).validate();
      this.position = newPosition;
    }
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
  spawn() {
    entities.addChild(this);
    console.log("Entity Spawned: ", this);
  }
}
