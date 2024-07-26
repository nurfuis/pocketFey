import { LEFT, RIGHT, UP, DOWN } from "../../../utils/input/Input";
export function idle(entity, delta, root) {
  if (entity.facingDirection === LEFT) {
    entity.body.animations.play("standLeft");
  }
  if (entity.facingDirection === RIGHT) {
    entity.body.animations.play("standRight");
  }
  if (entity.facingDirection === UP) {
    entity.body.animations.play("standUp");
  }
  if (entity.facingDirection === DOWN) {
    entity.body.animations.play("standDown");
  }
}
