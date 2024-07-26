import { clear } from "../../abilities/player/ability_clear";
export const clearState = {
  update: (entity, delta, root) => clear(entity, delta, root),
  transitions: {
    isStaggered: "clearState",
    notStaggered: "movingState",
  },
};