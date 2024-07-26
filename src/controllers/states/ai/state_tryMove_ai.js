import { tryMoveAi } from "../../abilities/ai/ability_tryMove_ai";
export const tryMoveStateAi = {
  update: (entity, delta, root) => tryMoveAi(entity, delta, root),
  transitions: {
    exceedsTryMoveAttempts: "stuckStateAi",
    newDestination: "movingStateAi",
  },
};
