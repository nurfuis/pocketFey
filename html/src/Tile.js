import { Sprite } from "./Sprite.js";
import { Vector2 } from "./Vector2.js";
import { GameObject } from "./GameObject.js";

export class Tile extends GameObject {
  constructor(chunk, i, tilesets, tileWidth, tileHeight, coords) {
    super({});
    this.color = "rgb(211,211,211, 0.1)";
    this.strokeColor = "rgb(099,099,099, 1)";
    this.id = chunk.data[i];
    this.tilesets = tilesets;

    this.width = tileWidth;
    this.height = tileHeight;

    this.position.x = coords.x;
    this.position.y = coords.y;

    this.source = this.findMatchingTileset();

    this.showGrid = true;

    if (!!this.source) {
      const hFrames = this.source.image.width / this.width;
      const vFrames = this.source.image.height / this.height;

      const sprite = new Sprite({
        resource: this.source,
        frameSize: new Vector2(this.width, this.height),
        hFrames: hFrames,
        vFrames: vFrames,
        frame: this.id - 1,
      });

      this.addChild(sprite);
    }
  }

  drawImage(ctx) {
    const posX = this.position.x + this.parent.x * this.width;
    const posY = this.position.y + this.parent.y * this.height;

    ctx.beginPath();

    ctx.rect(posX, posY, this.width, this.height);

    const parent1 = this.parent;
    const parent2 = parent1.parent;
    const layerName = parent2.name;

    if (this.showGrid && layerName == "background") {
      ctx.strokeStyle = this.strokeColor;
      ctx.lineWidth = 1;

      ctx.stroke();

      ctx.fillStyle = this.color;
      ctx.fill();
    }
    ctx.closePath();

    ctx.fillStyle = "black";

    ctx.lineWidth = 1;
  }

  ready() {}

  findMatchingTileset() {
    for (let i = 0; i < this.tilesets.length; i++) {
      const data = this.tilesets[i];

      if (this.id >= data["firstgid"]) {
        return data["source"];
        break;
      }
    }
    return null;
  }
}
