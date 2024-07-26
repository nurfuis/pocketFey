import { Vector2 } from "../Vector2.js";

export const gridSize = 32; // TODO move to params and set from tiled

export const gridCells = (n) => {
  return n * gridSize;
};

export const snapToGrid = (position) => {
  let snapToGridX =
    position.x % gridSize < gridSize / 2
      ? Math.floor(position.x / gridSize)
      : Math.ceil(position.x / gridSize);

  let snapToGridY =
    position.y % gridSize < gridSize / 2
      ? Math.floor(position.y / gridSize)
      : Math.ceil(position.y / gridSize);

  return {
    x: Math.round(snapToGridX * gridSize),
    y: Math.round(snapToGridY * gridSize),
  };
};

export const walls = [];
export const checkAABB = (posX, posY, entity1) => {
  for (let i = 0; i < walls.length; i++) {
    const entity2 = walls[i];

    const entity1Left = posX; // check next position x
    const entity1Right = entity1Left + entity1.width;
    const entity1Top = posY; // check next position y
    const entity1Bottom = entity1Top + entity1.height;

    const entity2Left = entity2.positionX;
    const entity2Right = entity2Left + entity2.width;
    const entity2Top = entity2.positionY;
    const entity2Bottom = entity2Top + entity2.height;

    if (
      entity1Right > entity2Left &&
      entity1Left < entity2Right &&
      entity1Bottom > entity2Top &&
      entity1Top < entity2Bottom &&
      entity1 != entity2
    ) {
      return { wall: true, collider: entity1, collidee: entity2 };
    }
  }
  return { wall: false, collider: entity1, collidee: undefined };
};

export function moveTowards(entity, destinationPosition, speed) {
  let distanceToTravelX = destinationPosition.x - entity.position.x;
  let distanceToTravelY = destinationPosition.y - entity.position.y;

  let distance = Math.sqrt(distanceToTravelX ** 2 + distanceToTravelY ** 2);

  if (distance <= speed) {
    entity.position.x = destinationPosition.x;
    entity.position.y = destinationPosition.y;
  } else {
    let normalizedX = distanceToTravelX / distance;
    let normalizedY = distanceToTravelY / distance;

    const newX = entity.position.x + normalizedX * speed;
    const newY = entity.position.y + normalizedY * speed;

    const newPosition = new Vector2(newX, newY).validate();
    entity.position = newPosition;

    distanceToTravelX = destinationPosition.x - entity.position.x;
    distanceToTravelY = destinationPosition.y - entity.position.y;

    distance = Math.sqrt(distanceToTravelX ** 2 + distanceToTravelY ** 2);
  }

  return distance;
}
