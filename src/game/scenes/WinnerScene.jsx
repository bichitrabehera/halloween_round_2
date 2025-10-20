import Phaser from "phaser";
import winnerImg from "../../assets/win.png";
import bg from "../../assets/final_bg.svg";
import timeTaken from "../../assets/timeTaken.png";

export default class WinnerScene extends Phaser.Scene {
    constructor() {
        super("WinnerScene");
    }

    preload() {
        this.load.image("winnerImg", winnerImg);
        this.load.image("bg", bg);
        this.load.image("timeTaken", timeTaken);
    }

    create() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Background
        const bgImage = this.add.image(width / 2, height / 2, "bg");
        bgImage.setDisplaySize(width, height);

        // Winner Image
        this.add.image(width / 2, height / 2 - 100, "winnerImg")
            .setScale(0.3)
            .setOrigin(0.5);

        // Timer value from state (registry)
        const timerStart = this.registry.get("timerStart");
        const timeTaken = timerStart
            ? ((Date.now() - timerStart) / 1000).toFixed(2)
            : "N/A";

        // Timer banner (your image)
        const timerBanner = this.add.image(width / 2, height / 2 + 100, "timeTaken")
            .setScale(0.2)
            .setOrigin(0.5);

        // Text overlay on top of the image
        this.add.text(timerBanner.x, timerBanner.y + 50, `${timeTaken} seconds`, {
            fontSize: "40px",
            fontFamily: "monospace",
            color: "#ffffff",
            fontStyle: "bold",
            align: "center",
            stroke: "#000000",
            strokeThickness: 4
        }).setOrigin(0.5);

        // Congratulatory text
        this.add.text(
            width / 2,
            height / 2 + 300,
            "Congratulations! You finished the challenge!",
            {
                fontSize: "32px",
                color: "#ffcc00",
                fontFamily: "monospace",
                align: "center",
                stroke: "#000000",
                strokeThickness: 4
            }
        ).setOrigin(0.5);
    }

}
