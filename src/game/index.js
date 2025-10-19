import Phaser from "phaser";
import config from "./config";

let game;

export function initPhaserGame() {
  if (!game) {
    game = new Phaser.Game(config);
  }
  return game;
}

export function destroyPhaserGame() {
  if (game) {
    game.destroy(true);
    game = null;
  }
}
