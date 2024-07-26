import { doNothing } from "../../abilities/shared/ability_doNothing";

export const vegetableState = {
  update: (entity) => doNothing(entity),
  transitions: {
    isVegetable: "vegetableState",
    isNotVegetable: "vegetableState",
  },
};
