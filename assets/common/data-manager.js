// import { CARD_TEMPLATES } from "../scenes/battle/cards.js";
// import { Player } from "../scenes/player.js";
// import { IMG_BATTLEBACKS } from "./keys.js";

export const DATA_STORAGE_KEYS = Object.freeze({
  SCENE_BATTLE: "SCENE_BATTLE",
  SCENE_IDLE: "SCENE_IDLE",
  SCENE_BATTLE_UI: "SCENE_BATTLE_UI",
  GOLD: "GOLD",
});

//** @typedef {GlobalState} */
const initialState = {
  playerGold: 0,
  // player: new Player({}),
  // player: {
  //     position: {
  //         x: 200,
  //         y: 100
  //     },
  //   deck: [
  //     CARD_TEMPLATES.TStrike,
  //     CARD_TEMPLATES.CrossStrike,
  //     // CARD_TEMPLATES.TStrike,
  //     // CARD_TEMPLATES.CrossStrike,
  //   ],
  // stats: {
  //     name: "Saria",
  //     maxHP: 100,
  //     currentHP: 100,
  //     maxInitiative: 3,
  //     currentInitiative: 0,
  //     cardsEachTurn: 3,
  // },
  // battleBG: IMG_BATTLEBACKS.RAISING_RIBS
};

class DataManager extends Phaser.Events.EventEmitter {
  //** @type {Phaser.Data.DataManager} */
  store;
  constructor() {
    super();

    this.store = new Phaser.Data.DataManager(this);
    this.updateDataManager(initialState);
  }
  get store() {
    return this.store;
  }

  //** @param {GlobalState} data */
  updateDataManager(data) {
    this.store.set({
      [DATA_STORAGE_KEYS.GOLD]: data.playerGold,
      // [DATA_STORAGE_KEYS.PLAYER]: data.player,
      // [DATA_STORAGE_KEYS.PLAYER_STATS]: data.stats,
      // [DATA_STORAGE_KEYS.PLAYER_POSITON]: data.player.position,
      //   [DATA_STORAGE_KEYS.PLAYER_DECK]: data.deck,
      // [DATA_STORAGE_KEYS.BATTLE_BG]: data.battleBG,
    });
  }
}

export const dataManager = new DataManager();
