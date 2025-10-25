import Phaser from "phaser";
import bg from "../../assets/final_bg.png";
import playNow from "../../assets/play_game.svg";
import dataverse from "../../assets/dataverse.png";

export default class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        // Load background and button
        this.load.image("bg", bg);
        this.load.image("playNow", playNow);
        this.load.image("dataverse", dataverse);

        // 👇 Load the Press Start 2P font via a webfont loader
        this.load.script("webfont", "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // --- Background ---
        const bgImage = this.add.image(width / 2, height / 2, "bg")
        bgImage.displayWidth = width;
        bgImage.displayHeight = height;

        // --- Load and apply font ---
        (window).WebFont.load({
            google: { families: ["Press Start 2P"] },
            active: () => {
                // --- Title Text ---
                this.add
                    .text(width / 2, height * 0.25, "Round 2: The Realm of Shadows", {
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: "38px",
                        color: "#05339C",
                        align: "center",
                    })
                    .setOrigin(0.5) // Center both horizontally and vertically
                    .setDepth(2);
            },
        });

        // --- Play Button ---
        const playButton = this.add
            .image(width / 2, height * 0.5, "playNow")
            .setScale(1.2)
            .setInteractive({ useHandCursor: true });

        playButton.on("pointerdown", () => {
            // --- Confirmation Dialog ---
            const confirmBg = this.add
                .rectangle(width / 2, height * 0.7, 600, 300, 0x000000, 1)
                .setOrigin(0.5);
            const confirmText = this.add
                .text(width / 2, height * 0.67, "Start the timer and begin?", {
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "18px",
                    color: "#ffffff",
                    align: "center",
                })
                .setOrigin(0.5);
            const yesBtn = this.add
                .text(width / 2 - 80, height * 0.73, "Yes", {
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "20px",
                    color: "#00ff00",
                    backgroundColor: "#222",
                    padding: { left: 20, right: 20, top: 10, bottom: 10 },
                })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            const noBtn = this.add
                .text(width / 2 + 80, height * 0.73, "No", {
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "20px",
                    color: "#ff0000",
                    backgroundColor: "#222",
                    padding: { left: 20, right: 20, top: 10, bottom: 10 },
                })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            yesBtn.on("pointerdown", () => {
                this.registry.set("timerStart", Date.now());
                confirmBg.destroy();
                confirmText.destroy();
                yesBtn.destroy();
                noBtn.destroy();
                this.scene.start("Round1");
            });

            noBtn.on("pointerdown", () => {
                confirmBg.destroy();
                confirmText.destroy();
                yesBtn.destroy();
                noBtn.destroy();
            });
        });

        // --- Logo ---
        // this.add.image(width / 2, height - 120, "dataverse").setScale(0.4).setOrigin(0.5);
    }
}
