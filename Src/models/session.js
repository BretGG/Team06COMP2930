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

class session {
  constructor(sessionInfo) {
    this.sessionId = sessionInfo.sessionId;
    this.gameType = sessionInfo.gameType;
    this.owner = sessionInfo.owner;
    this.sessionPass = sessionInfo.sessionPass;
    this.players = [];
    this.players.push(sessionInfo.owner);
  }

  killSession() {
    // TODO: kill the session... nicely
  }
}
