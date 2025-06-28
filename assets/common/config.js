import { ORIENTATION } from "./keys.js";

export const SETTINGS = Object.freeze({
  Grid_Size: 8,
  Cell_Size: 40,
});
export const GLOBAL_VALUES = {
  Orientation: ORIENTATION.LANDSCAPE,
  YFingerShift: 60,
  onMobile: false,
};

export const FONTS = Object.freeze({
  DEFAULT: {
    fontFamily: "Arial",
    fontSize: "18px",
    // color: '#ffffff',
    color: "rgb(248, 179, 48)",
    stroke: "rgb(74, 33, 0)",
    strokeThickness: 10,
    align: "center",
    fontStyle: "bold",
  },
  PORTRAIT_DAMAGE: {
    fontFamily: "Arial",
    fontSize: "60px",
    color: "rgb(168, 50, 50)",
    stroke: "rgb(74, 33, 0)",
    strokeThickness: 10,
    align: "center",
    fontStyle: "bold",
  },
  LeftOverlayName: {
    fontFamily: "Arial",
    fontSize: "18px",
    color: "rgb(248, 179, 48)",
    stroke: "rgb(74, 33, 0)",
    strokeThickness: 10,
    align: "center",
    fontStyle: "bold",
  },

  ENEMY_CAPTIONS_FONT: {
    fontFamily: "Arial",
    fontSize: "24px",
    color: "#ffffff",
    stroke: "rgb(74, 33, 0)",
    strokeThickness: 10,
    align: "center",
    fontStyle: "bold",
  },
});

export const IMAGE_SIZES = Object.freeze({
  unitSpriteScale: 1, //0.5 - 2
  battleContainerWidth: 1200,
  battleLeftOverlayWidth: 400,
  hpBarScale: 1,
  cardsScale: 0.5,
  cardsHeight: 1050,
  cardsLeftPadding: 20,
  leftOverlayWidth: 360,
  playerHPBarWidth: 400,
});

export const COLORS = Object.freeze({
  CELL_BG: 0xeae0cd,
  // CELL_BG: 0x25003e,
  CELL_DARK: 0xe5606d,
  BLACK: 0x000000,
  CELL_BORDER: 0xf95900,
});
