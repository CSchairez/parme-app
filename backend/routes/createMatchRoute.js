const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const matches = require('./matches'); // Import shared matches array

const generateUniqueCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

router.post('/create-match', (req, res) => {
    console.log("Entering try in create-match");
    try {
        console.log("Trying create-match");
        const { matchName, hostName, course, par } = req.body;
        if (!matchName) {
            return res.status(400).json({ message: "Match name is required!" });
        }

        // Generate a unique matchCode
        let matchCode;
        do {
            matchCode = generateUniqueCode();
        } while (matches.some(match => match.matchCode === matchCode));

        // Generate a unique hostId
        let hostId;
        do {
            hostId = generateUniqueCode();
        } while (matches.some(match => match.host.hostId === hostId));

        let playerName = hostName;

        const newMatch = {
            host: { hostName, hostId },
            matchCode,
            matchName,
            par,
            course,
            players: [{ playerName: hostName}],
            matchState: "waiting for players to join...", // Initial state 
            createdAt: new Date().toISOString()
        };

        matches.push(newMatch);
        
        res.status(201).json({ 
            hostName: newMatch.host.hostName,
            playerName: playerName,
            hostId: newMatch.host.hostId,
            matchCode: newMatch.matchCode,
            matchName: newMatch.matchName,
            players: newMatch.players,
            par: newMatch.par,
            course: newMatch.course,
            matchState: newMatch.matchState,
            createdAt: newMatch.createdAt,
            message: "Match created!", 
            });
    } catch (error) {
        console.error("Error creating match:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

module.exports = router;