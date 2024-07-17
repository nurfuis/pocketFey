import { Vector2 } from "./Vector2.js";
import { Sprite } from "./Sprite.js";
import { Animations } from "./Animations.js";
import { FrameIndexPattern } from "./FrameIndexPattern.js";
import {
  PICK_UP_DOWN,
  STAND_DOWN,
  STAND_LEFT,
  STAND_RIGHT,
  STAND_UP,
  WALK_DOWN,
  WALK_LEFT,
  WALK_RIGHT,
  WALK_UP,
  ATTACK_LEFT,
  ATTACK_UP,
  ATTACK_RIGHT,
  ATTACK_DOWN,
} from "./animations/playerAnimations.js";
import { DOWN, UP, LEFT, RIGHT } from "./Input.js";
import { events } from "./Events.js";

import { GameObject } from "./GameObject.js";
import { globalCooldownDuration } from "../config/constants.js";

export class Player extends GameObject {
  constructor(resources) {
    super({
      position: new Vector2(48, 48),
    });
    this.useAutoInput = false;
    this.showGrid = false;
    this.gcd = 0;
    this.shape = "circle";

    this.width = 32;
    this.height = 64;
    this.radius = 16;

    // speed
    this.speed = 2;

    // direction
    this.facingDirection = DOWN;

    // sprites
    this.shadow = new Sprite({
      resource: resources.images.shadow,
      frameSize: new Vector2(32, 32),
      position: new Vector2(-32, -49),
      scale: 2,
    });
    this.body = new Sprite({
      resource: resources.images.player,
      frameSize: new Vector2(32, 64),
      hFrames: 3,
      vFrames: 8,
      frame: 1,
      scale: 1,
      position: new Vector2(-16, -52), // offset x, y
      animations: new Animations({
        standDown: new FrameIndexPattern(STAND_DOWN),
        standUp: new FrameIndexPattern(STAND_UP),
        standLeft: new FrameIndexPattern(STAND_LEFT),
        standRight: new FrameIndexPattern(STAND_RIGHT),
        walkDown: new FrameIndexPattern(WALK_DOWN),
        walkUp: new FrameIndexPattern(WALK_UP),
        walkLeft: new FrameIndexPattern(WALK_LEFT),
        walkRight: new FrameIndexPattern(WALK_RIGHT),
        pickUpDown: new FrameIndexPattern(PICK_UP_DOWN),
        attackLeft: new FrameIndexPattern(ATTACK_LEFT),
        attackUp: new FrameIndexPattern(ATTACK_UP),
        attackRight: new FrameIndexPattern(ATTACK_RIGHT),
        attackDown: new FrameIndexPattern(ATTACK_DOWN),
      }),
    });

    this.addChild(this.shadow);
    this.addChild(this.body);

    events.on("F3", this, () => (this.useAutoInput = !this.useAutoInput));

    events.on("PLAYER_PICKS_UP_ITEM", this, (data) => {
      this.onPickUpItem(data);
    });
  }

  tryEmitPosition() {
    if (this.lastX == this.position.x && this.lastY == this.position.y) {
      return;
    }
    this.lastX = this.position.x;
    this.lastY = this.position.y;

    events.emit("PLAYER_POSITION", {
      x: this.position.x,
      y: this.position.y,
      cause: "movement",
    });
  }

  step(delta, root) {
    // Get the chunk and tile for a givien position
    const layer = this.parent;
    const world = layer.parent;

    if (this.itemPickUpTime > 0) {
      this.workOnItemPickUp(delta);
    }

    const { input } = root;
    const { automatedInput } = root;

    if (this.useAutoInput) {
      this.direction = input.direction || automatedInput.direction;
    } else {
      this.direction = input.direction;
    }

    this.keyPress = input.heldKeys;

    if (this.gcd > 0) {
      this.gcd -= delta;
    }

    if (this.keyPress.length > 0 && this.gcd <= 0) {
      this.gcd += globalCooldownDuration;

      console.log(getTile(this.position, world).currentTile.id || undefined);
    }

    if (!!this.direction) {
      this.facingDirection = this.direction;
      let nextX = this.position.x;
      let nextY = this.position.y;

      switch (this.direction) {
        case LEFT:
          nextX -= this.speed;
          this.body.animations.play("walkLeft");
          break;

        case RIGHT:
          nextX += this.speed;
          this.body.animations.play("walkRight");
          break;

        case UP:
          nextY -= this.speed;
          this.body.animations.play("walkUp");
          break;

        case DOWN:
          nextY += this.speed;
          this.body.animations.play("walkDown");
          break;

        default:
          break;
      }

      const nextPosition = new Vector2(nextX, nextY);
      const result = getTile(nextPosition, world);

      if (
        !!result.currentTile &&
        result.currentTile.id > 0 &&
        result.currentTile.id < 3
      ) {
        this.position = nextPosition;
      } else {
        // no chunk there
      }
    } else {
      switch (this.facingDirection) {
        case LEFT:
          this.body.animations.play("standLeft");
          break;

        case RIGHT:
          this.body.animations.play("standRight");
          break;

        case UP:
          this.body.animations.play("standUp");
          break;

        case DOWN:
          this.body.animations.play("standDown");
          break;

        default:
          break;
      }
    }

    this.tryEmitPosition();

    function getTile(position, world) {
      const background = world.children[0];
      let currentChunk;
      let currentTile;
      if (background.children.length > 0) {
        background.children.forEach((chunk) => {
          if (
            position.x >= chunk.position.x &&
            position.x < chunk.position.x + chunk.width &&
            position.y >= chunk.position.y &&
            position.y < chunk.position.y + chunk.height
          )
            currentChunk = chunk;
        });
      }

      if (!!currentChunk) {
        currentChunk.children.forEach((tile) => {
          if (
            position.x >= tile.position.x + currentChunk.position.x &&
            position.x <
              tile.position.x + tile.width + currentChunk.position.x &&
            position.y >= tile.position.y + currentChunk.position.y &&
            position.y < tile.position.y + tile.height + currentChunk.position.y
          )
            currentTile = tile;
        });
      } else {
        currentTile = undefined;
      }
      return { currentChunk, currentTile };
    }
  }

  drawImage(ctx) {
    const posX = this.position.x;
    const posY = this.position.y;

    // ctx.fillText(`Player: ${posX}, ${posY}  `, posX, posY + 16);

    // ctx.beginPath();

    // ctx.rect(posX, posY, this.width, this.height);

    // if (this.showGrid) {
    //   ctx.strokeStyle = "blue";
    //   ctx.lineWidth = 1;

    //   ctx.stroke();
    // }
    // ctx.closePath();

    // ctx.lineWidth = 1;
  }
}
