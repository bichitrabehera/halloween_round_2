import Phaser from "phaser";
import bg from "../../assets/final_bg.png";
import playNow from "../../assets/play_game.svg";
import tech0ween from "../../assets/tech0ween.png";
import dataverse from "../../assets/dataverse.png";

export default class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        // Load background and button
        this.load.image("bg", bg);
        this.load.image("playNow", playNow);
        this.load.image("tech0ween", tech0ween);
        this.load.image("dataverse", dataverse);
    }

    create() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Add background (centered, scaled)
        const bgImage = this.add.image(width / 2, height / 2, "bg");
        bgImage.displayWidth = this.sys.game.config.width;
        bgImage.displayHeight = this.sys.game.config.height;


        // Add “Play Now” button at center
        const playButton = this.add.image(this.sys.game.config.width / 2, 400, "playNow").setScale(1.2).setInteractive({ useHandCursor: true });

        playButton.on("pointerdown", () => {
            // Show confirmation dialog
            const confirmBg = this.add.rectangle(this.sys.game.config.width / 2, 700, 600, 300, 0x000000, 1).setOrigin(0.5);
            const confirmText = this.add.text(this.sys.game.config.width / 2, 670, "Start the timer and begin?", {
                fontSize: "28px",
                color: "#fff",
                align: "center"
            }).setOrigin(0.5);
            const yesBtn = this.add.text(this.sys.game.config.width / 2 - 80, 730, "Yes", {
                fontSize: "32px",
                color: "#00ff00",
                backgroundColor: "#222",
                padding: { left: 20, right: 20, top: 10, bottom: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            const noBtn = this.add.text(this.sys.game.config.width / 2 + 80, 730, "No", {
                fontSize: "32px",
                color: "#ff0000",
                backgroundColor: "#222",
                padding: { left: 20, right: 20, top: 10, bottom: 10 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            yesBtn.on("pointerdown", () => {
                // Start timer and go to Round1
                this.registry.set("timerStart", Date.now());
                confirmBg.destroy(); confirmText.destroy(); yesBtn.destroy(); noBtn.destroy();
                this.scene.start("Round1");
            });
            noBtn.on("pointerdown", () => {
                confirmBg.destroy(); confirmText.destroy(); yesBtn.destroy(); noBtn.destroy();
            });
        });

        // Add a glowing title text above it (optional)
        this.add.image(this.sys.game.config.width / 2, 200, "tech0ween").setScale(0.4).setOrigin(0.5);

        this.add.image(this.sys.game.config.width / 2, 1400, "dataverse").setScale(0.4).setOrigin(0.5);
    }
}
