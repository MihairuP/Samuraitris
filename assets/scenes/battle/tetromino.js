import { GLOBAL_VALUES } from "../../common/config.js";
import { CURSORS, IMG_BATTLE, ORIENTATION } from "../../common/keys.js";
import { UIaddFigureEffect } from "../../common/uiEchansments.js";
import { BattleScene } from "./battleScene.js";
import { Grid } from "./grid.js";

export class Tetromino {
  /**
   * @param {BattleScene} scene
   * @param {Grid} grid
   * @param {tetrominoes} key
   */
  constructor(scene, grid, key = tetrominoes.random(), slot) {
    this.name = undefined;
    this.scene = scene;
    this.grid = grid;
    this.gridContainer = grid.container;
    this.tetrominoContainers = grid.tetrominoContainersArray;
    this.slot = slot;

    this.offsetX = slot * (grid.cellSize * 4 + 20);
    this.offsetY = 400;
    this.lastGoodPlace = { gridX: undefined, gridY: undefined };
    if (GLOBAL_VALUES.Orientation == ORIENTATION.PORTRAIT) {
      const top = 330;
      if (this.slot % 2 == 0) {
        // console.log("even");
        this.offsetX = 10;
        this.offsetY = top + this.slot * 60;
      } else {
        // console.log("odd");
        this.offsetX = 200;
        this.offsetY = top;
        // this.offsetY = 0;
      }
    }
    this.container = this.scene.add.container(this.offsetX, this.offsetY, []);
    this.tetromino = tetrominoes[key]; // Сохраняем форму фигуры
    this.texture = tetrominoTextures.random(); // Сохраняем цвет фигуры

    this.name = "" + this.texture + " " + key;
    this.tetrominoContainers.push(this.container);
    this.gridContainer.add(this.container);
    this.updateTetrominoDisplay();
    this.enableRotate();
    this.enableDragAndDrop();
  }

  rotateTetromino() {
    const rows = this.tetromino.length;
    const cols = this.tetromino[0].length;
    const rotated = [];

    for (let x = 0; x < cols; x++) {
      rotated[x] = [];
      for (let y = 0; y < rows; y++) {
        rotated[x][y] = this.tetromino[rows - y - 1][x];
      }
    }
    this.tetromino = rotated;
    this.updateTetrominoDisplay();
  }

