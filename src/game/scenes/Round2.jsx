import Phaser from "phaser";

// ======== ASSET IMPORTS ========
import sky from "../../assets/latest.png";
import groundTop from "../../assets/top.svg";
import tile from "../../assets/222.svg";
import D from "../../assets/D.svg";
import A from "../../assets/tile.svg";
import C from "../../assets/C.svg";
import ch from "../../assets/ch.svg";
import cl from "../../assets/complex.svg";
import complexLow from "../../assets/complex/complex low.svg";
import complexHigh from "../../assets/complex/complex high.svg";
import B1 from "../../assets/B1.png";
import B2 from "../../assets/B2.png";
import B3 from "../../assets/B3.png";
import L1 from "../../assets/L1.png";
import L2 from "../../assets/L2.png";
import l1 from "../../assets/l-1.png";
import r1 from "../../assets/r-1.png";
import t1 from "../../assets/t-1.png";
import still1 from "../../assets/char3.png";
import still2 from "../../assets/char3.png";
import walk1 from "../../assets/char3.png";
import walk2 from "../../assets/char3.png";
import jump1 from "../../assets/char3.png";
import jump2 from "../../assets/char3.png";
import jump3 from "../../assets/char3.png";
import wizard from "../../assets/baba1.png";
import sage from "../../assets/rst.png";
import arrow from "../../assets/arrow.svg";
import terminalImg from "../../assets/terminal.png";
import collectible from "../../assets/star.png";
import correctAnswer from "../../assets/correct_answer.svg";
import wrongAnswer from "../../assets/wrong_answer.svg";
import question1 from "../../assets/Q1normal.svg";
import hint1 from "../../assets/Q1Hint.svg";


export default class Round2 extends Phaser.Scene {
    constructor() {
        super("Round2");
        this.code1Solved = false;
        this.code2Solved = false;
    }

    preload() {
        // === LOAD ALL IMAGES ===
        this.load.image("sky", sky);
        this.load.image("ground-top", groundTop);
        this.load.image("tile", tile);
        this.load.image("D", D);
        this.load.image("A", A);
        this.load.image("C", C);
        this.load.image("ch", ch);
        this.load.image("cl", cl);
        this.load.image("complexLow", complexLow);
        this.load.image("complexHigh", complexHigh);
        this.load.image("B1", B1);
        this.load.image("B2", B2);
        this.load.image("B3", B3);
        this.load.image("L1", L1);
        this.load.image("L2", L2);
        this.load.image("l-1", l1);
        this.load.image("r-1", r1);
        this.load.image("t-1", t1);
        this.load.image("still1", still1);
        this.load.image("still2", still2);
        this.load.image("walk1", walk1);
        this.load.image("walk2", walk2);
        this.load.image("jump1", jump1);
        this.load.image("jump2", jump2);
        this.load.image("jump3", jump3);
        this.load.image("wizard", wizard);
        this.load.image("sage", sage);
        this.load.image("arrow", arrow);
        this.load.image("terminal", terminalImg);
        this.load.image("collectible", collectible);
        this.load.image("correct_answer", correctAnswer);
        this.load.image("wrong_answer", wrongAnswer);
        this.load.image("question1", question1);
        this.load.image("hint1", hint1);
    }

    create() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // === BACKGROUND ===
        const bg = this.add.image(width / 2, height / 2, "sky");
        bg.setDisplaySize(width, height);

        // === PLATFORMS ===
        this.platforms = this.physics.add.staticGroup();

        const p = (x, y, key, scale = 1, alpha = 1, flip = false) => {
            const obj = this.platforms.create(x, y, key);
            obj.setScale(scale).refreshBody();
            obj.setAlpha(alpha);
            obj.setFlipX(flip);
            return obj;
        };

        // === CHALLENGE PLATFORMS (complex shapes) ===
        // Place a few 'low' and 'high' platforms for tough jumps
        p(400, 800, "complexLow", 0.7);
        p(1000, 700, "complexHigh", 0.5);
        p(1550, 600, "complexLow", 0.7, 1, true);
        p(700, 500, "complexHigh", 0.5, 1, true);
        // Additional platforms for more complexity
        p(600, 900, "complexLow", 0.6, 1, true);
        p(1300, 850, "complexHigh", 0.4);
        p(300, 650, "complexHigh", 0.4, 1, true);
        p(1200, 400, "complexLow", 0.6);
        p(1600, 350, "complexHigh", 0.4, 1, true);
        // Even more for extra challenge
        p(850, 600, "complexLow", 0.5);
        p(1100, 550, "complexHigh", 0.35, 1, true);
        p(500, 400, "complexLow", 0.5, 1, true);
        p(1450, 750, "complexHigh", 0.4);
        p(900, 300, "complexLow", 0.4, 1, true);


        // Terminal boxes (unchanged)
        p(80, 350, "D", 0.6);
        p(width - 80, 350, "D", 0.6);


