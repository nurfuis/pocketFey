import { LEFT, RIGHT, UP, DOWN } from "../../../utils/input/Input";
import { gridSize, checkAABB } from "../../../helpers/grid/grid";
const debug = false;
export function tryMoveAi(entity, delta, root) {
  entity.tryMoveAttempts += 1;

  const randomIndex = Math.floor(Math.random() * 4);
  let direction = [LEFT, RIGHT, UP, DOWN][randomIndex];

  let nextX = entity.destinationPosition.x;
  let nextY = entity.destinationPosition.y;

  if (direction == DOWN) {
    nextY += gridSize;
    entity.body.animations.play("moveDown");
  }

  if (direction == UP) {
    nextY -= gridSize;
    entity.body.animations.play("moveUp");
  }

  if (direction == LEFT) {
    nextX -= gridSize;
    entity.body.animations.play("moveLeft");
  }

  if (direction == RIGHT) {
    nextX += gridSize;
    entity.body.animations.play("moveRight");
  }
  const check = checkAABB(nextX, nextY, entity);
  if (!check.wall) {
    entity.destinationPosition.x = nextX;
    entity.destinationPosition.y = nextY;
    entity.direction = direction;
    // entity.pushing = check.collidee;
    // push recently collided with objects to an array and
    // calc movement direction away from those objects
    // function already exists in colliders
  } else {
    entity.pushing = check.collidee;
    if (debug) {
      console.log("pushing", entity.pushing);
    }
  }
  // TODO Something if the move is blocked
  entity.facingDirection = entity._direction ?? entity.facingDirection;
}
