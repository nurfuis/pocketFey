import {
  SHIELD,
  MOVING,
  IDLE,
} from "../../../animations/patterns/slimeAnimations.js";
import { FrameIndexPattern } from "../../../animations/FrameIndexPattern.js";
import { Vector2 } from "../../../utils/Vector2.js";
import { resources } from "../../../utils/Resource.js";
import { Animations } from "../../../animations/Animations.js";
import {
  WOODEN_KETTLE_BOILING,
  WOODEN_KETTLE_EMPTY,
  WOODEN_MASH_TUN_EMPTY,
  WOODEN_MASH_TUN_MASHING,
} from "../../../animations/patterns/woodenAnimations.js";
import { StateMachine } from "../../../controllers/StateMachine.js";
import {
  HOP_DOWN,
  HOP_LEFT,
  HOP_RIGHT,
  HOP_UP,
  IDLE_DOWN,
  IDLE_LEFT,
  IDLE_RIGHT,
  IDLE_UP,
} from "../../../animations/patterns/blobAnimations.js";
import {
  WALK_UP,
  WALK_DOWN,
  WALK_LEFT,
  WALK_RIGHT,
  STAND_DOWN,
  STAND_UP,
  STAND_RIGHT,
  STAND_LEFT,
} from "../../../animations/patterns/playerAnimations.js";

// TODO add type safety errors for all data

