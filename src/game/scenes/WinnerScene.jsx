import Phaser from "phaser";
import winnerSvg from "../../assets/ZK_Math.svg";
import bg from "../../assets/final_bg.svg";

export default class WinnerScene extends Phaser.Scene {
    constructor() {
        super("WinnerScene");
    }

    preload() {
        this.load.image("winnerSvg", winnerSvg);
        this.load.image("bg", bg);
    }

    create() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Background
        const bgImage = this.add.image(width / 2, height / 2, "bg");
        bgImage.setDisplaySize(width, height);
        // Winner SVG
        this.add.image(width / 2, height / 2 - 100, "winnerSvg").setScale(1.2).setOrigin(0.5);
        // Timer
        const timerStart = this.registry.get("timerStart");
        const timeTaken = timerStart ? ((Date.now() - timerStart) / 1000).toFixed(2) : "N/A";
        this.add.text(width / 2, height / 2 + 100, `Time Taken: ${timeTaken} seconds`, {
            fontSize: "40px",
            color: "#fff",
            fontFamily: "monospace",
            align: "center"
        }).setOrigin(0.5);
        // Congratulatory text
        this.add.text(width / 2, height / 2 + 180, "Congratulations! You finished the challenge!", {
            fontSize: "32px",
            color: "#ffcc00",
            fontFamily: "monospace",
            align: "center"
        }).setOrigin(0.5);
    }
}
