import { stuck } from "../../abilities/player/ability_stuck";
export const stuckState = {
  update: (entity, delta, root) => stuck(entity, delta, root),
  transitions: {
    noDirection: "idleState",
    
  },
};
