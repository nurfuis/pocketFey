import { tryMove } from "../../abilities/player/ability_tryMove";
export const tryMoveState = {
  update: (entity, delta, root) => tryMove(entity, delta, root),
  transitions: {
    newDestination: "movingState",
    hasDirection: "stuckState",
    hasArrived: "idleState",
  },
};
