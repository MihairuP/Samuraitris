import {
  IMG_CHARACTERS,
  IMG_IDLE,
  IMG_BG,
  SCENES,
  IMG_BATTLE,
  KEYS_BATTLE_UI,
} from "../common/keys.js";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.PRELOAD, active: true });
    // this.battleScene1Data = {};
  }
  preload() {
    //loading
    var progress = this.add.graphics();
    this.load.on("progress", function (value) {
      progress.clear();
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(0, 270, 800 * value, 60);
    });
    this.load.on("complete", function () {
      progress.destroy();
    });

    // //Background
    this.load.image(IMG_BG.BattleBG01, "assets/img/backgrounds/BG01.png");
    this.load.image(IMG_BG.ShitfFar, "assets/img/backgrounds/far.png");
    this.load.image(IMG_BG.ShitfClose, "assets/img/backgrounds/close.png");
    this.load.image(IMG_BG.dungeonBG, "assets/img/backgrounds/dungeonBG.jpg");
    this.load.image(
      IMG_BG.dungeonBGDown,
      "assets/img/backgrounds/dungeonBGDown.jpg"
    );

    //      enemy
    // //enemy sprite
    let charactersSpritePath = "assets/img/characters/";
    // let enemySpritePath = "img/enemies/";
    this.load.image(
      IMG_CHARACTERS.ENEMY01,
      charactersSpritePath + "Enemy01.png"
    );
    this.load.image(
      IMG_CHARACTERS.PLAYER,
      charactersSpritePath + "Player01.png"
    );

    let UIPath = "assets/img/UI/";
    this.load.image(IMG_IDLE.BUTTON_START_BATTLE, UIPath + "sword.png");
    this.load.image(IMG_BATTLE.BLUE, UIPath + "blue.png");
    this.load.image(IMG_BATTLE.RED, UIPath + "red.png");
    this.load.image(IMG_BATTLE.GREEN, UIPath + "green.png");
    this.load.image(IMG_BATTLE.PURPLE, UIPath + "purple.png");
    this.load.image(IMG_BATTLE.YELLOW, UIPath + "yellow.png");
    this.load.image(IMG_BATTLE.ORANGE, UIPath + "orange.png");
    this.load.image(IMG_BATTLE.WHITE, UIPath + "white.png");
    this.load.image(IMG_BATTLE.NOISE, UIPath + "noisesmall.png");

    this.load.image(IMG_BATTLE.BORD, UIPath + "bord.png");
    this.load.image(IMG_BATTLE.BORD_SMALL, UIPath + "bordSmall.png");
    this.load.image(IMG_BATTLE.ROTATE, UIPath + "rotate.png");
    this.load.image(IMG_BATTLE.MIX, UIPath + "mix.png");

    //ui-general
    let SpritePathUI = "assets/img/UI/";
    this.load.image(
      KEYS_BATTLE_UI.HEALTHBAR_BOARD,
      SpritePathUI + "Healthbar.png"
    );
    this.load.spritesheet(
      KEYS_BATTLE_UI.HEALTBAR_INNER,
      SpritePathUI + "HPinner.png",
      {
        frameWidth: 94,
        frameHeight: 7,
      }
    );
    this.load.spritesheet(
      KEYS_BATTLE_UI.ADRENALINE_INNER,
      SpritePathUI + "ADRinner.png",
      {
        frameWidth: 94,
        frameHeight: 7,
      }
    );

    //end
  }
  create() {
    // console.log("preload Scene run");
    //after loading resources it launches first scene
    this.scene.start(SCENES.IDLE);
  }
}
