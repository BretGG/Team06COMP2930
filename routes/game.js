const express = require("express");
const router = express.Router();
const path = require("path");
const debug = require("debug")("comp2930-team2:server");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { User } = require("../src/models/user");
const http = require("http");

const gameServer = http.createServer().listen(3001, function() {
  console.log("Game server is listening on port 3001");
});

const io = require("socket.io")(gameServer);
/* Example session/game object:

  {
    gameType: "ecoQuizlet",
    owner: "[playerId]",
    sessionId: "bobsGame", // Used for joining a running game
    sessionPass: "password" // Can be stored in plane text
  }

*/

// Create new connection and register the user
io.on("connection", socket => {
  console.log("New game connection");
  // Should have better error checking here
  socket.on("register", async playerInfo => {
    const decode = jwt.verify(playerInfo, "FiveAlive");
    token = jwt.decode(playerInfo);
    console.log(playerInfo);
    const user = await User.findById(token._id).select("-password");
    let lobbyHolder;
    for (let lobby of [...lobbies.values()]) {
      for (let player of lobby.players) {
        if (JSON.stringify(player.playerId) == JSON.stringify(user._id)) {
          lobbyHolder = lobby;
        }
      }
    }
    if (!lobbyHolder) {
      socket.emit("noavailablelobby");
      socket.disconnect();
    } else {
      players.set(socket.id, { user: user, lobby: lobbyHolder });
      socket.join(lobbyHolder.sessionId);
      socket.emit("registered", user);
    }
  });
});

let lobbies = new Map();

// key: socket.id, value: player.id
// easy way to retrieve the player
let players = new Map();

// -------------------------------------------------- Routing -----------------------------------------------------

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
  console.log("request for lobby info");

  var token = req.get("auth-token");
  if (!token) return res.status(400).send("Uh Oh! You dont have a token!");
  const decode = jwt.verify(token, "FiveAlive");
  token = jwt.decode(token);

  const user = await User.findById(token._id).select("-password");
  if (!user) return res.status(400).send("Uh Oh! You dont exist!");

  for (let lobby of [...lobbies.values()]) {
    for (let player of lobby.players) {
      if (JSON.stringify(player.playerId) == JSON.stringify(user._id)) {
        return res.send(lobby);
      }
    }
  }

  res.status(404).send("No lobby found");
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
