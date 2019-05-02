const debug = require("debug")("comp2930-team2:server");
const _ = require("lodash");

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
  debug("Registering new game session: " + JSON.stringify(sessionInfo));

  for (var pool in gamePools) {
    // Adds to the first pool with space, should add some better load balancing
    if (pool.is) {
      return;
    }

    // No acceptable pool found, create a new one
  }
}

function getSessions() {
  // TODO: return all running sessions
}

function mergePools() {
  // TODO: merge pools to avoid extra overhead
}

module.exports.addSession = addSession;
module.exports.getSessions = getSessions;
