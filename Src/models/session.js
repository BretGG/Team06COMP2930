/*

session is the base class for a game object that will handle game interactions with clients and
the game logic.

Each game type created will inheret from session.

Example session/game info object:

  {
    gameType: "ecoQuizlet",
    owner: "[playerId]",
    sessionId: "bobsGame", // Used for joining a running game
    sessionPass: "password", // Can be stored in plane text
    players: "[owener, ...]" // only required 
  }

  This object will be passed from the client to start a new 

*/

class Session {
  constructor(sessionInfo) {
    // TODO: add session limits

    this.sessionId = sessionInfo.sessionId;
    this.gameType = sessionInfo.gameType;
    this.owner = sessionInfo.owner;
    this.sessionPass = sessionInfo.sessionPass;
    this.players = [];
    this.players.push(sessionInfo.owner); // Adding the owner to the list of players
  }

  killSession() {
    // TODO: kill the session... nicely
    // i.e send all connected people a game state change to terminated
  }

  // Returns an object { added: true, reason: null }
  // failed to connect player { added: false, reason: InvalidPass }
  connectPlayer(playerId, sessionPass) {
    // TODO: Check session limit
    if (sessionPass === this.sessionPass) {
      players.push(playerId);
      return { added: true, reason: null };
    } else {
      return { added: false, reason: "InvalidPass" };
    }

    // TODO: subscribe user to all the connectors in the world
  }

  updateSession() {
    // TODO: handle some state changes in the game (finished, paused, error)
  }

  // A bunch of soket stuff to handle all the fun game stuff
}

module.exports = Session;
