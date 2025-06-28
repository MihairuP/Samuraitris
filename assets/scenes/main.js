import { PreloadScene } from "./preloadScene.js";
import { SCENES } from "../common/keys.js";
import { idleScene } from "./idleScene.js";

const config = {
  type: Phaser.AUTO,
  disableContextMenu: true,
  preventDefaultWheel: true,
  inputMousePreventDefaultWheel: true,
  parent: "game",
  fullscreenTarget: "game",
  scale: {
    width: 1000,
    // width: 1920,
    height: 900,
    mode: Phaser.Scale.EXPAND,

    // autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
};
const game = new Phaser.Game(config);
game.scene.add(SCENES.PRELOAD, PreloadScene);
game.scene.add(SCENES.IDLE, idleScene, false);

// window.onresize = function (){
//   if(window.innerWidth > window.innerHeight){
//     // landscape
//   }
//   else{
//     // portrait
//   }
// };
