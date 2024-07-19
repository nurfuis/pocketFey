import { GameObject } from "./GameObject.js";
import { Vector2 } from "./Vector2.js";
import { events } from "./Events.js";
import { Sprite } from "./Sprite.js";
import { resources } from "./utils/loadResources.js";
import { player } from "../main.js";
export class Energy extends GameObject {
  constructor() {
    super({
      position: new Vector2(320, 1),
    });
    this.renderEnergy();
  }
  renderEnergy() {
    const sprite = new Sprite({ reource: resources.images.keg });
    this.addChild(sprite);
  }
}
