const express = require('express');
const router = express.Router();

const matches = require('./matches');

module.exports = (io) => {

    router.delete('/delete-player', (req, res) => {

        const { matchCode, playerName } = req.body;
        const match = matches.find((match) => match.matchCode === matchCode);

        if (!match) {
            return res.status(400).json({ message: "Match not found!" });
        }

        if (match.host.hostName === playerName) {
            matches.splice(match, 1);
            io.to(matchCode).emit("matchDeleted", { message: "Match has been closed by the host" });
            return res.status(200).json({ message: "Match deleted successfully!" });
        }
    
        // Find player index
        const playerIndex = match.players.findIndex(player => player.playerName === playerName);
    
        if (playerIndex === -1) {
            return res.status(400).json({ message: "Player not found in match!" });
        }
    
        // Remove player from the match
        match.players.splice(playerIndex, 1);
        io.to(matchCode).emit("updateLobby", match);

        res.status(200).json({
            matchCode,
            playerName,
            message: `${playerName} deleted from match!`
        });
    });
    return router;
};