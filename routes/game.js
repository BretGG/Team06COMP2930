const express = require("express");
const router = express.Router();
const path = require("path");
const debug = require("debug")("comp2930-team2:server");
const Session = require("../Src/models/session");
const _ = require("lodash");
const {
  addSession,
  getSession
} = require("../Src/gameConnection/sessionsManager");

/* Example session/game object:

  {
    gameType: "ecoQuizlet",
    owner: "[playerId]",
    sessionId: "bobsGame", // Used for joining a running game
    sessionPass: "password" // Can be stored in plane text
  }

*/

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
  debug("Request to make new game session");

  // TODO: Create game session
  const gameSessionInfo = _.pick(req.body, [
    "gameType",
    "owner",
    "sessionId",
    "sessionPass"
  ]);

  const gameSession = new Session(gameSessionInfo);

  // Passing off the game session object to the sessions manager
  addSession(gameSession);
});

module.exports = router;
