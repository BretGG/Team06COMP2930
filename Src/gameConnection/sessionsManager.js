const debug = require("debug")("comp2930-team2:server");
const _ = require("lodash");
const Session = require("../models/session");
const SessionPool = require("./sessionPool");

/*

gameSessions will handle the creating of game pools, game pools holds the objects for running games, each pool
will be working on a worker thread and each pool would be limited to a certain (yet to be determined) number of
games.

gameSession will also handle the connection of new user sorting them into the correct game to be registered for 
events.

A session is a running instance of a game

*/

const gamePools = new Map();
let runningSessions = 0;
let runningPools = 0;

function endSession(sessionId) {
  // TODO: remove session from correct pool
}

function addSession(session) {
  debug("Registering new game session: " + JSON.stringify(session));

  // Cancel if the object type is wrong
  if (!(session instanceof Session)) {
    debug("Invalid session object");
    return;
  }

  for (var pool of gamePools) {
    // Adds to the first pool with space, should add some better load balancing
    if (!pool.isFull()) {
      debug(`Adding new session: ${session.sessionId} to pool: ${pool.poolId}`);
      pool.registerSession(session);
      runningSessions++;
      return session;
    }
  }

  // No acceptable pool found, create a new one
  // Setting pool limit to 5 for testing, setting id to the current number of running sessions
  debug(
    `Creating new session pool, id: ${runningSessions} session limit: ${5}`
  );
  const newPool = new SessionPool(5, runningPools);
  gamePools.push(newPool);
  runningPools++;

  // Adding session to new pool;
  debug(`Adding new session: ${session.sessionId} to pool: ${newPool.poolId}`);
  newPool.registerSession(session);
  runningSessions++;
  return session;
}

function getSessions() {
  // TODO: return all running sessions
}

function mergePools() {
  // TODO: merge pools to avoid extra overhead
}

module.exports.addSession = addSession;
module.exports.getSessions = getSessions;
