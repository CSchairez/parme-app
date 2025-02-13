const express = require('express');
const router = express.Router();
const matches = require('./matches'); // Import shared matches array


module.exports = (io) => {
    router.post('/join-match', (req, res) => {
        const { matchCode, playerName } = req.body;
        const match = matches.find((match) => match.matchCode === matchCode);
        if (match) {
            if (match.players.find((player) => player.playerName === playerName)) {
                return res.status(400).json({ message: "This name is taken!" });
            }
            match.players.push({playerName, score: 0});

              // Emit an event to all players in this match room
            io.to(matchCode).emit("updateLobby", match);

            res.status(200).json({
                hostName: match.host.hostName,
                hostId: match.host.hostId,
                matchCode: matchCode,
                matchName: match.matchName,
                playerName: playerName,
                players: match.players,
                par: match.par,
                course: match.course,
                matchState: match.matchState,
                createdAt: match.createdAt,
                message: "Player Joined!",
            });
        } else {
            res.status(400).json({ message: "Match not found!" });
        }
        
    });
    return router;
};

/*
router.post("start-match", (req, res) => {
    const { matchCode, hostName } = req.body;

    if (match.host !== hostName) {
        return res.status(403).json({ message: "Only the host can start the game" });
      }
    
    const match = matches.find((match) => match.matchCode === matchCode);
    
    if (match) {

        match.matchState = "in-progress";
        res.json({ message: "Match started!", matchCode, matchState: match.matchState });
    } else {
        res.status(404).json({ message: "Match not found!" });
    }
});
*/
