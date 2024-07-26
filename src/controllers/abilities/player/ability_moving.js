import { moveTowards } from "../../../helpers/grid/grid";
export function moving(entity, delta, root) {
  moveTowards(entity, entity.destinationPosition, entity.speed);
}