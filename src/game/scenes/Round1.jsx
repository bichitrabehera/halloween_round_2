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
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.canDoubleJump = true; // Double jump tracker
        this.codeSolved = false;    // Terminal code status

        // Background
        const bg = this.add.image(width / 2, height / 2, "sky1");
        bg.setDisplaySize(width, height);

        // Platforms
        this.platforms = this.physics.add.staticGroup();
        const p = (x, y, key, flip = false, scale = 1, alpha = 1) => {
            const obj = this.platforms.create(x, y, key);
            obj.setScale(scale).refreshBody();
            obj.setFlipX(flip);
            obj.setAlpha(alpha);
            return obj;
        };

        // Bottom platforms (ground) - wider spacing
        p(200, 870, "1");            // left ground
        p(960, 870, "8");             // center ground (slightly higher for jump)
        p(1770, 1000, "1", true);      // right ground

        // Mid-level platforms - staggered & tricky jumps
        p(350, 750, "71");            // left mid
        p(620, 700, "72");            // slightly higher mid-left
        p(960, 650, "61");            // center mid
        p(1300, 700, "72", true);     // mid-right inner
        p(1670, 750, "71", true);     // right mid

        // Upper-level platforms - narrow & spaced
        p(500, 500, "4");             // left upper
        p(800, 450, "62");             // mid-left upper
        p(1120, 450, "63");            // mid-right upper
        p(1450, 500, "4", true);       // right upper

        // Top platforms - precision jumps
        p(650, 300, "3");             // left top
        p(1270, 300, "3", true);      // right top
        p(960, 250, "8");             // center top (requires combo jump/double jump)

        // Invisible / code platforms
        p(360, 1050, "L", false, 1, 0);
        p(720, 1030, "M", false, 1, 0);
        p(960, 1050, "N", false, 1, 0);
        p(1200, 1030, "O", false, 1, 0);
        p(1560, 1050, "P", false, 1, 0);

        // Side walls & ceiling boundaries
        p(30, 540, "l-2", false, 1, 0);
        p(1890, 540, "r-2", false, 1, 0);
        p(960, 70, "t-2", false, 1, 0);

        // Terminal platform (player can stand on to reach terminal)
        p(200, 350, "1");  // small platform directly below terminal

        // Exit platform (player can land safely before exit)
        p(1750, 350, "1");  // small platform directly below exit

        // Optional: repeat platforms for smoother navigation
        p(950, 900, "8");   // intermediate ground
        p(1200, 900, "8");  // intermediate ground right



        // Player
        this.player = this.physics.add.sprite(300, 800, "still1").setScale(0.15);
        this.player.setBounce(0.05);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1200);
        this.physics.add.collider(this.player, this.platforms);

        // Invisible floor at bottom
        this.floor = this.physics.add.staticGroup();
        this.floor.create(width / 2, height + 30, null)
            .setVisible(false)
            .setSize(width, 60)
            .refreshBody();
        this.physics.add.collider(this.player, this.floor);

        // Camera & world bounds
        this.cameras.main.setBounds(0, 0, width, height);
        this.physics.world.setBounds(0, 0, width, height);

        // Terminal / checkpoint
        // place the terminal just above the small platform at x=200 (platform y=350) so player standing
        // on the platform is within the interaction range.
        this.terminal = this.physics.add.staticImage(200, 300, "terminal").setScale(0.1); // replace arrow with terminal image

        // original (unscaled) texture bounds which may be very large.
        if (this.terminal.body) {
            try {
                this.terminal.body.setSize(this.terminal.displayWidth, this.terminal.displayHeight);
                this.terminal.body.setOffset(-this.terminal.displayWidth * 0.5, -this.terminal.displayHeight * 0.5);
            } catch {
                // Some Phaser builds expose different body APIs; if setSize/setOffset fail, fall back to a distance check below.
            }
        }
        const interactionWidth = 80;
        const interactionHeight = 120;
        const interactionX = 200; // same x as terminal/platform
        const interactionY = 330; // slightly above the platform (platform y = 350)

        const interactionZone = this.add.zone(interactionX, interactionY, interactionWidth, interactionHeight).setOrigin(0.5);
        this.physics.add.existing(interactionZone, true); // make it a static physics body

        // opening the prompt multiple times.
        this.promptOpen = false;
        this.physics.add.overlap(this.player, interactionZone, () => {
            if (!this.promptOpen && !this.codeSolved) {
                this.showCodePrompt();
            }
        }, undefined, this);

        // Exit
        this.exitArrow = this.physics.add.staticImage(1750, 300, "arrow").setScale(0.9);
        this.physics.add.overlap(this.player, this.exitArrow, () => {
            if (this.codeSolved) {
                // Show confirmation dialog before moving to Round2
                const confirmBg = this.add.rectangle(window.innerWidth / 2, window.innerHeight / 2, 400, 180, 0x000000, 0.85).setOrigin(0.5);
                const confirmText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 30, "Proceed to Round 2?", {
                    fontSize: "28px",
                    color: "#fff",
                    align: "center"
                }).setOrigin(0.5);
                const yesBtn = this.add.text(window.innerWidth / 2 - 80, window.innerHeight / 2 + 40, "Yes", {
                    fontSize: "32px",
                    color: "#00ff00",
                    backgroundColor: "#222",
                    padding: { left: 20, right: 20, top: 10, bottom: 10 }
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });
                const noBtn = this.add.text(window.innerWidth / 2 + 80, window.innerHeight / 2 + 40, "No", {
                    fontSize: "32px",
                    color: "#ff0000",
                    backgroundColor: "#222",
                    padding: { left: 20, right: 20, top: 10, bottom: 10 }
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });

                yesBtn.on("pointerdown", () => {
                    confirmBg.destroy(); confirmText.destroy(); yesBtn.destroy(); noBtn.destroy();
                    this.scene.start("Round2");
                });
                noBtn.on("pointerdown", () => {
                    confirmBg.destroy(); confirmText.destroy(); yesBtn.destroy(); noBtn.destroy();
                });
            } else {
                const warning = this.add.text(this.player.x, this.player.y - 100, "⚠️ Solve the terminal first!", {
                    fontSize: "20px",
                    color: "#ff0000",
                    backgroundColor: "#000000aa",
                }).setOrigin(0.5);
                this.time.delayedCall(1500, () => warning.destroy());
            }
        }, undefined, this);

        // Animations
        this.anims.create({
            key: "walk",
            frames: [{ key: "walk1" }, { key: "walk2" }, { key: "still1" }],
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({ key: "idle", frames: [{ key: "still1" }], frameRate: 1 });
        this.anims.create({
            key: "jump",
            frames: [{ key: "jump1" }, { key: "jump2" }, { key: "jump3" }],
            frameRate: 6,
            repeat: 0
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (!this.player || !this.cursors) return;

        const onGround = this.player.body.blocked.down || this.player.body.touching.down;
        const moveSpeed = 300;

        // Horizontal movement
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

        // Double jump
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.player.setVelocityY(-500); // jump velocity
            this.player.play("jump", true);
        }

        if (!onGround && !this.player.anims.isPlaying) {
            this.player.setTexture("jump2");
        }

        if (onGround) {
            this.canDoubleJump = true;
        }
    }

    showCodePrompt(
        correctCode = "735",
        pythonSnippet = `
# Python puzzle example
def secret_code():
    return 7*100 + 3*10 + 5


print(secret_code())  # ??? what is the output?
`
    ) {
        if (this.codeSolved) return;

        this.physics.pause();
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Calculate height dynamically based on text length
        const estimatedLines = pythonSnippet.split("\n").length;
        const textHeight = estimatedLines * 22; // rough estimate per line
        const overlayHeight = Math.min(textHeight + 250, height * 0.9); // cap at 90% of screen

        // Overlay background (auto-height)
        const overlay = this.add.rectangle(width / 2, height / 2, 550, overlayHeight, 0x000000, 0.95);

        // Create a DOM container for scrollable code text
        const codeBox = document.createElement("div");
        codeBox.style.position = "fixed";
        codeBox.style.left = `${width / 2 - 250}px`;
        codeBox.style.top = `${height / 2 - overlayHeight / 2 + 30}px`;
        codeBox.style.width = "500px";
        codeBox.style.height = `${overlayHeight - 180}px`; // leave space for prompt & input
        codeBox.style.overflowY = "auto";
        codeBox.style.background = "transparent";
        codeBox.style.color = "#00ff00";
        codeBox.style.fontFamily = "monospace";
        codeBox.style.fontSize = "18px";
        codeBox.style.whiteSpace = "pre-wrap";
        codeBox.style.zIndex = "1000";
        codeBox.textContent = pythonSnippet;
        document.body.appendChild(codeBox);

        // Prompt text
        const promptText = this.add.text(width / 2, height / 2 + overlayHeight / 2 - 100, "💻 Enter the answer below:", {
            fontSize: "20px",
            color: "#ffffff",
        }).setOrigin(0.5);

        // Input box
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
                    this.physics.resume();

                    this.add.image(width / 2, height / 2 - overlayHeight / 2 - 200, "correctAnswer").setOrigin(0.5);
                    // this.add.text(width / 2, height / 2 - overlayHeight / 2 - 40, "✅ Correct! Now go to the exit.", {
                    //     fontSize: "26px",
                    //     fontWeight: "bold",
                    //     color: "#00ff00",
                    //     textAlign: "center",
                    //     wordWrap: { width: 400, useAdvancedWrap: true }
                    // }).setOrigin(0.5);
                } else {
                    promptText.setText("❌ Wrong answer! Try again...");
                }
            }
        };
        input.addEventListener("keydown", keyListener);
    }


}
