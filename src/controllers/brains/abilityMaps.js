import { idleState } from "../states/player/state_idle";
import { movingState } from "../states/player/state_moving";
import { stuckState } from "../states/player/state_stuck";
import { tryMoveState } from "../states/player/state_tryMove";
import { vegetableState } from "../states/shared/state_vegetable";
import { idleStateAi } from "../states/ai/state_idle_ai";
import { tryMoveStateAi } from "../states/ai/state_tryMove_ai";
import { stuckStateAi } from "../states/ai/state_stuck_ai";
import { movingStateAi } from "../states/ai/state_moving_ai";
import { tryActionState } from "../states/player/state_tryAction";
import { actionState } from "../states/player/state_action";
import { staggerState } from "../states/player/state_stagger";
import { clearState } from "../states/player/state_clear";
import { changeFacingState } from "../states/player/state_changeFacing";


export const user = {
  abilities: {
    changeFacingState: changeFacingState,
    idleState: idleState,
    tryActionState: tryActionState,
    actionState: actionState,
    tryMoveState: tryMoveState,
    stuckState: stuckState,
    movingState: movingState,
    staggerState: staggerState,
    clearState: clearState,
  },
  initial: "idleState",
};

export const vegetable = {
  abilities: {
    vegetableState: vegetableState,
  },
  initial: "vegetableState",
};

export const blob = {
  abilities: {
    idleStateAi: idleStateAi,
    tryMoveStateAi: tryMoveStateAi,
    stuckStateAi: stuckStateAi,
    movingStateAi: movingStateAi,
  },
  initial: "idleStateAi",
};
