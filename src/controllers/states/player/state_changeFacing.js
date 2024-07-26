import { changeFacing } from "../../abilities/player/ability_changeFaceing";
export const changeFacingState = {
  update: (entity, delta, root) => changeFacing(entity, delta, root),
  transitions: {
    isNotFacingDirection: "changeFacingState",
    hasTurnDelay: "changeFacingState",
    isFacingDirection: "idleState",
    noTurnDelay: "idleState",
  },
};