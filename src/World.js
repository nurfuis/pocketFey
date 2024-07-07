import { GameObject } from "./GameObject.js";
import { Layer } from "./Layer.js";

export class World extends GameObject {
  constructor(mapId) {
    super({});

    this.mapId = mapId;

    this.tilesets = [];

    // this.limit = 1000;
    // this.counter = 0;
  }

  step(delta, root) {
    // if (root.input.heldDirections.length > 0) {
    //   console.log(root.input.heldDirections);
    // }
    // const quarter = this.limit / 4;
    // const half = this.limit / 2;
    // const threeQuarter = quarter + half;
    // if (this.counter <= quarter) {
    //   this.counter++;
    //   this.position.x++;
    // } else if (this.counter > quarter && this.counter <= half) {
    //   this.counter++;
    //   this.position.y++;
    // } else if (this.counter > half && this.counter <= threeQuarter) {
    //   this.counter++;
    //   this.position.x--;
    // } else if (this.counter > threeQuarter && this.counter <= this.limit) {
    //   this.counter++;
    //   this.position.y--;
    // } else if (this.counter > this.limit) {
    //   this.counter = 0;
    // } else {
    //   console.log("ERROR");
    // }
  }

  build(resources, mapData) {
    for (const tileSet of mapData["tilesets"]) {
      const stub = tileSet["source"].split("/");
      const filePath = stub[stub.length - 1].replace(".tsx", "");

      this.tilesets.push({
        firstgid: tileSet["firstgid"],
        source: resources.images[filePath],
      });
    }

    this.tileWidth = mapData["tilewidth"];
    this.tileHeight = mapData["tileheight"];

    for (const layer of mapData["layers"]) {
      const newLayer = new Layer(layer, this.tileWidth, this.tileHeight, this.tilesets);
      this.addChild(newLayer);
    }
  }
}
