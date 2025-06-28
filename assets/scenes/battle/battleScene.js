import { DATA_STORAGE_KEYS, dataManager } from "../../common/data-manager.js";
import { IMG_BATTLE, IMG_BG, SCENES, ORIENTATION } from "../../common/keys.js";
import { UnitBattle } from "./unitsBattle.js";
import { Grid } from "./grid.js";
import { VictoryScene } from "./victoryScreen.js";
import { UIaddSelectableEffect } from "../../common/uiEchansments.js";
import { GLOBAL_VALUES } from "../../common/config.js";

export class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BATTLE });
  }
  create(data) {
    this.testArg = data.testArg;
    // console.log("battle scene run");
    dataManager.store.set(DATA_STORAGE_KEYS.SCENE_BATTLE, this);
    /** @type {Grid} */
    this.playerGrid = undefined;

    this.backgroundDown = this.add
      .image(0, 0, IMG_BG.dungeonBGDown)
      .setOrigin(0, 0)
      .setScale(2);
    this.background = this.add
      .image(0, 0, IMG_BG.dungeonBG)
      .setOrigin(0, 0)
      .setScale(2);

    this.contUnits = this.add.container(0, 0, []);
    this.battleFlow = new BattleFlow(this);

    this.contGrid = this.add.container(50, 340, []);
    this.contGrid.add(this.playerGrid.container);
    // this.buttonRotate = this.add.image(0, 0, IMG_BATTLE.ROTATE).setOrigin(0.5);
    // this.buttonRotate.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
    //   this.playerGrid.rotateAllTetrominoes();
    // });
    this.buttonMix = this.add.image(0, 0, IMG_BATTLE.MIX).setOrigin(0.5);
    this.buttonMix.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
      this.playerGrid.mixGrid();
    });

    this.buttonsCont = this.add.container(0, 0, [
      // this.buttonRotate,
      this.buttonMix,
    ]);

    this.buttonsCont.list.forEach((element) => {
      UIaddSelectableEffect(element);
    });
    this.adaptOrientation();
    console.log(this);
  }
  update() {
    this.battleFlow.update();
  }
  adaptOrientation() {
    const padding = 50;
    this.scale.refresh();
    const viewport = this.scale.getViewPort();
    this.buttonsCont.setScale(1.5);
    this.buttonsCont.setX(viewport.width - 600);
    this.buttonsCont.setY(viewport.height - 100);
    this.contUnits.setX(padding);
    this.contUnits.setY(padding);

    if (GLOBAL_VALUES.Orientation == ORIENTATION.PORTRAIT) {
      this.buttonsCont.setScale(2.5);
      this.buttonsCont.setX(viewport.width - 600);
      this.buttonsCont.setY(viewport.height - 200);
      let gridPreScaleSizeWidth = this.contGrid.getBounds().width;
      const newWitdh = viewport.width - padding * 4;
      this.contGrid.setScale(newWitdh / gridPreScaleSizeWidth);
      this.contGrid.setX(padding * 3);
    }
    this.contGrid.setY(
      this.battleFlow.playerUnit.unitPortrait.getBounds().bottom + 50
    );

    this.background.setDisplaySize(viewport.width, 350);
    this.backgroundDown.setY(350);
    this.backgroundDown.setDisplaySize(viewport.width, 2000);

    this.buttonMix.setX(150);

    this.battleFlow.enemy.container.setX(viewport.width - 350);
  }
}
export class BattleFlow {
  /**
   *
   * @param {BattleScene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.playerUnit = new UnitBattle(scene, this, 300, 30, true);
    this.enemy = new UnitBattle(scene, this, 950, 30);

    scene.playerGrid = new Grid(scene, this, 0, 0);
    this.playerGrid = scene.playerGrid;
    this.pause = false;
  }
  attackEnemy(damage, color, attacker = this.playerUnit) {
    attacker.attack(this.enemy, damage, color);
  }
  update() {
    if (this.pause) return;
    this.playerGrid.update();
    this.playerUnit.update();
    this.enemy.update();

    if (this.enemy.stats.currentHP <= 0) {
      this.pause = true;
      this.scene.time.delayedCall(3000, this.finishBattle, [], this); // delay in ms
    }
  }

  finishBattle() {
    let playerGold = dataManager.store.get(DATA_STORAGE_KEYS.GOLD);
    dataManager.store.set(DATA_STORAGE_KEYS.GOLD, playerGold + 100);

    this.sceneVictory = this.scene.game.scene.add(
      SCENES.VICTORY,
      VictoryScene,
      false
    );
    const oldScenes = this.scene.scene.manager.getScenes(true);

    oldScenes.forEach((sceneKey) => {
      this.scene.scene.pause(sceneKey);
    });
    let testArg = "check arg to vic scene";
    this.scene.scene.launch(SCENES.VICTORY, { testArg });
  }
}