export const propertyHandlers = {
  // Property name: function to handle the logic
  light: (newEntity, value) => {
    newEntity.isIlluminated = false;
    newEntity.light(value);
  },
  brain: (newEntity, value) => {
    newEntity.brain = value;
    newEntity.controller = new StateMachine(newEntity);
  },
  direction: (newEntity, value) => {
    newEntity.direction = value;
  },
  shape: (newEntity, value) => {
    newEntity.shape = value;
  },
  layer: (newEntity, value) => {
    newEntity.layer = value;
  },
  "stat.speed": (newEntity, value) => {
    newEntity.speed = value;
  },
  "stat.strength": (newEntity, value) => {
    newEntity.strength = value;
  },
  "stat.agility": (newEntity, value) => {
    newEntity.agility = value;
  },
  "stat.health": (newEntity, value) => {
    newEntity.currentHealth = value;
  },
  "stat.maxHealth": (newEntity, value) => {
    newEntity.maxHealth = value;
  },         
  mien: (newEntity, value) => {
    newEntity.mien = value;
  },
  sensingRadius: (newEntity, value) => {
    newEntity.sensingRadius = value;
  },
  "shadow.offset.x": (newEntity, value) => {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new TypeError(
        "shadow.offset.x must be an integer. Check custom properties of the template in Tiled.",
      );
    }
    newEntity.shadow.position.x = value;
  },
  "shadow.offset.y": (newEntity, value) => {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new TypeError(
        "shadow.offset.y must be an integer. Check custom properties of the template in Tiled.",
      );
    }
    newEntity.shadow.position.y = value;
  }, 
  "shadow.scale": (newEntity, value) => {
    newEntity.shadow.scale = value;
  },   
  "sprite.hFrames": (newEntity, value) => {
    newEntity.body.hFrames = value;
  },
  "sprite.vFrames": (newEntity, value) => {
    newEntity.body.vFrames = value;
  },
  "sprite.frameSize": (newEntity, value) => {
    newEntity.body.frameSize = new Vector2(value, value);
  },
  "sprite.frameWidth": (newEntity, value) => {
    newEntity.body.frameSize.x = value;
  },
  "sprite.frameHeight": (newEntity, value) => {
    newEntity.body.frameSize.y = value;
  },
  "sprite.frame": (newEntity, value) => {
    newEntity.body.frame = value;
  },
  "sprite.spacing": (newEntity, value) => {
    newEntity.body.spacing = value;
  },
  "sprite.resource": (newEntity, value) => {
    const resourceObject = resources.images[value];
    if (resourceObject) {
      newEntity.body.resource = resourceObject;
    } else {
      console.error(`Missing resource: ${value}`);
    }
  },
  "sprite.offset.x": (newEntity, value) => {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new TypeError(
        "sprite.offset.x must be an integer. Check custom properties of the template in Tiled.",
      );
    }
    newEntity.body.position.x = value;
  },
  "sprite.offset.y": (newEntity, value) => {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new TypeError(
        "sprite.offset.y must be an integer. Check custom properties of the template in Tiled.",
      );
    }
    newEntity.body.position.y = value;
  },
  "animations.idle": (newEntity) => {
    if (!newEntity.body.animations) {
      newEntity.body.animations = Animations.create();
    }

    newEntity.body.animations.addAnimation("idle", new FrameIndexPattern(IDLE));
  },
  "animations.moving": (newEntity) => {
    if (!newEntity.body.animations) {
      newEntity.body.animations = Animations.create();
    }
    newEntity.body.animations.addAnimation(
      "moving",
      new FrameIndexPattern(MOVING),
    );
  },
  "animations.shield": (newEntity) => {
    if (!newEntity.body.animations) {
      newEntity.body.animations = Animations.create();
    }
    newEntity.body.animations.addAnimation(
      "shield",
      new FrameIndexPattern(SHIELD),
    );
  },
  "animations.woodenKettleBoiling": (newEntity) => {
    if (!newEntity.body.animations) {
      newEntity.body.animations = Animations.create();
    }
    newEntity.body.animations.addAnimation(
      "woodenKettleBoiling",
      new FrameIndexPattern(WOODEN_KETTLE_BOILING),
    );
  },
  "animations.woodenKettleEmpty": (newEntity) => {
    if (!newEntity.body.animations) {
      newEntity.body.animations = Animations.create();
    }
    newEntity.body.animations.addAnimation(
      "woodenKettleEmpty",
      new FrameIndexPattern(WOODEN_KETTLE_EMPTY),
    );
  },
  "animations.woodenMashTunMashing": (newEntity) => {
    if (!newEntity.body.animations) {
      newEntity.body.animations = Animations.create();
    }
    newEntity.body.animations.addAnimation(
      "woodenMashTunMashing",
      new FrameIndexPattern(WOODEN_MASH_TUN_MASHING),
    );
  },
  "animations.woodenMashTunEmpty": (newEntity) => {
    if (!newEntity.body.animations) {
      newEntity.body.animations = Animations.create();
    }
    newEntity.body.animations.addAnimation(
      "woodenMashTunEmpty",
      new FrameIndexPattern(WOODEN_MASH_TUN_EMPTY),
    );
  },
  animations: (newEntity, value) => {
    if (!newEntity.body.animations) {
      newEntity.body.animations = Animations.create();
    }
    newEntity.bodyType = value;

    if (value === "blob") {
      newEntity.body.animations.addAnimation(
        "moveDown",
        new FrameIndexPattern(HOP_DOWN),
      );
      newEntity.body.animations.addAnimation(
        "moveUp",
        new FrameIndexPattern(HOP_UP),
      );
      newEntity.body.animations.addAnimation(
        "moveLeft",
        new FrameIndexPattern(HOP_LEFT),
      );
      newEntity.body.animations.addAnimation(
        "moveRight",
        new FrameIndexPattern(HOP_RIGHT),
      );

      newEntity.body.animations.addAnimation(
        "idleDown",
        new FrameIndexPattern(IDLE_DOWN),
      );
      newEntity.body.animations.addAnimation(
        "idleUp",
        new FrameIndexPattern(IDLE_UP),
      );
      newEntity.body.animations.addAnimation(
        "idleLeft",
        new FrameIndexPattern(IDLE_LEFT),
      );
      newEntity.body.animations.addAnimation(
        "idleRight",
        new FrameIndexPattern(IDLE_RIGHT),
      );
    }

    if (value === "humanoid") {
      newEntity.body.animations.addAnimation(
        "moveDown",
        new FrameIndexPattern(WALK_DOWN),
      );
      newEntity.body.animations.addAnimation(
        "moveUp",
        new FrameIndexPattern(WALK_UP),
      );
      newEntity.body.animations.addAnimation(
        "moveLeft",
        new FrameIndexPattern(WALK_LEFT),
      );
      newEntity.body.animations.addAnimation(
        "moveRight",
        new FrameIndexPattern(WALK_RIGHT),
      );

      newEntity.body.animations.addAnimation(
        "idleDown",
        new FrameIndexPattern(STAND_DOWN),
      );
      newEntity.body.animations.addAnimation(
        "idleUp",
        new FrameIndexPattern(STAND_UP),
      );
      newEntity.body.animations.addAnimation(
        "idleLeft",
        new FrameIndexPattern(STAND_LEFT),
      );
      newEntity.body.animations.addAnimation(
        "idleRight",
        new FrameIndexPattern(STAND_RIGHT),
      );     
    }
  },
};
