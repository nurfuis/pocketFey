import gameParams from "../../../config/game_params.json";

import { log } from "../../helpers/log.js";
import { GameObject } from "../GameObject.js";
import { Vector2 } from "../../utils/Vector2.js";
import { events } from "../../utils/Events.js";
import { generateUniqueId } from "../../helpers/calc/nextId.js";

import { Spawner } from "../../managers/Spawner.js";
import { RectangleCollider } from "../../helpers/colliders/type/RectangleCollider.js";
import { CircleCollider } from "../../helpers/colliders/type/CircleCollider.js";
import { CollisionManager } from "../../managers/CollisionManager.js";
import { Workstation } from "../../helpers/colliders/type/Workstation.js";

import { LightSource } from "../../helpers/tech/LightSource.js";
import { BASE_SPEED } from "../../constants.js";
import { gridSize } from "../../helpers/grid/grid.js";

const validLayers = gameParams.layers;

// spawn
function spawn(entity) {
  if (entity.isSpawned) {
    log("warn", `${entity.entityId}`, "is already spawned");
    return;
  } else {
    entity.show();
    entity.activate();

    if (entity.shape) {
      entity.isCollidable = true;
    }
    entity.spawnStep();
  }
}

function despawn(entity) {
  Spawner.getInstance().removeChild(entity);
  entity.deactivate();
  entity.hide();
  entity.isCollidable = false;
  // do last steps
  if (entity.respawnDelay && entity.respawnDelay > 0) {
    events.emit("DELAYED_RESPAWN", entity);
  } else {
    // drop inventory and destroy
    // console.log('destroy')
    entity.destroy();
  }
}

function enableCollision(entity) {
  if (!entity.isCollidable && entity.shape) {
    const shape = entity.shape;

    let collider;

    if (shape === "circle") {
      collider = new CircleCollider(entity);
    } else if (shape === "rectangle") {
      collider = new RectangleCollider(entity);
    } else if (shape === "workstation") {
      collider = new Workstation(entity);
    } else {
      log("warn", `No valid collider shape set for ${entity.name}`);
    }

    entity.collider = collider; // Store reference for deactivation
    return true;
  } else if (!entity.shape) {
    log(
      "warn",
      "Entity",
      ` ${entity.name} ${entity.entityId}`,
      "must have a shape to use collision.",
    );
  } else if (!entity.isCollidable) {
    log(
      "warn",
      "Entity",
      `${entity.name} isCollidable ${entity.isCollidable} `,
    );
  }
}

// turn off collision
function disableCollision(entity) {
  if (entity.isCollidable && entity.collider) {
    CollisionManager.getInstance().removeCollider(entity.collider);
    entity.collider = null; // Remove reference

  }
}

export class Entity extends GameObject {
  constructor() {
    super({
      position: new Vector2(0, 0),
    });
    this.type = "entity";
    this.debug = false;
    this.speed = BASE_SPEED;
    this.baseSpeed = BASE_SPEED;

    events.on("TOGGLE_DEBUG", this, () => {
      this.debug = this.debug ? false : true;
    });
  }
  // Type
  get type() {
    if (this._type) {
      return this._type;
    } else {
      log("warn", `${this.name} doesn't have a type`);
      return undefined;
    }
  }
  set type(string) {
    this._type = string;
  }

  // Unique id
  get entityId() {
    return this._entityId;
  }
  set entityId(string) {
    this._entityId = string;
  }

  // Name
  get name() {
    return this._name;
  }
  set name(string) {
    this._name = string;
  }

  // Brain
  get brain() {
    return this._brain;
  }
  set brain(value) {
    this._brain = value;
  }

  // scene layer
  get layer() {
    return this._layer ?? undefined;
  }
  set layer(newLayer) {
    if (!validLayers.includes(newLayer)) {
      throw new Error(
        `Invalid layer: '${newLayer}'. Must be one of: ${validLayers}`,
      );
    }
    this._layer = newLayer;
  }

  // Chunk coords
  get chunkPosition() {
    return this._chunkPosition;
  }
  set chunkPosition(position) {
    this._chunkPosition = new Vector2(position.x, position.y);
  }

  // Chunk Id
  get chunkId() {
    return this._chunkId;
  }
  set chunkId(chunkId) {
    this._chunkId = chunkId;
  }

  // is Spawned
  get isSpawned() {
    return this._isSpawned;
  }
  set isSpawned(bool) {
    if (bool) {
      spawn(this);
    } else {
      despawn(this);
    }
    this._isSpawned = bool;
  }

  // Destination position
  get destinationPosition() {
    return this._destinationPosition;
  }
  set destinationPosition(position) {
    this._destinationPosition = new Vector2(position.x, position.y);
  }
  get destinationtWorld() {
    return this._destinationWorld;
  }
  set destinationWorld(world) {
    this._destinationWorld = world;
  }

  // Direction (overwrite this on player / creature to use input vs scan?)
  get direction() {
    return this._direction;
  }
  set direction(string) {
    this._direction = string;
  }

  // Speed
  get speed() {
    return this._speed;
  }
  set speed(float) {
    this._speed = float;
  }

  // Visibility
  get invisible() {
    return this._invisible;
  }
  set invisible(bool) {
    this._invisible = bool;
  }

  // Paused
  get inactive() {
    return this._inactive;
  }
  set inactive(bool) {
    this._inactive = bool;
  }

  // collision
  get isCollidable() {
    return this._isCollidable;
  }
  set isCollidable(bool) {
    if (bool) {
      enableCollision(this);
    } else {
      disableCollision(this);
    }
    this._isCollidable = bool;
  }

