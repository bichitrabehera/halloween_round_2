import Phaser from "phaser";
import sky1 from "../../assets/level2.png";
import one from "../../assets/1.svg";
import two from "../../assets/2.svg";
import three from "../../assets/3.svg";
import four from "../../assets/4.svg";
import eight from "../../assets/8.svg";
import sixtyOne from "../../assets/61.svg";
import sixtyTwo from "../../assets/62.svg";
import sixtyThree from "../../assets/63.svg";
import seventyOne from "../../assets/71.svg";
import seventyTwo from "../../assets/72.svg";
import L from "../../assets/L.png";
import M from "../../assets/M.png";
import N from "../../assets/N.png";
import O from "../../assets/O.png";
import P from "../../assets/P.png";
import l2 from "../../assets/l-2.png";
import r2 from "../../assets/r-2.png";
import t2 from "../../assets/t-2.png";
import still1 from "../../assets/char2.png";
import still2 from "../../assets/char2.png";
import walk1 from "../../assets/char2.png";
import walk2 from "../../assets/char2.png";
import jump1 from "../../assets/char2.png";
import jump2 from "../../assets/char2.png";
import jump3 from "../../assets/char2.png";
import arrow from "../../assets/arrow.svg";
import terminalImg from "../../assets/terminal.png";
import correctAnswer from "../../assets/correct_answer.svg";

export default class Round1 extends Phaser.Scene {
    constructor() {
        super("Round1");
    }

    preload() {
        this.load.image("sky1", sky1);
        this.load.image("1", one);
        this.load.image("2", two);
        this.load.image("3", three);
        this.load.image("4", four);
        this.load.image("8", eight);
        this.load.image("61", sixtyOne);
        this.load.image("62", sixtyTwo);
        this.load.image("63", sixtyThree);
        this.load.image("71", seventyOne);
        this.load.image("72", seventyTwo);
        this.load.image("L", L);
        this.load.image("M", M);
        this.load.image("N", N);
        this.load.image("O", O);
        this.load.image("P", P);
        this.load.image("l-2", l2);
        this.load.image("r-2", r2);
        this.load.image("t-2", t2);
        this.load.image("still1", still1);
        this.load.image("still2", still2);
        this.load.image("walk1", walk1);
        this.load.image("walk2", walk2);
        this.load.image("jump1", jump1);
        this.load.image("jump2", jump2);
        this.load.image("jump3", jump3);
        this.load.image("arrow", arrow);
        this.load.image("terminal", terminalImg);
        this.load.image("correctAnswer", correctAnswer);
    }

    create() {
        // --- Responsive scaling setup ---
        const BASE_WIDTH = 1920;
        const BASE_HEIGHT = 1080;
        const width = this.scale.width;
        const height = this.scale.height;
        const scaleRatio = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);

        this.chances = 3;
        this.canDoubleJump = true;
        this.codeSolved = false;

        // --- Background ---
        const bg = this.add.image(width / 2, height / 2, "sky1");
        bg.setDisplaySize(width, height);

        // --- Platform creation helper (auto-scaled) ---
        this.platforms = this.physics.add.staticGroup();
        const p = (x, y, key, flip = false, scale = 1, alpha = 1) => {
            const obj = this.platforms.create(x * scaleRatio, y * scaleRatio, key);
            obj.setScale(scale * scaleRatio).refreshBody();
            obj.setFlipX(flip);
            obj.setAlpha(alpha);
            return obj;
        };

        // --- Platforms ---
        p(200, 870, "1");
        p(960, 870, "8");
        p(1770, 1000, "1", true);

        p(350, 750, "71");
        p(620, 700, "72");
        p(960, 650, "61");
        p(1300, 700, "72", true);
        p(1670, 750, "71", true);

        p(500, 500, "4");
        p(800, 450, "62");
        p(1120, 450, "63");
        p(1450, 500, "4", true);

        p(650, 300, "3");
        p(1270, 300, "3", true);
        p(960, 250, "8");

        // Invisible / code platforms
        p(360, 1050, "L", false, 1, 0);
        p(720, 1030, "M", false, 1, 0);
        p(960, 1050, "N", false, 1, 0);
        p(1200, 1030, "O", false, 1, 0);
        p(1560, 1050, "P", false, 1, 0);

