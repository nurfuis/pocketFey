import { LEFT, RIGHT, UP, DOWN } from "../../../utils/input/Input";
import { gridSize, snapToGrid, checkAABB } from "../../../helpers/grid/grid";
const debug = false;
export function tryMove(entity, delta, root) {
  let nextX = entity.destinationPosition.x;
  let nextY = entity.destinationPosition.y;

  if (entity._direction == DOWN) {
    nextY += gridSize;
    entity.body.animations.play("walkDown");
  }

  if (entity._direction == UP) {
    nextY -= gridSize;
    entity.body.animations.play("walkUp");
  }

  if (entity._direction == LEFT) {
    nextX -= gridSize;
    entity.body.animations.play("walkLeft");
  }

  if (entity._direction == RIGHT) {
    nextX += gridSize;
    entity.body.animations.play("walkRight");
  }
  const check = checkAABB(nextX, nextY, entity);
  if (!check.wall) {
    const newPosition = snapToGrid({ x: nextX, y: nextY });
    entity.destinationPosition.x = Math.floor(newPosition.x);
    entity.destinationPosition.y = Math.floor(newPosition.y);
    entity.pushing = check.collidee;
  } else {
    entity.pushing = check.collidee;
    // console.log(check.collidee)

  }
  // TODO Something if the move is blocked
  entity.facingDirection = entity._direction ?? entity.facingDirection;
  return check;
}
