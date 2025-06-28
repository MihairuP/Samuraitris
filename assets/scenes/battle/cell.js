import { IMG_BATTLE } from "../../common/keys.js";
import { Grid } from "./grid.js";

export class GridCell {
  /**
   * @costructor also creates image and add its it to grid container
   * @param {Grid} grid
   * @param {number} x
   * @param {number} y
   */
  constructor(grid, x, y) {
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.scene = grid.scene;
    this.occupied = false;
    this.color = IMG_BATTLE.WHITE;
    this.hightlited = false;
    this.createImg();
  }
  createImg() {
    this.img = this.scene.add.image(
      this.x * this.grid.cellSize + 1,
      this.y * this.grid.cellSize + 1
    );
    this.grid.container.add(this.img);
    // return this.img;
  }
  /**
   *
   * @param {keyof IMG_BATTLE} color IMG_BATTLE.key
   */
  setColor(color) {
    if (this.hightlited == false) {
      this.lastColor = color;
    }
    this.color = color;
  }

  /**
   * pushes color to texture
   */
  reDraw() {
    this.img.setTexture(this.color);
    // this.hightlited = false;
  }
  moveToRandomPosition() {
    console.log("moving " + this.x + " : " + this.y + " to rand");
  }
}
