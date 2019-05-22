const express = require("express");
const router = express.Router();
const path = require("path");
const debug = require("debug")("comp2930-team2:server");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { User } = require("../src/models/user");
const app = require("../app");
const io = require("socket.io")(app);

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

// Sends the information on the lobby that the given user is registered in
router.get("/lobbyinfo", async (req, res) => {
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  for (let holder of [...lobbies.values()]) {
    let lobby = holder.players.find(playerHolder => {
      playerHolder.playerId === user._id;
    });
    if (lobby) {
      return res.send(lobby);
    }
  }
});

router.get("/lobby", (req, res) => {
  res.render(path.resolve(__dirname, "../public/views/gameLobby.html"));
});

/* POST to create new game session */
router.post("/", async (req, res) => {
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  const lobby = _.pick(req.body, ["gameType", "sessionId", "sessionPass"]);

  // Check if session id is taken
  if (lobbies.get(lobby.sessionId)) return res.status(400).send("GameId taken");

  // Create the players array and add the owner to that array
  lobby.owner = user._id;
  lobby.players = [];
  lobby.players.push({ playerId: lobby.owner, username: user.username });
  lobbies.set(lobby.sessionId, lobby);

  console.log("Creating a new session: " + lobby);

  // Create socket namespace
  let socket = io.of("/" + lobby.sessionId);
  socket.on("connection", socket => {
    console.log("new user");
  });

  res.send(lobby);
});

// Join a lobby
router.put("/", async (req, res) => {
  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  const lobbyInfo = _.pick(req.body, ["sessionId", "sessionPass"]);
  const lobby = lobbies.get(lobbyInfo.sessionId);

  // Didn't find a lobby
  if (!lobby)
    return res
      .status(404)
      .send("Failed to find room at: " + lobbyInfo.sessionId);

  // Invalid password
  if (lobby.sessionPass !== lobbyInfo.sessionPass)
    return res.status(400).send("Invalid session password");

  // Add user to the lobby and return lobby info
  lobby.players.push({ playerId: user._id, username: user.username });
  res.send(lobby);
});

module.exports = router;
