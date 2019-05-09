const debug = require("debug")("comp2930-team2:server");
const path = require("path");
const _ = require("lodash");
const Session = require("../models/session");
const SessionPool = require("./sessionPool");
const { Worker, parentPort } = require("worker_threads");

/*

gameSessions will handle the creating of game pools, game pools holds the objects for running games, each pool
will be working on a worker thread and each pool would be limited to a certain (yet to be determined) number of
games.

gameSession will also handle the connection of new user sorting them into the correct game to be registered for 
events.

A session is a running instance of a game

*/

const sessionPools = new Map();
const poolWorkers = new Map();
let runningSessions = 0;

// The runningPools count will be the same value as the runningWorkers
let runningPools = 0;

// Remove a session from the correct pool based on the pool ID
function endSession(sessionId) {
  for (let pool of sessionPools) {
    debug(`Attempting to remove session: ${sessionId}`);
    let session = pool.removeSession(sessionId);
    if (session) {
      debug(`Removed session: ${session} from pool: ${pool.poolId}`);
    }
  }
}

// Adds a session to the first free spot in a pool
function addSession(session) {
  debug("Registering new game session: " + JSON.stringify(session));

  // Cancel if the object type is wrong
  if (!(session instanceof Session)) {
    debug("Invalid session object");
    return;
  }

  for (var pool of sessionPools.values()) {
    // Adds to the first pool with space, should add some better load balancing
    if (!pool.isFull()) {
      debug(`Adding new session: ${session.sessionId} to pool: ${pool.poolId}`);
      pool.registerSession(session);
      runningSessions++;
      return session;
    }
  }

  // No acceptable pool found, create a new pool with a worker to run it
  // Setting pool limit to 5 for testing, setting id to the current number of running sessions
  debug(
    `Creating new session pool, id: ${runningSessions} session limit: ${5}`
  );

  // Creation of new worker and session pool using sessionCreator
  let newWorker = new Worker(path.join(__dirname, "/sessionPoolCreator.js"), {
    session: session
  });

  newWorker.on("SessionPoolCreated", sessionPool => {
    // Once the worker creates the new session pool add it to the master list
    runningSessions.set(sessionPool.poolId, sessionPool);
    // Adding session to new pool;
    debug(
      `Adding new session: ${session.sessionId} to pool: ${newPool.poolId}`
    );

    newPool.registerSession(session);
    runningSessions++;
    return session;
  });

  newWorker.on("error", err => {
    debug(`Failed to create new session pool, error: ${err}`);
    return;
  });

  poolWorkers.set(runningPools, newWorker);
  runningPools++;
}

// Returns object with data on current sessions
function getSessions() {
  // TODO: return all running sessions
}

// Merge pools is a manual call to compress pools
function mergePools() {
  // TODO: merge pools to avoid extra overhead
}

module.exports.addSession = addSession;
module.exports.getSessions = getSessions;
