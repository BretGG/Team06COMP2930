/*

gameSessions will handle the creating of game pools, game pools holds the objects for running games, each pool
will be working on a worker thread and each pool would be limited to a certain (yet to be determined) number of
games.

gameSession will also handle the connection of new user sorting them into the correct game to be registered for 
events.

A session is a running instance of a game

*/

const gamePools = [];
var runningSessions = 0;

function endSession(sessionId) {
  // TODO: remove session from correct pool
}

function addSession(sessionInfo) {
  // TODO: add session
}

function getSessions() {
  // TODO: return all running sessions
}

function mergePools() {
  // TODO: merge pools to avoid extra overhead
}

module.exports.addSession = addSession(sessionInfo);
module.exports.getSessions = getSessions();
