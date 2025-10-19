import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import Round1 from "./scenes/Round1";
import Round2 from "./scenes/Round2";
import WinnerScene from "./scenes/WinnerScene";

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "game-container",
    width: 1920,
    height: 1265,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#111",
  parent: "phaser-container",
  dom: { createContainer: true },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, WinnerScene, Round1, Round2],
};

export default config;
