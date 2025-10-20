import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.add
            .text(width / 2, height / 2 - 60, "Game Over", {
                fontSize: "64px",
                color: "#ff4444",
            })
            .setOrigin(0.5);

        this.add
            .text(width / 2, height / 2 + 10, "You ran out of chances.", {
                fontSize: "24px",
                color: "#ffffff",
            })
            .setOrigin(0.5);
        // Thank you message only
        this.add
            .text(width / 2, height / 2 + 80, "Thank you for playing!", {
                fontSize: "22px",
                color: "#ffffff",
            })
            .setOrigin(0.5);
    }
}
