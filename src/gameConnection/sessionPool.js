const { isMainThread, parentPort, workerData } = require("worker_threads");
/*

gamePool holds running game instances added to this pool, including additional information on each pool.

Also handles finished games, errors, and disconnects.

Each GamePool will work on its own worker thread

*/

class SessionPool {
  constructor(poolLimit, poolId) {
    this.poolId = poolId;
    this.poolLimit = poolLimit;
    this.currentSessionsCount = 0;
    this.full = false;
    this.sessions = [];

    // setInterval(() => {
    //   console.log(isMainThread);
    // }, 1000);

    parentPort.on("message", message => this.handleParentRequest(message));
    console.log("New pool: " + this.poolId);
  }

  // Add a new session to this pool;
  registerSession(sessionInfo) {
    if (this.sessions.length === this.poolLimit) return null;
    else {
      // TODO: add session to pool
      this.sessions.push(session);
      this.currentSessionsCount++;
    }

    // returns session info for a success
    // returns null if not successful
    return session;
  }

  // Returns object explained @Session.registerPlayer()
  registerPlayer(sessionId, sessionPass, PlayerId) {
    for (var session of this.sessions) {
      if (sessionId === session.sessionId)
        return session.registerPlayer(PlayerId, sessionPass);
    }

    return { added: false, reason: "NoSessionId" };
  }

  // Return the info for a session running in this pool
  getSession(sessionId) {
    for (var session of this.sessions)
      if (session.sessionId === sessionId) return session;

    // If session is null on return, no session was found
    return null;
  }

  removeSession(sessionId) {
    let removed = false;

    for (var session of this.sessions)
      if (session.sessionId === sessionId) {
        removed = true;

        // This may not work, needs testing
        session = null;
      }

    return removed;
  }

  // Handle messages sent from the main thread, posting
  // appropriate responses
  handleParentRequest(message) {
    console.log("parent req: " + message);
    switch (message.request) {
      case "isFull":
        parentPort.postMessage({
          responseTo: "isFull",
          threadId: this,
          full: this.isFull()
        });
        break;
      case "addSession":
        console.log("adding session");
        break;
      case "poolInfo":
        parentPort.postMessage({
          responseTo: "poolInfo",
          ...this.returnPoolInfo()
        });
        break;
    }
  }

  // pool paramater will be merge its sessions into this pool and be handled by the
  // thread assigned to this pool
  mergePool(pool) {
    // TODO: handle some stuff for merging pools
  }

  isFull() {
    // Checks to see if the pool is at its limits
    return (this.full = this.currentSessionsCount >= this.poolLimit).full;
  }

  returnPoolInfo() {
    // Add additional pool information here
    return { isFull: this.isFull(), pool: this };
  }

  getPoolStrain() {
    // TODO: return the strain on the current pool thread
    // Maybe make this for fun
    // Calculate how much strain this pool is under (i.e. how many requests are coming in)
  }
}

// This chunk of code allows us to create sessionPool objects on a worker thread
// without creating a new file for creating sessionPools, due to worker threads
// requiring a script
if (!isMainThread) {
  parentPort.postMessage(
    new SessionPool(workerData.poolLimit, workerData.poolId)
  );
}

module.exports = SessionPool;
