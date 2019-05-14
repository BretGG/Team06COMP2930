const debug = require("debug")("comp2930-team2:server");
const path = require("path");
const _ = require("lodash");
const { isFull, registerSession } = require("./sessionPool");
const { Worker, parentPort } = require("worker_threads");

/*

gameSessions will handle the creating of game pools, game pools holds the objects for running games, each pool
will be working on a worker thread and each pool would be limited to a certain (yet to be determined) number of
games.

gameSession will also handle the connection of new user sorting them into the correct game to be registered for 
events.

A session is a running instance of a game

*/

// Pools running on worker threads
const poolWorkers = new Map();

// Total sessions running across all pools
const sessions = new Map();

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
createPool(0, 5, 5);

// Adds a session to the first free spot in a pool
function addSession(sessionInfo) {
  debug("Registering new game session: " + JSON.stringify(sessionInfo));

  //   updatePoolInfo().then(() => {
  //     for (let pool in poolWorkers) {
  //       // Add session to first open pool
  //       pool.isFull;
  //     }
  //     debug(`Adding new session: ${session.sessionId} to pool: ${pool.poolId}`);
  //     pool.registerSession(session);
  //     runningSessions++;
  //     return session;
  //   });

  // No acceptable pool found, create a new pool with a worker to run it
  // Setting pool limit to 5 for testing, setting id to the current number of running sessions
}

// Create a new worker/pool and git it the new session info
function createPool(poolId, poolLimit, sessionInfo) {
  debug(
    `Creating new session pool, id: ${runningSessions} session limit: ${5}`
  );

  // Creation of new worker and session pool using sessionCreator
  let worker = new Worker(path.join(__dirname, "/SessionPool.js"), {
    workerData: {
      poolId: runningPools,
      poolLimit: 5
    }
  });

  runningPools++;
  runningSessions++;

  worker.on("error", err => {
    // TODO: handle a failed pool creation
    debug(`Failed to create new session pool, error: ${err}`);
    return;
  });

  // Add worker to master list, number of workers == number of pools
  poolWorkers.set(worker.threadId, worker);

  updatePoolInfo();
}

// Returns object with data on current sessions
function getSessions() {
  return {
    count: runningSessions,
    sessions: sessions
  };
}

// Updates pool info in local variables, why not just reference the objects?
// because... Tough times
function updatePoolInfo() {
  return new Promise(function(resolve, reject) {
    for (let worker of poolWorkers.values()) {
      console.log("Updating pool info");
      worker.on("message", message => {
        console.log("new info: " + JSON.stringify(message));
        resolve();
      });
      worker.postMessage({ request: "poolInfo" });
    }
  });
}

// Merge pools is a manual call to compress pools
function mergePools() {
  // TODO: merge pools to avoid extra overhead
}

module.exports.addSession = addSession;
module.exports.getSessions = getSessions;
