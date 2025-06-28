import { tetrominoTextures } from "../scenes/battle/tetromino.js";
import { FONTS } from "./config.js";
import { CURSORS } from "./keys.js";

function addOutline(elementImage) {
  //баг - не показывается после поворота фигуры
  let scene = elementImage.scene;
  if (elementImage.outline) elementImage.outline.destroy();
  let bounds = elementImage.getBounds();
  elementImage.outline = scene.add
    .rectangle(bounds.x, bounds.y, bounds.width, bounds.height)
    .setOrigin(0)
    .setStrokeStyle(4, 0xefc53f)
    .setAlpha(0.2);
  scene.tweens.add({
    targets: elementImage.outline,
    alpha: 1,
    yoyo: true,
    repeat: -1,
    duration: 500,
    ease: "Sine.easeInOut",
  });
}

/** @param {Phaser.GameObjects.Image} elementImage  */
export function UIaddSelectableEffect(elementImage) {
  let scene = elementImage.scene;
  if (elementImage.startScale == undefined) {
    elementImage.startScale = elementImage.scale;
  }
  const startScale = elementImage.startScale;
  const effectScale = startScale * 1.2;
  elementImage.scale = startScale;

  elementImage.setInteractive({ cursor: CURSORS.Gauntlet });
  elementImage.on("pointerover", () => {
    elementImage.scale = effectScale;
    addOutline(elementImage);

    scene.tweens.add({
      targets: elementImage,
      scale: effectScale,
      duration: 200,
      ease: "Sine.easeInOut",
    });
  });
  elementImage.on("pointerout", () => {
    scene.tweens.add({
      targets: elementImage,
      scale: startScale,
      duration: 200,
      ease: "Sine.easeInOut",
    });
    if (elementImage.outline) elementImage.outline.destroy();
  });
  elementImage.on("pointerdown", () => {
    elementImage.setScale(startScale);
    if (elementImage.outline) elementImage.outline.destroy();
  });
  elementImage.on("drag", () => {
    elementImage.setScale(startScale);
    if (elementImage.outline) elementImage.outline.destroy();
  });
}

/** @param {Phaser.GameObjects.Image} elementImage  */
export function UIaddFigureEffect(elementImage) {
  let scene = elementImage.scene;
  if (elementImage.startScale == undefined) {
    elementImage.startScale = elementImage.scale;
  }
  const startScale = elementImage.startScale;
  const effectScale = startScale * 1.2;
  elementImage.scale = startScale;
  elementImage.setInteractive({ cursor: CURSORS.Gauntlet });

  elementImage.on("pointerover", () => {
    // if scene.dra
    if (scene.isDragging == false) {
      elementImage.scale = effectScale;

      //SIZE
      scene.tweens.add({
        targets: elementImage,
        scale: effectScale,
        duration: 200,
        ease: "Sine.easeInOut",
      });

      //Alpha change YOYO
      scene.glow = scene.tweens.add({
        targets: elementImage,
        alpha: 0.5,
        yoyo: true,
        repeat: -1,
        duration: 500,
        ease: "Sine.easeInOut",
      });
    }
    // UIaddAcctiveEffect(elementImage);
  });
  elementImage.on("pointerout", () => {
    //SIZE
    scene.tweens.add({
      targets: elementImage,
      scale: startScale,
      alpha: 1,
      duration: 200,
      ease: "Sine.easeInOut",
    });
    if (scene.glow) scene.glow.stop();
    elementImage.setAlpha(1);
  });
  elementImage.on("pointerdown", () => {
    elementImage.setAlpha(1);
    elementImage.setScale(startScale);
  });
}

/**
 * @param {Phaser.GameObjects} target
 * @param {Function} callback calls onComplete
 */
export function UIFXSpinAndGo(target, goX, goY, callback) {
  // const startScale = target.scale;
  const animTarget = target;
  const scene = target.scene;
  const startX = target.x;
  const startY = target.y;
  scene.tweens.add({
    targets: animTarget,
    scale: 1.5,
    angle: 360,
    duration: 300,
    ease: "sine.in",
    onComplete: () => {
      scene.tweens.add({
        targets: animTarget,
        scale: 0,
        angle: -360,
        duration: 300,
        ease: "sine.out",
        x: goX,
        y: goY,
        onComplete: () => {
          animTarget.setAlpha(1);
          animTarget.x = startX;
          animTarget.y = startY;
          callback();

          // if (destroy) target.destroy();
        },
      });
    },
  });
}

/**
 * @param {Phaser.GameObjects} target
 * @param {Function} callback calls onComplete
 */
export function UIFXDisappear(target, callback) {
  // const startScale = target.scale;
  const animTarget = target;
  const scene = target.scene;
  scene.tweens.add({
    targets: animTarget,
    // angle: 360,
    alpha: 0,
    duration: 600,
    ease: "sine.in",
    onComplete: () => {
      animTarget.setAlpha(1);
      callback();
    },
  });
}
/**
 * @param {Phaser.GameObjects} target
 */
export function UIFXShake(target) {
  const scene = target.scene;
  const startX = target.x;
  scene.tweens.add({
    targets: target,
    yoyo: true,
    repeat: 1,
    x: startX + 50,
    duration: 150,
    ease: "sine.out",
  });
}

/**
 * @param {Phaser.Scene} scene
 * @param {string} text
 * @param {number} startX
 * @param {number} startY
 * @param {keyof FONTS} style "FONTS.*"
 */
export function UITextPopup(
  scene,
  text,
  startX,
  startY,
  finishX,
  finishY,
  color,
  style = FONTS.PORTRAIT_DAMAGE,
  targetImg
) {
  const dur = 1500;

  // console.log(color);
  let newStyleColor = "rgb(0, 0, 0)";
  switch (color) {
    case tetrominoTextures.RED:
      newStyleColor = "rgb(242, 55, 55)";
      break;
    case tetrominoTextures.BLUE:
      newStyleColor = "rgb(74, 191, 240)";
      break;
    case tetrominoTextures.YELLOW:
      newStyleColor = "rgb(255, 204, 0)";
      break;
    case tetrominoTextures.PURPLE:
      newStyleColor = "rgb(131, 89, 149)";
      break;
    case tetrominoTextures.ORANGE:
      newStyleColor = "rgb(247, 89, 43)";
      break;
  }

  style.color = newStyleColor;

  const height = 120;
  const textGO = scene.add.text(startX, startY, text, style).setAlpha(0);
  scene.tweens.add({
    targets: textGO,
    duration: dur / 2,
    ease: "sine.in",
    alpha: 1,
    onComplete: () => {
      scene.tweens.add({
        targets: textGO,
        x: finishX,
        y: finishY,
        duration: dur / 2,
        ease: "Bounce.easeOut",
        onComplete: () => {
          UIFXShake(targetImg);
          scene.tweens.add({
            targets: textGO,
            alpha: 0,
            y: "-=50",
            duration: dur / 2,
            ease: "sine.out",
          });
        },
      });
    },
  });
}
/**
 * @param {Phaser.Scene} scene
 * @param {Phaser.GameObjects.Container} container
 */
export function UIModalWindowDrop(scene, container) {
  const dur = 3000;
  const endHeight = container.y;
  const startHeight = -500;
  container.y = startHeight;
  scene.tweens.add({
    targets: container,
    duration: dur,
    y: endHeight,
    ease: "Bounce.easeOut",
  });
}
