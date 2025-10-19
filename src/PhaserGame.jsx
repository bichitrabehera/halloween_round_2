import React, { useEffect } from "react";
import { initPhaserGame, destroyPhaserGame } from "./game";

const PhaserGame = () => {
    useEffect(() => {
        const game = initPhaserGame();
        return () => destroyPhaserGame();
    }, []);

    return <div id="phaser-container" />;
};

export default PhaserGame;
