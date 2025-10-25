import Phaser from "phaser";

// ======== ASSET IMPORTS ========
import sky from "../../assets/latest.png";
import groundTop from "../../assets/top.svg";
import tile from "../../assets/222.svg";
import D from "../../assets/D.svg";
import complexLow from "../../assets/complex/complex low.svg";
import complexHigh from "../../assets/complex/complex high.svg";
import still1 from "../../assets/char3.png";
import jump2 from "../../assets/char3.png";
import terminalImg from "../../assets/terminal.png";
import arrow from "../../assets/arrow.svg";
import q1 from "../../assets/question1.png"
import q2 from "../../assets/question1.png"

export default class Round2 extends Phaser.Scene {
    constructor() {
        super("Round2");
        this.code1Solved = false;
        this.code2Solved = false;
        this.chances = 3;
    }

    preload() {
        this.load.image("sky", sky);
        this.load.image("ground-top", groundTop);
        this.load.image("tile", tile);
        this.load.image("D", D);
        this.load.image("complexLow", complexLow);
        this.load.image("complexHigh", complexHigh);
        this.load.image("still1", still1);
        this.load.image("jump2", jump2);
        this.load.image("terminal", terminalImg);
        this.load.image("arrow", arrow);
        this.load.image("q1", q1)
        this.load.image("q2", q2)
    }

    create() {
        this.chances = 3;

        const width = this.scale.width;
        const height = this.scale.height;

        // === BACKGROUND ===
        const bg = this.add.image(width / 2, height / 2, "sky");
        bg.setDisplaySize(width, height);

        // === PLATFORMS ===
        this.platforms = this.physics.add.staticGroup();

        const createPlatform = (xPct, yPct, key, scale = 1, flip = false) => {
            const x = width * xPct;
            const y = height * yPct;
            const obj = this.platforms.create(x, y, key);
            obj.setScale(scale).refreshBody();
            if (flip) obj.setFlipX(true);
            return obj;
        };

        // === COMPLEX PLATFORMS ===
        createPlatform(0.25, 0.8, "complexLow", 0.7);
        createPlatform(0.65, 0.7, "complexHigh", 0.5);
        createPlatform(0.85, 0.6, "complexLow", 0.7, true);
        createPlatform(0.45, 0.5, "complexHigh", 0.5, true);
        createPlatform(0.55, 0.9, "complexLow", 0.6, true);
        createPlatform(0.75, 0.85, "complexHigh", 0.4);
        createPlatform(0.3, 0.65, "complexHigh", 0.4, true);
        createPlatform(0.65, 0.4, "complexLow", 0.6);
        createPlatform(0.85, 0.35, "complexHigh", 0.4, true);
        createPlatform(0.5, 0.6, "complexLow", 0.5);
        createPlatform(0.6, 0.55, "complexHigh", 0.35, true);
        createPlatform(0.3, 0.4, "complexLow", 0.5, true);
        createPlatform(0.75, 0.75, "complexHigh", 0.4);
        createPlatform(0.47, 0.3, "complexLow", 0.4, true);

        // === TERMINAL BOXES ===
        this.terminal1Box = createPlatform(0.05, 0.35, "D", 0.6);
        this.terminal2Box = createPlatform(0.95, 0.35, "D", 0.6);

        // === PLAYER ===
        this.player = this.physics.add.sprite(width * 0.1, height * 0.9, "still1").setScale(0.15);
        this.player.setBounce(0.05);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1200);
        this.physics.add.collider(this.player, this.platforms);

        // === TERMINALS ===
        this.terminal1 = this.physics.add.staticImage(width * 0.05, height * 0.29, "terminal").setScale(0.1);
        this.terminal2 = this.physics.add.staticImage(width * 0.95, height * 0.29, "terminal").setScale(0.1);

        const createTerminalZone = (xPct, yPct) => {
            const x = width * xPct;
            const y = height * yPct;
            const zone = this.add.zone(x, y, 30, 30).setOrigin(0.5);
            this.physics.add.existing(zone, true);
            return zone;
        };

        this.prompt1Open = false;
        this.prompt2Open = false;

