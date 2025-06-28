import { FONTS } from "../../common/config.js";
import { IMG_CHARACTERS } from "../../common/keys.js";
import { UIFXShake, UITextPopup } from "../../common/uiEchansments.js";
import { BattleFlow, BattleScene } from "./battleScene.js";
import { Healthbar, HEALTHBAR_CLASSES } from "./healthBar.js";

export class UnitBattle {
  /**
   *
   * @param {BattleScene} scene
   * @param {BattleFlow} battleFlow
   * @param {number} startX
   * @param {number} startY
   * @param {boolean} isPlayerUnit Is this unit a player?
   */
  constructor(scene, battleFlow, startX, startY, isPlayerUnit = false) {
    this.scene = scene;
    this.battleFlow = battleFlow;
    this.stats = {
      maxHP: 100,
      currentHP: 0,
      attack: 4,
      maxADR: 100,
      currentADR: 50,
      ADRPerStrike: 35,
      ADRFatigue: 0.03,
    };
    this.stats.currentHP = this.stats.maxHP;

    let sprite;
    if (isPlayerUnit) {
      sprite = IMG_CHARACTERS.PLAYER;
    } else sprite = IMG_CHARACTERS.ENEMY01;
    this.createPortrait({
      sprite: sprite,
      spriteScale: 0.25,
      startX,
      startY,
    });

    this.hpBar = new Healthbar(
      scene,
      this.unitPortrait.displayWidth,
      -20,
      this,
      HEALTHBAR_CLASSES.HP_BAR
    );
    this.adrenalineBar = new Healthbar(
      scene,
      this.unitPortrait.displayWidth,
      0,
      this,
      HEALTHBAR_CLASSES.ADRENALINE_BAR
    );

    this.container = scene.add.container(0, 0, [
      this.unitPortrait,
      this.hpBar.cont,
      this.adrenalineBar.cont,
    ]);
    this.scene.contUnits.add(this.container);
    // this.takeDamage(50);
  }
  createPortrait({ sprite, spriteScale }) {
    this.portrait = {
      sprite,
      spriteScale,
    };

    this.unitPortrait = this.scene.add
      .image(0, 0, sprite)
      .setScale(spriteScale)
      .setOrigin(0, 0);
  }
  /**
   *
   * @param {UnitBattle} target
   * @param {*} damage
   */
  attack(target, damage, color) {
    this.stats.currentADR += this.stats.ADRPerStrike;
    if (this.stats.currentADR > this.stats.maxADR)
      this.stats.currentADR = this.stats.maxADR;
    target.takeDamage(damage, color, this);
  }
  update() {
    this.hpBar.update();
    this.adrenalineBar.update();
    if (this.stats.currentADR > 0) {
      this.stats.currentADR -= this.stats.ADRFatigue;
    }
  }
  /**
   *
   * @param {number} damage
   * @param {UnitBattle} attacker has stats.attack
   */
  takeDamage(damage, color, attacker) {
    let endDamage = Math.floor(
      damage * attacker.stats.attack * (attacker.stats.currentADR / 100)
    );

    const boundsPlayer = attacker.unitPortrait.getBounds();
    const boundsEnemy = this.battleFlow.enemy.unitPortrait.getBounds();
    UITextPopup(
      this.scene,
      "-" + endDamage,
      boundsPlayer.centerX,
      boundsPlayer.centerY,
      boundsEnemy.centerX,
      boundsEnemy.centerY,
      color,
      FONTS.PORTRAIT_DAMAGE,
      this.unitPortrait
    );
    this.stats.currentHP -= endDamage;
  }
}