        // Side walls & top boundaries
        p(30, 540, "l-2", false, 1, 0);
        p(1890, 540, "r-2", false, 1, 0);
        p(960, 70, "t-2", false, 1, 0);

        // Terminal & exit platforms
        p(200, 350, "1");
        p(1750, 350, "1");
        p(950, 900, "8");
        p(1200, 900, "8");

        // --- Player ---
        this.player = this.physics.add
            .sprite(300 * scaleRatio, 800 * scaleRatio, "still1")
            .setScale(0.15 * scaleRatio)
            .setBounce(0.05)
            .setCollideWorldBounds(true);
        this.player.setGravityY(1200 * scaleRatio);
        this.physics.add.collider(this.player, this.platforms);

        // --- Floor (invisible) ---
        this.floor = this.physics.add.staticGroup();
        this.floor
            .create(width / 2, height + 30 * scaleRatio, null)
            .setVisible(false)
            .setSize(width, 60 * scaleRatio)
            .refreshBody();
        this.physics.add.collider(this.player, this.floor);

        // --- Camera & world bounds ---
        this.cameras.main.setBounds(0, 0, BASE_WIDTH * scaleRatio, BASE_HEIGHT * scaleRatio);
        this.physics.world.setBounds(0, 0, BASE_WIDTH * scaleRatio, BASE_HEIGHT * scaleRatio);

        // --- Terminal ---
        this.terminal = this.physics.add
            .staticImage(200 * scaleRatio, 300 * scaleRatio, "terminal")
            .setScale(0.1 * scaleRatio);

        const interactionZone = this.add
            .zone(200 * scaleRatio, 330 * scaleRatio, 80 * scaleRatio, 120 * scaleRatio)
            .setOrigin(0.5);
        this.physics.add.existing(interactionZone, true);

        this.promptOpen = false;
        this.physics.add.overlap(
            this.player,
            interactionZone,
            () => {
                if (!this.promptOpen && !this.codeSolved) {
                    this.showCodePrompt();
                }
            },
            undefined,
            this
        );

        // --- Exit ---
        this.exitArrow = this.physics.add
            .staticImage(1750 * scaleRatio, 300 * scaleRatio, "arrow")
            .setScale(0.9 * scaleRatio);
        this.physics.add.overlap(
            this.player,
            this.exitArrow,
            () => {
                if (this.codeSolved) {
                    const cx = width / 2;
                    const cy = height / 2;
                    const confirmBg = this.add.rectangle(cx, cy, 400, 180, 0x000000, 0.85).setOrigin(0.5);
                    const confirmText = this.add
                        .text(cx, cy - 30, "Proceed to Round 2?", {
                            fontSize: `${28 * scaleRatio}px`,
                            color: "#fff",
                            align: "center",
                        })
                        .setOrigin(0.5);
                    const yesBtn = this.add
                        .text(cx - 80, cy + 40, "Yes", {
                            fontSize: `${32 * scaleRatio}px`,
                            color: "#00ff00",
                            backgroundColor: "#222",
                            padding: { left: 20, right: 20, top: 10, bottom: 10 },
                        })
                        .setOrigin(0.5)
                        .setInteractive({ useHandCursor: true });
                    const noBtn = this.add
                        .text(cx + 80, cy + 40, "No", {
                            fontSize: `${32 * scaleRatio}px`,
                            color: "#ff0000",
                            backgroundColor: "#222",
                            padding: { left: 20, right: 20, top: 10, bottom: 10 },
                        })
                        .setOrigin(0.5)
                        .setInteractive({ useHandCursor: true });

                    yesBtn.on("pointerdown", () => {
                        confirmBg.destroy();
                        confirmText.destroy();
                        yesBtn.destroy();
                        noBtn.destroy();
                        this.scene.start("Round2");
                    });
                    noBtn.on("pointerdown", () => {
                        confirmBg.destroy();
                        confirmText.destroy();
                        yesBtn.destroy();
                        noBtn.destroy();
                    });
                } else {
                    const warning = this.add
                        .text(this.player.x, this.player.y - 100 * scaleRatio, "⚠️ Solve the terminal first!", {
                            fontSize: `${20 * scaleRatio}px`,
                            color: "#ff0000",
                            backgroundColor: "#000000aa",
                        })
                        .setOrigin(0.5);
                    this.time.delayedCall(1500, () => warning.destroy());
                }
            },
            undefined,
            this
        );

