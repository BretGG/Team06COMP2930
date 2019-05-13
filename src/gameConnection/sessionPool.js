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
    this.sessions = [];

    setInterval(() => {
      console.log(isMainThread);
    }, 1000);

    parentPort.on("message", message => this.handleParentRequest(message));
  }

  registerSession(session) {
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

  handleParentRequest(request) {
    switch (request) {
      case "isFull":
        console.log("checking if full");
        parentPort.postMessage({ responseTo: "isFull", full: this.isFull() });
        break;
      case "addSession":
        console.log("adding session");
        break;
    }
  }

  // pool paramater will be merge its sessions into this pool and be handled by the
  // thread assigned to this pool
  mergePool(pool) {
    // TODO: handle some stuff for merging pools
  }

  isFull() {
    return this.currentSessionsCount >= this.poolLimit;
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