  updateTetrominoDisplay() {
    if (this.container.scene) {
      this.container.removeAll(true);

      for (let y = 0; y < this.tetromino.length; y++) {
        for (let x = 0; x < this.tetromino[y].length; x++) {
          if (this.tetromino[y][x]) {
            const cell = this.scene.add.image(
              x * this.grid.cellSize,
              y * this.grid.cellSize,
              this.texture
            );
            cell.setDisplaySize(this.grid.cellSize, this.grid.cellSize);
            this.container.add(cell);
          }
        }
      }

      this.container.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(
          0 - this.grid.cellSize / 2,
          0 - this.grid.cellSize / 2,
          4 * this.grid.cellSize,
          4 * this.grid.cellSize
        ),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        draggable: true,
        cursor: CURSORS.Gauntlet,
      });
      // UIaddSelectableEffect(this.container);
      UIaddFigureEffect(this.container);
    }
  }
  enableRotate(target) {
    //rotate only this or all
    this.scene.input.on("pointerdown", (pointer) => {
      if (pointer.rightButtonDown()) {
        this.rotateTetromino();
      }
    });
  }

  enableDragAndDrop() {
    this.scene.isDragging = false;
    this.scene.input.dragDistanceThreshold = 30;
    this.container.on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
      (pointer, dragX, dragY) => {
        console.log(pointer);

        if (pointer.button == 0 && this.scene.isDragging == false) {
          this.grid.rotateAllTetrominoes();
        }
        this.scene.isDragging = false;
      }
    );
    this.container.on(
      Phaser.Input.Events.GAMEOBJECT_DRAG_START,
      (pointer, dragX, dragY) => {
        this.scene.isDragging = true;
        console.log("GAMEOBJECT_DRAG_START");
        this.grid.inProcessOfHightlighting = true;

        this.scene.add.tween({
          targets: this.container,
          ease: "Sine.easeInOut",
          duration: 200,
          alpha: 0.5,
          scale: 0.5,
        });
      }
    );
    this.container.on(
      Phaser.Input.Events.GAMEOBJECT_DRAG,
      (pointer, dragX, dragY) => {
        // console.log(pointer);
        this.scene.scale.refresh();

        // Перемещаем фигуру относительно контейнера
        let newX = 0;
        let newY = 0;

        if (GLOBAL_VALUES.onMobile) {
          newY = dragY;
          newX = dragX;
        } else {
          newY = dragY - this.grid.container.y - GLOBAL_VALUES.YFingerShift;
          newX = pointer.event.x - this.grid.cellSize * 2;
        }

        this.scene.tweens.add({
          targets: this.container,
          duration: 80,
          x: newX,
          y: newY,
          ease: "easeOut",
        });

        const angleMuch = 30;
        const newAngele = newX > this.container.x ? angleMuch : -angleMuch;
        this.scene.tweens.add({
          targets: this.container,
          duration: 200,
          angle: newAngele,
          ease: "easeOut",
          onComplete: () => {
            this.scene.tweens.add({
              targets: this.container,
              duration: 200,
              angle: 0,
            });
          },
        });

        // this.container.x = newX;
        this.grid.highlightCells(this);
      }
    );
    this.container.on(
      Phaser.Input.Events.GAMEOBJECT_DRAG_END,
      (pointer, gameObject) => {
        // console.log(this.container.x, this.container.y);

        this.grid.inProcessOfHightlighting = false;
        // Координаты фигуры относительно контейнера
        const gridX = Math.floor(this.container.x / this.grid.cellSize);
        const gridY = Math.floor(this.container.y / this.grid.cellSize);
        // Пытаемся разместить фигуру на сетке
        const success = this.grid.placeTetromino(this, gridX, gridY);
        if (success) {
          this.grid.tetrominoObjs = this.grid.tetrominoObjs.filter(
            (item) => item !== this
          );
          this.grid.tetrominoContainersArray = this.grid.tetrominoObjs.filter(
            (item) => item !== this.container
          );

          this.grid.slots[this.slot] = undefined;
          this.container.destroy();
        } else {
          const failtureCoeffitient = 1000;
          if (
            this.lastGoodPlace.gridX &&
            this.container.y < 300 &&
            this.container.x < 300 &&
            Math.abs(this.container.x - this.lastGoodPlace.gridX) <
              failtureCoeffitient &&
            Math.abs(this.container.y - this.lastGoodPlace.gridY) <
              failtureCoeffitient
          ) {
            const success = this.grid.placeTetromino(
              this,
              this.lastGoodPlace.gridX,
              this.lastGoodPlace.gridY
            );
            if (success) {
              this.grid.tetrominoObjs = this.grid.tetrominoObjs.filter(
                (item) => item !== this
              );
              this.grid.tetrominoContainersArray =
                this.grid.tetrominoObjs.filter(
                  (item) => item !== this.container
                );

              this.grid.slots[this.slot] = undefined;
              this.container.destroy();
            }
          }

          // Возвращаем фигуру на исходное место
          this.scene.add.tween({
            targets: this.container,
            ease: "Sine.easeInOut",
            x: this.offsetX,
            y: this.offsetY,
            duration: 200,
            alpha: 1,
            scale: 1,
            rotation: 0,
          });
          // this.grid.redrawGrid();
        }
        this.grid.redrawGrid();
      }
    );
  }
}

export const tetrominoes = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  random: function () {
    return Object.keys(tetrominoes)[
      Math.floor(Math.random() * (Object.keys(tetrominoes).length - 1))
    ];
  },
};

export const tetrominoTextures = {
  //цвета теперь рандомные, ключи больше не используются
  YELLOW: IMG_BATTLE.YELLOW, // Жёлтый
  PURPLE: IMG_BATTLE.PURPLE, // Пурпурный
  BLUE: IMG_BATTLE.BLUE, // Синий
  ORANGE: IMG_BATTLE.ORANGE, // Циан
  // S: IMG_BATTLE.GREEN, // Зелёный
  // RED: IMG_BATTLE.RED, // Красный
  // YELLOW: IMG_BATTLE.YELLOW, // Оранжевый
  random: function () {
    return tetrominoTextures[
      Object.keys(tetrominoTextures)[
        Math.floor(Math.random() * (Object.keys(tetrominoTextures).length - 1))
      ]
    ];
  },
};

// export const tetrominoColors = {
//   I: 0x00ffff, // Циан
//   O: 0xffff00, // Жёлтый
//   T: 0xff00ff, // Пурпурный
//   S: 0x00ffff, // Зелёный
//   Z: 0xff0000, // Красный
//   J: 0x0000ff, // Синий
//   L: 0xffa500, // Оранжевый
//   random: function () {
//     return tetrominoColors[
//       Object.keys(tetrominoColors)[
//         Math.floor(Math.random() * (Object.keys(tetrominoColors).length - 1))
//       ]
//     ];
//   },
// };
