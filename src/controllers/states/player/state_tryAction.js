import { tryAction } from "../../abilities/player/ability_tryAction";
export const tryActionState = {
    update: (entity, delta, root) => tryAction(entity, delta, root),
    transitions: {
      isBusy: "actionState",
      isClicking: "tryActionState",
      isNotClicking: "idleState",
    },
  };
  