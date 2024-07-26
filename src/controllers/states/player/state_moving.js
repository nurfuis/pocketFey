import { moving } from "../../abilities/player/ability_moving";
export const movingState = {
  update: (entity, delta, root) => moving(entity, delta, root),
  transitions: {
    hasCollision: "staggerState",
    newDestination: "movingState",
    hasArrived: "tryMoveState",
  },
};
