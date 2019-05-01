const express = require("express");
const router = express.Router();
const path = require("path");

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
  debug("Creating game thing");

  // TODO: Create game session
});

module.exports = router;
