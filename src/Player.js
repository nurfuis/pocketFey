import { Vector2 } from "./Vector2";
import { Sprite } from "./Sprite";
import { Animations } from "./Animations";
import { FrameIndexPattern } from "./FrameIndexPattern";
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
} from "./animations/playerAnimations";
import { DOWN, UP, LEFT, RIGHT } from "./Input";
import { events } from "./Events";

import { GameObject } from "./GameObject";
import { globalCooldownDuration } from "./constants";

export class Player extends GameObject {
  constructor(resources) {
    super({
      position: new Vector2(0, 0),
    });
    this.showGrid = true;
    this.gcd = 0;
    this.shape = "circle";

    this.width = 32;
    this.height = 64;
    this.radius = 16;

    // speed
    this.speed = 3;

    // direction
    this.facingDirection = DOWN;

    // sprites
    this.shadow = new Sprite({
      resource: resources.images.shadow,
      frameSize: new Vector2(32, 32),
      position: new Vector2(-16, 10),
      scale: 2,
    });
    this.body = new Sprite({
      resource: resources.images.player,
      frameSize: new Vector2(32, 64),
      hFrames: 3,
      vFrames: 8,
      frame: 1,
      scale: 1,
      position: new Vector2(0, 0), // offset x, y
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
    if (this.itemPickUpTime > 0) {
      this.workOnItemPickUp(delta);
    }

    const { input } = root;

    this.direction = input.direction;

    this.keyPress = input.heldKeys;

    if (this.gcd > 0) {
      this.gcd -= delta;
    }

    if (this.keyPress.length > 0 && this.gcd <= 0) {
      this.gcd += globalCooldownDuration;
      const layer = this.parent;
      const world = layer.parent;

      console.log(input.heldKeys, world.children);
    }

    if (!!this.direction) {
      this.facingDirection = this.direction;

      switch (this.direction) {
        case LEFT:
          this.position.x -= this.speed;
          this.body.animations.play("walkLeft");
          break;

        case RIGHT:
          this.position.x += this.speed;
          this.body.animations.play("walkRight");
          break;

        case UP:
          this.position.y -= this.speed;
          this.body.animations.play("walkUp");
          break;

        case DOWN:
          this.position.y += this.speed;
          this.body.animations.play("walkDown");
          break;

        default:
          break;
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
  }

  drawImage(ctx) {
    const posX = this.position.x;
    const posY = this.position.y;

    ctx.fillText(`Player: ${posX}, ${posY}  `, posX, posY);

    ctx.beginPath();

    ctx.rect(posX, posY, this.width, this.height);

    if (this.showGrid) {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;

      ctx.stroke();
    }
    ctx.closePath();

    ctx.lineWidth = 1;
  }
}
