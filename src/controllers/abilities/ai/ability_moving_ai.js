import { moveTowards } from "../../../helpers/grid/grid";
export function movingAi(entity, delta, root) {
  entity.tryMoveAttempts = 0;
  moveTowards(entity, entity.destinationPosition, entity.speed);
}
