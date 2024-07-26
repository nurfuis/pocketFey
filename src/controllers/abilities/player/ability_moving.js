import { moveTowards } from "../../../utils/grid.js";
export function moving(entity, delta, root) {
  moveTowards(entity, entity.destinationPosition, entity.speed);
}
