import { FONTS, GLOBAL_VALUES } from "../common/config.js";
import { DATA_STORAGE_KEYS, dataManager } from "../common/data-manager.js";
import {
  IMG_CHARACTERS,
  CURSORS,
  IMG_IDLE,
  IMG_BG,
  SCENES,
  ORIENTATION,
} from "../common/keys.js";
import { UIaddSelectableEffect } from "../common/uiEchansments.js";
import { BattleScene } from "./battle/battleScene.js";

export class idleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.IDLE });
  }
  create() {
    // console.log("idle scene run");
    dataManager.store.set(DATA_STORAGE_KEYS.SCENE_IDLE, this);

    this.input.setDefaultCursor(CURSORS.Poi_a);
    this.BGFar = this.add
      .tileSprite(0, 0, 600, 240, IMG_BG.ShitfFar)
      .setOrigin(0, 0);
    this.BGClose = this.add
      .tileSprite(0, 0, 600, 240, IMG_BG.ShitfClose)
      .setOrigin(0, 0);
    // this.background = this.add
    //   .image(0, 0, IMG_BG.BattleBG01)
    //   .setOrigin(0, 0)
    //   .setScale(2);
    // this.backgroundBlanc = this.add
    //   .rectangle(0, 0, 100, 100, COLORS.BLACK)
    //   .setOrigin(0, 0);
    this.characterPortrait = this.add
      .image(0, 0, IMG_CHARACTERS.PLAYER)
      .setScale(0.3)
      .setOrigin(0.5, 0);

    // this.goldCaption = this.add.text(0, 120, "0", FONTS.DEFAULT);
    this.textConstantPrefix = "GO AND FIGHT!\n Gold: ";
    this.someInfo = this.add.text(0, 0, this.textConstantPrefix, FONTS.DEFAULT);
    this.containerInfo = this.add.container(0, 0, [this.someInfo]);

    this.update();

    this.buttlonStartBattle = this.add
      .image(0, 0, IMG_IDLE.BUTTON_START_BATTLE)
      .setOrigin(0.5, 1)
      .setScale(5);
    this.buttlonStartBattle.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
      // console.log("button");
      this.startBattle("go");
    });
    window.addEventListener("touchstart", function () {
      GLOBAL_VALUES.onMobile = true;
    });
    this.adaptOrientation();
    UIaddSelectableEffect(this.buttlonStartBattle);
    // console.log(this);
  }
  startBattle(args) {
    this.input.setDefaultCursor(CURSORS.Poi_a);
    this.sceneBattle = this.game.scene.add(SCENES.BATTLE, BattleScene, false);
    const oldScenes = this.scene.manager.getScenes(true);

    oldScenes.forEach((sceneKey) => {
      this.scene.pause(sceneKey);
    });
    let testArg = "check arg to battle scene";
    this.scene.launch(SCENES.BATTLE, { testArg });
  }
  update() {
    let playerGold = dataManager.store.get(DATA_STORAGE_KEYS.GOLD);
    this.someInfo.setText(this.textConstantPrefix + playerGold);
    const speed = 0.4;
    this.BGFar.tilePositionX += speed;
    this.BGClose.tilePositionX += speed * 2;

    // this.goldCaption.setText("Gold: " + playerGold);
  }

  adaptOrientation() {
    const padding = 50;
    const viewport = this.scale.getViewPort();
    this.BGFar.setScale(4);
    this.BGClose.setScale(4);
    if (window.innerWidth < window.innerHeight) {
      GLOBAL_VALUES.Orientation = ORIENTATION.PORTRAIT;
      GLOBAL_VALUES.YFingerShift = 10;
      // console.log("portrait");
      this.characterPortrait.setDisplaySize(
        viewport.width - padding * 2,
        viewport.width - padding * 2
      );
      this.buttlonStartBattle.setScale(10);
      this.containerInfo.setScale(3);
      this.BGFar.setScale(8);
      this.BGClose.setScale(8);
    }

    // this.background.setDisplaySize(viewport.width, viewport.height);
    // this.backgroundBlanc.setDisplaySize(viewport.width, viewport.height);
    this.characterPortrait.setX(viewport.width / 2);
    this.characterPortrait.setY(padding);
    this.buttlonStartBattle.setX(viewport.width / 2);
    this.containerInfo.setX(
      viewport.width / 2 - this.containerInfo.getBounds().width / 2
    );
    this.containerInfo.setY(
      this.characterPortrait.displayHeight + padding * 1.5
    );
    this.buttlonStartBattle.setY(viewport.height - padding);
    this.buttlonStartBattle.setY(viewport.height - padding);
  }
}