  // impassable
/*   get isImpassable() {
    return this._isImpassable;
  }
  set isImpassable(bool) {
    if (bool) {
      enableObstacle(this);
    } else {
      disableObstacle(this);
    }
    this._isImpassable = bool;
  } */
  
  // shape
  get shape() {
    return this._shape ?? undefined;
  }
  set shape(value) {
    this._shape = value;
  }
  get radius() {
    if (!this._radius) {
      return gridSize / 2;
    }
    return this._radius;
  }
  set radius(value) {
    this._radius = value;
  }

  // find nearby spawned entities
  findSpawnedEntities() {
    const spawnedEntities = Spawner.getInstance().spawnedEntities;

    if (spawnedEntities) {
      return spawnedEntities;
    } else {
      log("warn", "There are no spawned entities to find");
    }
  }

  // return closest entity within radius
  closestEntity(radius) {
    if (typeof radius !== "number" || radius <= 0) {
      throw new Error("Invalid radius parameter: must be a positive number.");
    }
    const entities = Spawner.getInstance().spawnedEntities.filter(
      (object) => object.type === "entity",
    );

    let closestEntity;
    let smallestDistance = Infinity;
    for (const entity of entities) {
      const distance = this.position.distanceToEntity(entity);
      if (distance < smallestDistance && distance <= radius) {
        smallestDistance = distance;
        closestEntity = entity;
      }
    }
    return closestEntity;
  }

  // find all spawned players
  findPlayers() {
    const players = Spawner.getInstance().spawnedEntities.find(
      (object) => object.type === "player",
    );
    return players;
  }

  // return a nearby player
  closestPlayer(radius) {
    if (typeof radius !== "number" || radius <= 0) {
      throw new Error("Invalid radius parameter: must be a positive number.");
    }
    const players = Spawner.getInstance().spawnedEntities.filter(
      (object) => object.type === "player",
    );

    let closestPlayer;
    let smallestDistance = Infinity;
    for (const player of players) {
      const distance = this.position.distanceToEntity(player);
      if (distance < smallestDistance && distance <= radius) {
        smallestDistance = distance;
        closestPlayer = player;
      }
    }
    // log("info", "checking for player", `${closestPlayer}`)

    return closestPlayer;
  }
  // return a nearby player
  closestLiving(radius) {
    if (typeof radius !== "number" || radius <= 0) {
      throw new Error("Invalid radius parameter: must be a positive number.");
    }

    const living = Spawner.getInstance().spawnedEntities.filter(
      (entity) => entity.type === "player" || entity.type === "creature",
    );
    let closestLiving;
    let smallestDistance = Infinity;

    for (const being of living) {
      const distance = this.position.distanceToEntity(being);
      if (distance < smallestDistance && distance <= radius) {
        smallestDistance = distance;
        closestLiving = being;
        // console.log(closestLiving)
      }
    }

    return closestLiving;
  }
  // direction towards
  findDirectionTowards(entity) {
    const dx = entity.center.x - this.center.x;
    const dy = entity.center.y - this.center.y;
    const angle = Math.atan2(dy, dx);
    return this.position.calculateFacingDirection(angle);
  }

  // direction away from (array)
  findDirectionAway(entities) {
    let averageX = 0;
    let averageY = 0;

    for (const entity of entities) {
      averageX += entity.position.x - this.position.x;
      averageY += entity.position.y - this.position.y;
    }

    const averageAngle = Math.atan2(averageY, averageX);
    const oppositeAngle = averageAngle + Math.PI;

    return this.calculateFacingDirection(oppositeAngle);
  }

  light(float) {
    if (!this.isIlluminated) {
      this.lightSource = new LightSource(this);
      this.lightSource.add(float);
      this.isIlluminated = true;
    } else {
      lightSource.remove();
      this.lightSource = null;
      this.isIlluminated = false;
    }
    // Optionally update UI or game elements based on light state
  }

  // change visibility with effects
  show() {
    this.invisible = false;

    // this.startAnimation("idle");
    // this.playSound("appear");
  }

  // hide with effects
  hide() {
    this.invisible = true;
  }

  // unpause and enable collisions
  activate() {
    this.inactive = false;
  }

  // pause and disable collision
  deactivate() {
    this.inactive = true;
  }

  // join
  joinWorld(x, y, world) {
    if (!this.entityId) {
      this.entityId = `${this.type}-${generateUniqueId()}`;
    }

    if (!this.originPosition) {
      this.originPosition = { x: x, y: y };
      this.originWorld = world;
    }

    this.position = { x: x, y: y };
    this.currentWorld = world;

    this.destinationPosition = { x: x, y: y };

    // add player to a layer
  }

  // spawn step
  spawnStep() {
    // ...
  }

  // despawn

  onCollision() {
    // ...
  }
  // respawn
  respawn() {
    this.position = { x: this.originPosition.x, y: this.originPosition.y };
    this.destinationPosition = {
      x: this.originPosition.x,
      y: this.originPosition.y,
    };
    this.revive();
    this.spawn();
  }

  // display name
  displayName(ctx) {
    if (this.name) {
      ctx.fillText(`${this.name}`, this.position.x, this.position.y - 12);
    }
  }

  // display type
  displayEntityType(ctx) {
    if (this.debug) {
      ctx.fillText(
        `${this.type}`,
        this.position.x,
        this.position.y + this.height + 12,
      );
    }
  }

  // ready step
  ready() {}

  // draw image
  drawImage(ctx) {
    // ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    // ctx.fillText(`${this.layer}`, this.position.x, this.position.y - 12);
  }
}
