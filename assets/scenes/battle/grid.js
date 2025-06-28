import { GLOBAL_VALUES, SETTINGS } from "../../common/config.js";
import { IMG_BATTLE, ORIENTATION } from "../../common/keys.js";
import {
  UIFXDisappear,
  UIFXShake,
  UIFXSpinAndGo,
} from "../../common/uiEchansments.js";
import { BattleFlow, BattleScene } from "./battleScene.js";
import { GridCell } from "./cell.js";
import { Tetromino } from "./tetromino.js";

export class Grid {
  /**
   * @constructor
   * @param {BattleScene} scene
   * @param {BattleFlow} battleFlow
   * @param {number} gridX
   * @param {number} gridY
   * @param {number} gridSize
   * @param {number} cellSize
   */
  constructor(scene, battleFlow, gridX, gridY) {
    /** @type {BattleScene} */
    this.scene = scene;
    this.battleFlow = battleFlow;
    this.gridX = gridX; // Позиция сетки по X
    this.gridY = gridY; // Позиция сетки по Y
    this.gridSize = SETTINGS.Grid_Size;
    this.cellSize = SETTINGS.Cell_Size;
    this.millis = 0;

    /** @type {GridCell[][]} */
    this.grid = [];
    // this.tV = 0;
    this.graphics = this.scene.add.graphics();
    this.container = scene.add.container(gridX, gridY, []);

    this.createGrid();
    this.inProcessOfHightlighting = false;

    this.tetrominoContainersArray = [];
    /** @type {Tetromino} */
    this.tetrominoObjs = [];
    this.maxTetraminos = 3;
    this.slots = {};
    for (let index = 0; index < this.maxTetraminos; index++) {
      this.slots[index] = undefined;
    }
    this.tetraminoQueue = undefined;
    this.redrawGrid();

    //For attack animation
    this.tarY = this.container.y - 150;
    this.tarX =
      this.container.x +
      this.battleFlow.playerUnit.unitPortrait.displayWidth / 2;
    // console.log(this.tarX);

    if (GLOBAL_VALUES.Orientation == ORIENTATION.PORTRAIT) {
      //FIXME
      this.tarY = this.container.y - 50;
      this.tarX = 300;
    }

    // TESTTESTTESTTESTTEST
    this.scene.input.on("pointerdown", (pointer) => {
      if (pointer.middleButtonDown()) {
        console.log("test");
        // UIFXShake(this.battleFlow.enemy.unitPortrait);

        // scene.scale.toggleFullscreen();
        // var timer = scene.time.delayedCall(3000, this.mixGrid, [], this); // delay in ms
        console.log(GLOBAL_VALUES);
        // console.log(this);
        // console.log(window.innerWidth);
        // console.log(window.innerHeight);
        // console.log(this.getEmptyTetrominoSlot());
        // this.mixGrid();
        // battleFlow.finishBattle();
      }
    });
  }
  redrawGrid() {
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const cell = this.grid[y][x];
        if (this.inProcessOfHightlighting == false) {
          cell.hightlited = false;
        }

        cell.img.setDisplaySize(this.cellSize, this.cellSize); //to cancel animation
        if (!cell.occupied) {
          cell.setColor(IMG_BATTLE.WHITE);
        } else {
          cell.setColor(cell.lastColor);
        }
        if (cell.hightlited) {
          if (cell.occupied) {
            cell.setColor(IMG_BATTLE.RED);
          } else {
            cell.setColor(IMG_BATTLE.GREEN);
          }
        }
        cell.reDraw();
      }
    }
  }

  createGrid() {
    // const bg = this.scene.add
    //   .image(-this.cellSize / 2, -this.cellSize / 2, IMG_BATTLE.WHITE)
    //   .setOrigin(0, 0);
    // bg.setDisplaySize(
    //   this.cellSize * this.gridSize,
    //   this.cellSize * this.gridSize
    // );
    // this.container.add(bg);

    for (let y = 0; y < this.gridSize; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.gridSize; x++) {
        this.grid[y][x] = new GridCell(this, x, y);
      }
    }
  }
  getNewPosition(newPositions) {
    //Страшная рекурсия. Можно переделать получив список пустых
    let newX = Math.floor(Math.random() * this.gridSize);
    let newY = Math.floor(Math.random() * this.gridSize);
    let newCoordinates = [newX, newY];

    newPositions.forEach((element) => {
      if (element[0] == newCoordinates[0] && element[1] == newCoordinates[1]) {
        newCoordinates = this.getNewPosition(newPositions);
      }
    });

    return newCoordinates;
  }
  mixGrid() {
    let oldCellsPos = [];
    let oldCellsColors = [];
    let newCellsPos = [];
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        if (this.grid[y][x].occupied) {
          oldCellsPos.push([x, y]);
          oldCellsColors.push(this.grid[y][x].color);
        }
      }
    }
    console.log(oldCellsPos);

    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        this.grid[y][x].occupied = false;
      }
    }

    for (let iNewPos = 0; iNewPos < oldCellsPos.length; iNewPos++) {
      newCellsPos.push(this.getNewPosition(newCellsPos));
    }

    newCellsPos.forEach((element, index) => {
      let toBePlacedCell = this.grid[element[1]][element[0]];
      toBePlacedCell.setColor(oldCellsColors[index]);
      toBePlacedCell.occupied = true;
    });
    this.redrawGrid();
  }

  getEmptyTetrominoSlot() {
    for (const [key, value] of Object.entries(this.slots)) {
      if (value == undefined) return key;
    }
    return false;
  }

  /**
   *
   * @param {Tetromino} tetramino
   */
  highlightCells(tetramino) {
    let gameObject = tetramino.container;
    this.redrawGrid();
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const cell = this.grid[y][x];
        cell.hightlited = false;
      }
    }

    // Координаты фигуры относительно контейнера
    const gridX = Math.floor(gameObject.x / this.cellSize);
    const gridY = Math.floor(gameObject.y / this.cellSize);

    // Проверяем, можно ли разместить фигуру
    if (this.canPlaceTetromino(tetramino, gridX, gridY)) {
      tetramino.lastGoodPlace.gridX = gridX;
      tetramino.lastGoodPlace.gridY = gridY;
    }
    for (let y = 0; y < tetramino.tetromino.length; y++) {
      for (let x = 0; x < tetramino.tetromino[y].length; x++) {
        // cell.tetromino[y][x]
        if (tetramino.tetromino[y][x]) {
          const cellX = gridX + x;
          const cellY = gridY + y;
          if (
            cellY >= 0 &&
            cellY < this.gridSize &&
            cellX >= 0 &&
            cellX < this.gridSize
          ) {
            this.grid[cellY][cellX].hightlited = true;
            this.grid[cellY][cellX].reDraw();
          }
        }
      }
    }
    // }
  }

  /**
   * Проверяет, можно ли разместить фигуру на сетке.
   * @param {number[][]} tetromino - Фигура.
   * @param {number} startX - Начальная координата X.
   * @param {number} startY - Начальная координата Y.
   * @returns {boolean} - Можно ли разместить фигуру.
   */
  canPlaceTetromino(cell, startX, startY) {
    let tetromino = cell.tetromino;
    for (let y = 0; y < tetromino.length; y++) {
      for (let x = 0; x < tetromino[y].length; x++) {
        if (tetromino[y][x]) {
          const gridX = startX + x;
          const gridY = startY + y;

          // Проверяем, чтобы фигура не выходила за пределы сетки
          if (
            gridY < 0 ||
            gridY >= this.gridSize ||
            gridX < 0 ||
            gridX >= this.gridSize
          ) {
            return false;
          }

          // Проверяем, чтобы ячейка не была занята
          if (!this.grid[gridY]) return;
          if (this.grid[gridY][gridX].occupied) {
            return false;
          }
        }
      }
    }
    // console.log("Placed");

    return true;
  }

  /**
   * Размещает фигуру на сетке.
   * @param {Tetromino} tetrominoObj - Фигура.
   * @param {number} startX - Начальная координата X.
   * @param {number} startY - Начальная координата Y.
   * @returns {boolean} - Успешно ли размещена фигура.
   */
  placeTetromino(tetrominoObj, startX, startY) {
    let tetromino = tetrominoObj.tetromino;
    if (!this.canPlaceTetromino(tetrominoObj, startX, startY)) {
      return false;
    }

    for (let y = 0; y < tetromino.length; y++) {
      for (let x = 0; x < tetromino[y].length; x++) {
        if (tetromino[y][x]) {
          const gridCell = this.grid[startY + y][startX + x];
          gridCell.occupied = true;
          gridCell.hightlited = false;
          gridCell.setColor(tetrominoObj.texture);
        }
      }
    }
    return true;
  }

  updateField() {
    this.checkAndClearLines();
  }

  isRowComplete(rowIndex) {
    for (let x = 0; x < this.gridSize; x++) {
      if (!this.grid[rowIndex][x].occupied) {
        return false; // Если хотя бы одна ячейка не занята, строка не заполнена
      }
    }
    return true; // Все ячейки строки заняты
  }
  isColumnComplete(colIndex) {
    for (let y = 0; y < this.gridSize; y++) {
      if (!this.grid[y][colIndex].occupied) {
        return false;
      }
    }
    return true;
  }
  rowGetCellsToRemove(rowIndex, collection) {
    for (let x = 0; x < this.gridSize; x++) {
      collection.push(this.grid[rowIndex][x]);
    }
  }

  columnGetCellsToRemove(colIndex, collection) {
    for (let y = 0; y < this.gridSize; y++) {
      collection.push(this.grid[y][colIndex]);
    }
  }
  checkAndClearLines() {
    let clearedLines = 0;
    let colors = [];
    let cellsToRemove = [];
    for (let y = 0; y < this.gridSize; y++) {
      if (this.isRowComplete(y)) {
        this.rowGetCellsToRemove(y, cellsToRemove);
        clearedLines++;
      }
    }
    for (let x = 0; x < this.gridSize; x++) {
      if (this.isColumnComplete(x)) {
        this.columnGetCellsToRemove(x, cellsToRemove);
        clearedLines++;
      }
    }

    if (clearedLines) {
      const counts = {};
      cellsToRemove.forEach((cell) => {
        colors.push(cell.img.texture.key);
        cell.occupied = false;
      });

      colors.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
      });

      const dominantColor = Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b
      );

      cellsToRemove.forEach((cell) => {
        if (cell.img.texture.key == dominantColor) {
          UIFXSpinAndGo(cell.img, this.tarX, this.tarY, () =>
            this.redrawGrid()
          );
        } else {
          UIFXDisappear(cell.img, () => this.redrawGrid());
        }
      });

      this.battleFlow.attackEnemy(counts[dominantColor], dominantColor);
    }
    return clearedLines;
  }
  rotateAllTetrominoes() {
    this.tetrominoObjs.forEach((element) => {
      element.rotateTetromino();
    });
  }

  update() {
    // return;
    this.millis += 1;

    // this.timersGo();
    if (this.millis > 15) {
      this.millis = 0;
      if (this.tetrominoObjs.length < this.maxTetraminos) {
        if (this.tetraminoQueue == undefined) {
          for (const [key, value] of Object.entries(this.slots)) {
            if (value == undefined && this.tetraminoQueue == undefined) {
              this.tetraminoQueue = key;
            }
          }
        } else {
          const newTetr = new Tetromino(
            this.scene,
            this,
            undefined,
            this.tetraminoQueue
          );
          this.tetrominoObjs.push(newTetr);
          this.slots[this.tetraminoQueue] = newTetr;
          this.tetraminoQueue = undefined;
        }
      }
      this.updateField();
    }
  }
}

// addTimer(startX, startY) {
//   let newTimer = {
//     startX: startX,
//     startY: startY,
//     time: 1,
//     timeWait: 4,
//   };
//   this.timers.push(newTimer);
// }

// timersGo() {
//   this.timers.forEach((timer) => {
//     if (this.graphics) this.graphics.clear();
//     let totalFrames = timer.timeWait * 60; //5*60
//     let degPerFrame = 360 / totalFrames; //360/300 = 2.1
//     if (timer.time < totalFrames) {
//       let deg = 270 + timer.time * degPerFrame;
//       this.graphics.lineStyle(20, 0xff00ff, 0.5);
//       this.graphics.beginPath();
//       this.graphics.arc(
//         timer.startX,
//         timer.startY,
//         50,
//         Phaser.Math.DegToRad(270),
//         Phaser.Math.DegToRad(deg)
//       );
//       this.graphics.strokePath();
//     }

//     timer.time++;
//   });
// }