        // --- Animations ---
        this.anims.create({
            key: "walk",
            frames: [{ key: "walk1" }, { key: "walk2" }, { key: "still1" }],
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({ key: "idle", frames: [{ key: "still1" }], frameRate: 1 });
        this.anims.create({
            key: "jump",
            frames: [{ key: "jump1" }, { key: "jump2" }, { key: "jump3" }],
            frameRate: 6,
            repeat: 0,
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (!this.player || !this.cursors) return;
        const onGround = this.player.body.blocked.down || this.player.body.touching.down;
        const moveSpeed = 300;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-moveSpeed);
            this.player.setFlipX(false);
            if (onGround) this.player.play("walk", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(moveSpeed);
            this.player.setFlipX(true);
            if (onGround) this.player.play("walk", true);
        } else {
            this.player.setVelocityX(0);
            if (onGround) this.player.play("idle", true);
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.player.setVelocityY(-500);
            this.player.play("jump", true);
        }

        if (!onGround && !this.player.anims.isPlaying) {
            this.player.setTexture("jump2");
        }
        if (onGround) this.canDoubleJump = true;
    }

    showCodePrompt(correctCode = "735", pythonSnippet = `
# Python puzzle example
def secret_code():
    return 7*100 + 3*10 + 5

print(secret_code())  # ??? what is the output?
`) {
        if (this.codeSolved) return;
        this.physics.pause();

        const width = this.scale.width;
        const height = this.scale.height;
        const overlayHeight = Math.min(height * 0.8, 500);
        const overlay = this.add.rectangle(width / 2, height / 2, 550, overlayHeight, 0x000000, 0.95);

        const codeBox = document.createElement("div");
        codeBox.style.position = "fixed";
        codeBox.style.left = `${width / 2 - 250}px`;
        codeBox.style.top = `${height / 2 - overlayHeight / 2 + 30}px`;
        codeBox.style.width = "500px";
        codeBox.style.height = `${overlayHeight - 180}px`;
        codeBox.style.overflowY = "auto";
        codeBox.style.background = "transparent";
        codeBox.style.color = "#00ff00";
        codeBox.style.fontFamily = "monospace";
        codeBox.style.fontSize = "18px";
        codeBox.style.whiteSpace = "pre-wrap";
        codeBox.style.zIndex = "1000";
        codeBox.textContent = pythonSnippet;
        document.body.appendChild(codeBox);

        this.promptOpen = true;
        const promptText = this.add
            .text(width / 2, height / 2 + overlayHeight / 2 - 100, `💻 Enter the answer below: (${this.chances} chances left)`, {
                fontSize: "20px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Type your answer here...";
        input.style.position = "fixed";
        input.style.left = `${width / 2 - 100}px`;
        input.style.top = `${height / 2 + overlayHeight / 2 - 70}px`;
        input.style.width = "200px";
        input.style.padding = "8px";
        input.style.fontSize = "16px";
        input.style.border = "2px solid #ff8800";
        input.style.borderRadius = "20px";
        input.style.zIndex = "1000";
        document.body.appendChild(input);
        input.focus();

        const keyListener = (e) => {
            if (e.key === "Enter") {
                const answer = input.value.trim().toLowerCase();
                if (answer === correctCode.toLowerCase()) {
                    input.removeEventListener("keydown", keyListener);
                    input.remove();
                    codeBox.remove();
                    overlay.destroy();
                    promptText.destroy();
                    this.codeSolved = true;
                    this.promptOpen = false;
                    this.physics.resume();
                    this.add.image(width / 2, height / 2 - overlayHeight / 2 - 200, "correctAnswer").setOrigin(0.5);
                } else {
                    this.chances = this.chances - 1;
                    if (this.chances > 0) {
                        promptText.setText(`❌ Wrong answer! ${this.chances} chance${this.chances === 1 ? "" : "s"} left.`);
                    } else {
                        input.removeEventListener("keydown", keyListener);
                        input.remove();
                        codeBox.remove();
                        overlay.destroy();
                        promptText.destroy();
                        this.physics.resume();
                        this.promptOpen = false;
                        this.scene.start("GameOver");
                    }
                }
            }
        };
        input.addEventListener("keydown", keyListener);
    }
}
