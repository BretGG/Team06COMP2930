const express = require("express");
const router = express.Router();
const path = require("path");
const debug = require("debug")("comp2930-team2:server");
const _ = require("lodash");
const {
  addSession,
  getSession
} = require("../src/gameConnection/sessionsManager");

/* Example session/game object:

  {
    gameType: "ecoQuizlet",
    owner: "[playerId]",
    sessionId: "bobsGame", // Used for joining a running game
    sessionPass: "password" // Can be stored in plane text
  }

*/

let lobbies = new Map();

/* GET game home page. */
// Probably  remove this because the game files will be served based on the post (create game)
// and put (join game)
router.get("/", (req, res) => {
  res.render(path.resolve(__dirname, "../game/public/index.html"), {
    title: "Express"
  });
});

/* POST to create new game session */
router.post("/", (req, res) => {
  const lobby = _.pick(req.body, [
    "gameType",
    "owner",
    "sessionId",
    "sessionPass"
  ]);

  // Check if session id is taken
  if (lobbies.get(lobby.sessionId)) {
    res.status(400).send("GameId taken");
  }

  // Create the players array and add the owner to that array
  lobby.players = [];
  lobby.players.push(lobby.owner);
  lobbies.set(gameSessionInfo.sessionId, gameSessionInfo);

  res.send(gameSessionInfo);
});

// Join a lobby
router.put("/", (req, res) => {
  const lobbyInfo = _.pick(req.body);
});

module.exports = router;
