import { idleAi } from "../../abilities/ai/ability_idle_ai";

export const idleStateAi = {
  update: (entity, delta, root) => idleAi(entity, delta, root),
  transitions: {
    shouldMoveRandomly: "tryMoveStateAi",
  },
};
