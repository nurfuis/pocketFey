import { Battery } from "./components/Battery.js";
import { Motor } from "./components/Motor.js";
import { Transmission } from "./components/Transmission.js";

import { Vector2 } from "./Vector2.js";
import { Sprite } from "./Sprite.js";
import { Animations } from "./Animations.js";
import { FrameIndexPattern } from "./FrameIndexPattern.js";
import {
  DANCE,
  SPIN,
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
import { DOWN, UP, LEFT, RIGHT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT } from "./Input.js";
import { events } from "./Events.js";

import { GameObject } from "./GameObject.js";
import { globalCooldownDuration } from "../config/constants.js";
import { resources } from "./utils/loadResources.js";
import { StateMachine } from "./controllers/StateMachine.js";
import { PLAYER_COLOR } from "./constants.js";
export class Player extends GameObject {
  constructor() {
    super({
      position: new Vector2(48, 48),
    });
    this.brain = "user";
    this.controller = new StateMachine(this);

    this.inventorySize = 8;
    this.canPickUpItems = true;
    this.itemPickUpShell = null;
    this.useAutoInput = false;
    this.showGrid = false;

    this.gcd = 0;

    this.width = 32;
    this.height = 64;

    this.scale = 12;
    this.radius = 16;

    this.facingDirection = DOWN;

    this.powerSupply = new Battery();
    this.powerSupply.storedEnergy = 12000;
    this.powerSupply.storedCapacity = 12000;
    this.powerSupply.dischargeRate = 2; // Amps
    this.motor = new Motor();
    this.motor.KV = 10;

    this.transmission = new Transmission();
    this.transmission.gear = 1;

    this._maxSpeed = this.powerSupply.dischargeRate;

    this._mass = this.radius * this.scale ** 2;

    this._gravity = this.scale ** 2;
    this._drag = this.scale ** 2 / this._mass;

    this._acceleration = new Vector2(0, 0);
    this._velocity = new Vector2(0, 0);

    this.shadow = new Sprite({
      resource: resources.images.shadow,
      frameSize: new Vector2(32, 32),
      position: new Vector2(-32, -52),
      scale: 2,
    });
    this.body = new Sprite({
      resource: resources.images.player,
      frameSize: new Vector2(32, 64),
      hFrames: 3,
      vFrames: 8,
      frame: 1,
      scale: 1,
      position: new Vector2(-16, -54), // offset x, y
      animations: new Animations({
        dance: new FrameIndexPattern(DANCE),
        spin: new FrameIndexPattern(SPIN),
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
  get totalMass() {
    // plus encumberance
    return this._mass + this?.inventory?.items?.length * this.scale ** 2;
  }
  move(direction, world) {
    if (direction) {
      const torque =
        (this.motor.KV *
          this.powerSupply.voltage *
          this.transmission.gearBox[this.transmission.gear].motor) /
        (this.totalMass *
          this.transmission.gearBox[this.transmission.gear].drive);

      switch (direction) {
        case "LEFT":
          if (Math.abs(this._acceleration.x) < this._maxSpeed) {
            this._acceleration.x -= torque;
            this.body.animations.play("walkLeft");
          }
          break;
        case "RIGHT":
          if (Math.abs(this._acceleration.x) < this._maxSpeed) {
            this._acceleration.x += torque;
            this.body.animations.play("walkRight");
          }
          break;
        case "UP":
          if (Math.abs(this._acceleration.y) < this._maxSpeed) {
            this._acceleration.y -= torque;
            this.body.animations.play("walkUp");
          }
          break;
        case "DOWN":
          if (Math.abs(this._acceleration.y) < this._maxSpeed) {
            this._acceleration.y += torque;
            this.body.animations.play("walkDown");
          }
          break;
        case "UP_LEFT":
          if (Math.abs(this._acceleration.x) < this._maxSpeed / 2 &&
            Math.abs(this._acceleration.y) < this._maxSpeed / 2
          ) {
            this._acceleration.x -= torque / Math.sqrt(2);
            this._acceleration.y -= torque / Math.sqrt(2);
            this.body.animations.play("walkLeft");
          }
          break;
        case "UP_RIGHT":
          if (Math.abs(this._acceleration.x) < this._maxSpeed / 2 &&
            Math.abs(this._acceleration.y) < this._maxSpeed / 2
          ) {
            this._acceleration.x += torque / Math.sqrt(2);
            this._acceleration.y -= torque / Math.sqrt(2);
            this.body.animations.play("walkRight");
          }
          break;
        case "DOWN_LEFT":
          if (Math.abs(this._acceleration.x) < this._maxSpeed &&
            Math.abs(this._acceleration.y) < this._maxSpeed / 2
          ) {
            this._acceleration.x -= torque / Math.sqrt(2);
            this._acceleration.y += torque / Math.sqrt(2);
            this.body.animations.play("walkLeft");
          }
          break;
        case "DOWN_RIGHT":
          if (Math.abs(this._acceleration.x) < this._maxSpeed &&
            Math.abs(this._acceleration.y) < this._maxSpeed / 2
          ) {
            this._acceleration.x += torque / Math.sqrt(2);
            this._acceleration.y += torque / Math.sqrt(2);
            this.body.animations.play("walkRight");
          }
          break;
      }
    } else {
      // Reset acceleration to 0 on key release (no input)
      const aX = this._acceleration.x;
      const aY = this._acceleration.y;

      // x friction
      if (aX < 0) {
        this._acceleration.x = aX + this._drag;
      } else if (aX > 0) {
        this._acceleration.x = aX - this._drag;
      }

      if ((aX < 1 && aX > 0) || (aX > -1 && aX < 0)) {
        this._acceleration.x = 0;
      }

      // y friction
      if (aY < 0) {
        this._acceleration.y = aY + this._drag;
      } else if (aY > 0) {
        this._acceleration.y = aY - this._drag;
      }

      if ((aY < 1 && aY > 0) || (aY > -1 && aY < 0)) {
        this._acceleration.y = 0;
      }
    }

    const sag = this.powerSupply.dropoff[this.powerSupply.storedCharge];

    const forceX = this._acceleration.x * this.totalMass * sag;
    const forceY = this._acceleration.y * this.totalMass * sag;

    const vX = forceX / this._mass;
    const vY = forceY / this._mass;

    if (vX < 0 || vX > 0) {
      this._velocity.x = vX * 1 - this._gravity;
    } else if ((vX < 1 && vX > 0) || (vX > -1 && vX < 0)) {
      this._velocity.x = 0;
    }

    if (vY < 0 || vY > 0) {
      this._velocity.y = vY * 1 - this._gravity;
    } else if ((vY < 1 && vY > 0) || (vY > -1 && vY < 0)) {
      this._velocity.y = 0;
    }
    let nextX = this.position.x;
    let nextY = this.position.y;

    switch (this.direction) {
      case "LEFT":
        nextX += vX;
        break;
      case "RIGHT":
        nextX += vX;
        break;
      case "UP":
        nextY += vY;
        break;
      case "DOWN":
        nextY += vY;
        break;
      case "UP_LEFT":
        nextX += vX;
        nextY += vY;
        break;
      case "UP_RIGHT":
        nextX += vX;
        nextY += vY;
        break;
      case "DOWN_LEFT":
        nextX += vX;
        nextY += vY;
        break;
      case "DOWN_RIGHT":
        nextX += vX;
        nextY += vY;
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
      this._velocity = new Vector2(0, 0);
      this._acceleration = new Vector2(0, 0);

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
          this.body.animations.play("dance");
          break;

        default:
          break;
      }
    }
  }
  onPickUpItem(item) {
    console.log(this.inventory.items.length);
    if (this.inventory.items.length > this.inventorySize) {
      this.canPickUpItems = false;
    } else if (
      this.inventory.items.length < this.inventorySize &&
      this.inventory.items.lengt >= 0
    ) {
      this.canPickUpItems = true;
    }
    if (this.itemPickUpShell === null) {
      this.itemPickUpTime = 80;
      this.itemPickUpShell = new GameObject({ x: 0, y: 0 });
      const sprite = new Sprite({
        resource: item.image,
        frameSize: new Vector2(32, 32),
        position: new Vector2(-12, -52),
        scale: 0.75,
      });
      this.itemPickUpShell.addChild(sprite);
      this.addChild(this.itemPickUpShell);
    }
  }
  workOnItemPickUp(delta) {
    this.itemPickUpTime -= delta;
    this.body.animations.play("pickUpDown");
    if (this.itemPickUpTime <= 0) {
      this.itemPickUpShell.destroy();
      this.itemPickUpShell = null;
    }
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
      radius: this.radius,
      canPickUpItems: this.canPickUpItems,
    });
  }
  recoverEnergy() {
    this.body.animations.play("spin");

    this.powerSupply.storedEnergy += 10;
    if (this.powerSupply.storedEnergy > this.powerSupply.storedCapacity / 3) {
      this.isDisabled = false;
    }
  }
  step(delta, root) {
    const layer = this.parent;
    const world = layer.parent;

    this.powerSupply.checkState();
    this.powerSupply.drawPower(this._acceleration);

    if (this.powerSupply.storedCharge == "discharged") {
      this.isDisabled = true;
    }
    if (this.isDisabled) {
      this.recoverEnergy();
      return;
    }

    if (this.itemPickUpTime > 0) {
      this.workOnItemPickUp(delta);
      return;
    }

    const { input } = root;
    const { automatedInput } = root;

    if (!!this.direction) this._lastDirection = this.direction;


    if (this.useAutoInput) {
      this.direction = input.direction || automatedInput.direction;
    } else {
      this.direction = input?.twoDirections || input?.direction || undefined;
    }

    if (this.direction && this.direction != this._lastDirection) {
      this._velocity = new Vector2(0, 0);
      this._acceleration = new Vector2(0, 0);
      this.facingDirection = this.direction;
      return;
    }
    // this.move(this.direction, world);
    this.controller.update(delta, root);

    if (!this.direction) {
      if (this.powerSupply.storedEnergy < this.powerSupply.storedCapacity) {
        switch (this.powerSupply.storedCharge) {
          case "absorb":
            this.powerSupply.storedEnergy += 2;

            break;
          case "bulk":
            this.powerSupply.storedEnergy += 3;

            break;
          case "low":
            this.powerSupply.storedEnergy += 4;

            break;
          default:
            this.powerSupply.storedEnergy += 1;

            break;
        }
      }
    }

    this.keyPress = input.heldKeys;
    if (this.gcd > 0) {
      this.gcd -= delta;
    }
    if (this.keyPress.length > 0 && this.gcd <= 0) {
      this.gcd += globalCooldownDuration;

      console.log(getTile(this.position, world).currentTile.id || undefined);
    }

    this.tryEmitPosition();
  }
  drawCircle(ctx, position, radius) {
    ctx.strokeStyle = PLAYER_COLOR;

    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  drawManaBar(ctx, posX, posY) {
    const width = this.width; // Assuming 'this.width' represents the total width for the bar
    const height = 4;
    let fillColor = "blue";
    const emptyColor = "gray";
    const percentFull = Math.min(
      this.powerSupply.storedEnergy / this.powerSupply.storedCapacity,
      1
    ); // Clamp percentage between 0 and 1
    switch (this.powerSupply.storedCharge) {
      case "discharged":
        fillColor = "gray";
        break;
      case "critical":
        fillColor = "red";
        break;
      case "low":
        fillColor = "orange";
        break;
      case "bulk":
        fillColor = "purple";
        break;
      case "absorb":
        fillColor = "blue";
        break;
      case "float":
        fillColor = "gold";
        break;
      default:
        break;
    }
    // Draw the empty bar outline
    ctx.beginPath();
    ctx.rect(posX, posY, width, height);
    ctx.strokeStyle = emptyColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Draw the filled portion of the bar
    ctx.beginPath();
    ctx.rect(posX, posY, width * percentFull, height); // Fill based on percentage
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.closePath();
  }
  drawImage(ctx) {
    this.drawCircle(ctx, this.position, this.radius);
    const posX = this.position.x;
    const posY = this.position.y;
    // ctx.fillText(`Player: ${posX}, ${posY}  `, posX, posY + 16);
    this.drawCircle(ctx, this.position, this.radius);
    this.drawManaBar(ctx, posX - 16, posY - 44);
  }
}
function getTile(position, world) {
  // console.log(world);
  const background = world.children[0]; // layer id 0
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
        position.x < tile.position.x + tile.width + currentChunk.position.x &&
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
