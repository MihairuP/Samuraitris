// import { FONTS, IMAGE_SIZES, SETTINGS } from "../../common/config.js";
// import { KEYS_BATTLE_UI } from "../../common/keys.js";
// import { BattleScene, BattleUI } from "./BattleScene.js";
import { FONTS, SETTINGS } from "../../common/config.js";
import { KEYS_BATTLE_UI } from "../../common/keys.js";
import { BattleScene } from "./battleScene.js";
import { UnitBattle } from "./unitsBattle.js";

export class Healthbar {
  /**
   * Creates an instance of Healthbar. If neeed to add to UI call .cont!!
   *
   * @constructor
   * @param {BattleScene} scene
   * @param {number} width
   * @param {number} y
   * @param {UnitBattle} unit
   * @param {HEALTHBAR_CLASSES} barClass
   */
  constructor(scene, width, y, unit, barClass, disallowArrow = false) {
    this.scene = scene;
    this.unit = unit;
    this.barClass = barClass;
    this.disallowArrow = disallowArrow;

    this.padding = 10;
    this.width = width; //enemy sprite width
    this.hpBarPadding = 10;

    this.HPBarBorder = this.scene.add.image(
      0,
      0,
      KEYS_BATTLE_UI.HEALTHBAR_BOARD
    );
    this.HPBarBorder.displayWidth = this.width;
    this.HPBarBorder.displayHeight = 30;

    let innerX = -this.HPBarBorder.displayWidth / 2 + this.hpBarPadding;
    if (this.width > 300) innerX += 5;
    let innerY = -this.hpBarPadding / 2;

    this.HPBarInner = this.scene.add
      .sprite(innerX, innerY, this.barClass.sprite, 0)
      .setOrigin(0);

    this.HPBarInner.displayHeight = this.HPBarBorder.displayHeight / 3;
    this.HPBarInner.displayWidth = 50;

    this.HPBarInnerBG = this.scene.add
      .sprite(innerX, innerY, KEYS_BATTLE_UI.HEALTBAR_INNER, 1)
      .setOrigin(0)
      .setAlpha(0);

    this.HPBarInnerBG.displayHeight = this.HPBarInner.displayHeight;
    this.HPBarInnerBG.displayWidth = this.width - this.padding * 2;

    this.captionHP = this.scene.add
      .text(
        innerX + this.HPBarInnerBG.displayWidth / 2,
        innerY,
        "ph hp",
        FONTS.DEFAULT
      )
      .setOrigin(0.5)
      .setAlpha(0);

    this.captionName = this.scene.add
      .text(0, 100, "", FONTS.LeftOverlayName)
      .setOrigin(0.5)
      .setAlpha(0);

    let startX = width / 2;
    this.cont = this.scene.add.container(startX, y, [
      // this.HPBarInnerBG,
      this.HPBarInner,
      this.HPBarBorder,
      this.captionHP,
    ]);

    this.HPBarBorder.setInteractive();
    this.HPBarBorder.on("pointerover", () => {
      this.hover();
    });
    this.HPBarBorder.on("pointerout", () => {
      this.unHover();
    });

    this.update();
    return this;
  }
  hover() {
    this.captionHP.setAlpha(1);
    this.captionName.setAlpha(1);
  }
  unHover() {
    this.captionHP.setAlpha(0);
    this.captionName.setAlpha(0);
  }

  update() {
    if (this.unit) {
      //going insane
      if (this.captionName.text == "") this.captionName.setText(this.unit.name);
      let newWidth = 0;
      if (this.barClass == HEALTHBAR_CLASSES.HP_BAR) {
        this.current = this.unit.stats.currentHP;
        this.max = this.unit.stats.maxHP;
      }
      if (this.barClass == HEALTHBAR_CLASSES.ADRENALINE_BAR) {
        this.current = this.unit.stats.currentADR;
        this.max = this.unit.stats.maxADR;
      }
      this.captionHP.setText(Math.floor(this.current) + " / " + this.max);
      let ratio = this.current / this.max;

      newWidth = ratio * this.width - this.padding * 2;
      if (newWidth < 5) newWidth = 5;
      this.scene.add.tween({
        targets: this.HPBarInner,
        ease: "Sine.easeInOut",
        displayWidth: newWidth,
        duration: 200,
      });
      this.cont.setAlpha(1);
    }
  }
}

export const HEALTHBAR_CLASSES = Object.freeze({
  Health: "healthInner",
  HP_BAR: {
    class: "HP_BAR",
    sprite: KEYS_BATTLE_UI.HEALTBAR_INNER,
  },
  ADRENALINE_BAR: {
    class: "ADRENALINE_BAR",
    sprite: KEYS_BATTLE_UI.ADRENALINE_INNER,
  },
});