        // === PLAYER ===
        this.player = this.physics.add.sprite(300, 900, "still1").setScale(0.15);
        this.player.setBounce(0.05);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1200);
        this.physics.add.collider(this.player, this.platforms);

        // === TERMINALS (corners, above boxes) ===
        // LEFT CORNER TERMINAL
        this.terminal1Box = this.platforms.create(80, 350, "D").setScale(0.6).refreshBody();
        this.terminal1 = this.physics.add.staticImage(80, 290, "terminal").setScale(0.1);

        // RIGHT CORNER TERMINAL
        this.terminal2Box = this.platforms.create(width - 80, 350, "D").setScale(0.6).refreshBody();
        this.terminal2 = this.physics.add.staticImage(width - 80, 290, "terminal").setScale(0.1);

        this.terminal1.body.setSize(this.terminal1.displayWidth, this.terminal1.displayHeight);
        this.terminal2.body.setSize(this.terminal2.displayWidth, this.terminal2.displayHeight);


        // Create interaction zones for both terminals
        const createTerminalZone = (x, y) => {
            const interactionWidth = 30;  // Match terminal width
            const interactionHeight = 30;  // Match terminal height

            // Create physics zone exactly at terminal position
            const zone = this.add.zone(x, y, interactionWidth, interactionHeight).setOrigin(0.5);
            this.physics.add.existing(zone, true);

            // Debug visualization (green semi-transparent rectangle)
            const _zoneDebug = this.add.rectangle(x, y, interactionWidth, interactionHeight, 0x000000, 0.2).setOrigin(0.5); return zone;
        };

        // Initialize prompt guards
        this.prompt1Open = false;
        this.prompt2Open = false;

        // Create and set up terminal 1 interaction
        const terminal1Zone = createTerminalZone(80, 290, 1); // Match exact terminal image position
        this.physics.add.overlap(this.player, terminal1Zone, () => {
            if (!this.prompt1Open && !this.code1Solved) {
                this.prompt1Open = true;
                this.showCodePrompt(
                    "120phoenix",
                    `# Puzzle 1
def tricky(a, b):
    s = 0
    for i in range(a):
        s += i * b
    return s

print(tricky(5, 6))  # ???`,
                    1
                );
            }
        }, undefined, this);

        // Create and set up terminal 2 interaction
        const terminal2Zone = createTerminalZone(width - 80, 290, 2); // Match exact terminal image position
        this.physics.add.overlap(this.player, terminal2Zone, () => {
            if (!this.prompt2Open && !this.code2Solved) {
                this.prompt2Open = true;
                this.showCodePrompt(
                    "27wizard",
                    `# Puzzle 2
def shift(x):
    return (x // 3) ** 3

print(shift(9))  # ???`,
                    2
                );
            }
        }, undefined, this);

        // === EXIT ARROW ===
        this.exitArrow = this.physics.add.staticImage(960, 150, "arrow").setScale(0.9);
        this.physics.add.overlap(
            this.player,
            this.exitArrow,
            () => {
                if (this.code1Solved && this.code2Solved) {
                    // Move to WinnerScene
                    this.scene.start("WinnerScene");
                } else {
                    const msg = this.add
                        .text(this.player.x, this.player.y - 100, "⚠️ Solve both terminals first!", {
                            fontSize: "20px",
                            color: "#ff0000",
                            backgroundColor: "#000000aa",
                        })
                        .setOrigin(0.5);
                    this.time.delayedCall(1500, () => msg.destroy());
                }
            },
            undefined,
            this
        );

        // === CONTROLS ===
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (!this.player || !this.cursors) return;

        const moveSpeed = 300;

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-moveSpeed);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(moveSpeed);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }

        // Infinite jump logic
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.player.setVelocityY(-500); // Adjust jump strength
            // Optionally play jump animation here
            if (!this.player.anims.isPlaying) this.player.setTexture("jump2");
        }
    }


    showCodePrompt(correctCode, pythonSnippet, terminalNumber) {
        this.physics.pause();
        const width = window.innerWidth;
        const height = window.innerHeight;

        const overlay = this.add.rectangle(width / 2, height / 2, 600, 500, 0x000000, 0.95);

        const snippetText = this.add.text(width / 2, height / 2 - 180, pythonSnippet, {
            fontSize: "18px",
            color: "#00ff00",
            fontFamily: "monospace",
            wordWrap: { width: 540, useAdvancedWrap: true },
        }).setOrigin(0.5, 0);

        const promptText = this.add
            .text(width / 2, height / 2 + 100, "Enter the answer below:", {
                fontSize: "20px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Type your answer here...";
        input.style.position = "fixed";
        input.style.left = `${width / 2 - 100}px`;
        input.style.top = `${height / 2 + 130}px`;
        input.style.width = "200px";
        input.style.padding = "8px";
        input.style.fontSize = "16px";
        input.style.border = "2px solid #ff8800";
        input.style.borderRadius = "10px";
        input.style.zIndex = "1000";
        document.body.appendChild(input);
        input.focus();

        const keyListener = (e) => {
            if (e.key === "Enter") {
                const answer = input.value.trim().toLowerCase();
                if (answer === correctCode.toLowerCase()) {
                    input.removeEventListener("keydown", keyListener);
                    input.remove();
                    overlay.destroy();
                    snippetText.destroy();
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

                    this.add
                        .text(width / 2, height / 2 - 200, `Terminal unlocked!`, {
                            fontSize: "24px",
                            color: "#00ff00",
                        })
                        .setOrigin(0.5);
                } else {
                    promptText.setText("Wrong answer! Try again...");

                }
            }
        };
        input.addEventListener("keydown", keyListener);
    }
}
