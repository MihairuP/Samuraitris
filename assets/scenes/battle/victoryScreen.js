import { COLORS, FONTS, GLOBAL_VALUES } from "../../common/config.js";
import { DATA_STORAGE_KEYS, dataManager } from "../../common/data-manager.js";
import {
  CURSORS,
  IMG_BATTLE,
  IMG_CHARACTERS,
  ORIENTATION,
  SCENES,
} from "../../common/keys.js";
import { UIModalWindowDrop } from "../../common/uiEchansments.js";

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.VICTORY });
  }

  create(data) {
    this.testArg = data.testArg;
    console.log("Victory scene run");

    this.background = this.add
      .rectangle(0, 0, 3000, 3000, COLORS.BLACK, 0.7)
      .setOrigin(0, 0);
    this.messageBoxBG = this.add.image(0, 0, IMG_BATTLE.BORD).setOrigin(0.5, 0);

    this.message = this.add.text(
      0,
      0,
      "BATTLE WON\nGOT N GOLD!!",
      FONTS.DEFAULT
    );

    this.button = this.add.image(0, 0, IMG_BATTLE.BORD_SMALL).setOrigin(0.5, 0);

    this.button.setInteractive({ cursor: CURSORS.Gauntlet });
    this.button.on("pointerdown", (pointer) => {
      this.finish();
    });

    this.captionButton = this.add.text(0, 0, "OK", FONTS.DEFAULT);

    this.containerButton = this.add.container(0, 0, [
      this.button,
      this.captionButton,
    ]);

    console.log("this.testArg", this.testArg);

    this.container = this.add.container(0, 0, [
      this.messageBoxBG,
      this.message,
      this.containerButton,
    ]);
    this.adaptOrientation();
    UIModalWindowDrop(this, this.container);
  }
  finish() {
    /** @type {Phaser.Scene} */
    const battleScene = dataManager.store.get(DATA_STORAGE_KEYS.SCENE_BATTLE);
    let testArg = "check arg form vic to idle scene";
    this.scene.resume(SCENES.IDLE, { testArg });
    battleScene.scene.remove();
    this.scene.remove();
  }
  adaptOrientation() {
    const padding = 50;
    this.scale.refresh();
    const viewport = this.scale.getViewPort();
    const boxCenter = this.messageBoxBG.height / 2;

    this.container.setX(viewport.width / 2);

    this.messageBoxBG.displayWidth *= 1.5;

    this.message.setY(120);

    // this.button.setY(boxCenter * 1.5);

    this.containerButton.setY(boxCenter * 1.3);
    this.message.setX(-this.message.width / 2);

    this.captionButton.setX(-this.captionButton.width / 2);
    this.captionButton.setY(
      this.button.height / 2 - this.captionButton.height / 2
    );

    this.container.setY(viewport.height / 2 - boxCenter);
    if (GLOBAL_VALUES.Orientation == ORIENTATION.PORTRAIT) {
      let gridPreScaleSizeWidth = this.container.getBounds().width;
      const newWitdh = viewport.width - padding * 4;
      this.container.setScale(1.4);
      this.message.setScale(2);
      this.message.setX(-this.message.width);
      this.containerButton.setScale(2);
    }
  }
}