        const terminal1Zone = createTerminalZone(0.05, 0.29);
        this.physics.add.overlap(this.player, terminal1Zone, () => {
            if (!this.prompt1Open && !this.code1Solved) {
                this.prompt1Open = true;
                this.showCodePrompt("1", `q1`, 1);
            }
        }, undefined, this);

        const terminal2Zone = createTerminalZone(0.95, 0.29);
        this.physics.add.overlap(this.player, terminal2Zone, () => {
            if (!this.prompt2Open && !this.code2Solved) {
                this.prompt2Open = true;
                this.showCodePrompt("2", `q2`, 2);
            }
        }, undefined, this);

        // === EXIT ARROW ===
        this.exitArrow = this.physics.add.staticImage(width / 2, height * 0.15, "arrow").setScale(0.9);
        this.physics.add.overlap(this.player, this.exitArrow, () => {
            if (this.code1Solved && this.code2Solved) {
                this.scene.start("WinnerScene");
            } else {
                const msg = this.add.text(this.player.x, this.player.y - 100, "⚠️ Solve both terminals first!", {
                    fontSize: "20px",
                    color: "#ff0000",
                    backgroundColor: "#000000aa",
                }).setOrigin(0.5);
                this.time.delayedCall(1500, () => msg.destroy());
            }
        });

        // === CONTROLS ===
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (!this.player || !this.cursors) return;

        const moveSpeed = 300;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-moveSpeed);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(moveSpeed);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.player.setVelocityY(-500);
            if (!this.player.anims.isPlaying) this.player.setTexture("jump2");
        }
    }

    showCodePrompt(correctCode, imgKey, terminalNumber) {
        this.physics.pause();
        const width = this.scale.width;
        const height = this.scale.height;

        // --- Overlay ---
        // const overlay = this.add.rectangle(width / 2, height / 2, width * 0.6, height * 0.6, 0x000000, 0.95);

        // --- Puzzle Image (instead of text) ---
        const puzzleImg = this.add.image(width / 2, height / 2 - 50, imgKey)
            .setOrigin(0.5)
            .setScale(0.5);

        // --- Instruction text below the image ---
        const promptText = this.add.text(width / 2, height / 2 + 150, `Enter the answer below: (${this.chances} chances left)`, {
            fontSize: "20px",
            color: "#ffffff",
            fontFamily: "Press Start 2P",
        }).setOrigin(0.5);

        // --- HTML Input Box ---
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Type your answer here...";
        input.style.position = "fixed";
        input.style.left = `${width / 2 - 100}px`;
        input.style.top = `${height / 2 + 180}px`;
        input.style.width = "200px";
        input.style.padding = "8px";
        input.style.fontSize = "16px";
        input.style.border = "2px solid #ff8800";
        input.style.borderRadius = "10px";
        input.style.zIndex = "1000";
        document.body.appendChild(input);
        input.focus();

        // --- Key Listener for Enter ---
        const keyListener = (e) => {
            if (e.key === "Enter") {
                const answer = input.value.trim().toLowerCase();
                if (answer === correctCode.toLowerCase()) {
                    input.removeEventListener("keydown", keyListener);
                    input.remove();
                    // overlay.destroy();
                    puzzleImg.destroy();
                    promptText.destroy();
                    this.physics.resume();

                    if (terminalNumber === 1) {
                        this.code1Solved = true;
                        this.prompt1Open = false;
                    }
                    if (terminalNumber === 2) {
                        this.code2Solved = true;
                        this.prompt2Open = false;
                    }

                    this.add.text(width / 2, height / 2 - height * 0.3, `Terminal unlocked!`, {
                        fontSize: "24px",
                        color: "#00ff00",
                    }).setOrigin(0.5);

                } else {
                    this.chances = (typeof this.chances === 'number') ? this.chances - 1 : 2;
                    if (this.chances > 0) {
                        promptText.setText(`Wrong answer! ${this.chances} chance${this.chances === 1 ? '' : 's'} left.`);
                    } else {
                        input.removeEventListener("keydown", keyListener);
                        input.remove();
                        // overlay.destroy();
                        puzzleImg.destroy();
                        promptText.destroy();
                        this.physics.resume();
                        this.prompt1Open = false;
                        this.prompt2Open = false;
                        this.scene.start("GameOver");
                    }
                }
            }
        };
        input.addEventListener("keydown", keyListener);
    }

}
