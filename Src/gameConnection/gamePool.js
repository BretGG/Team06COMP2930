/*

gamePool holds all the running game instances including additional information on each pool.

Also handles finished games, errors, and disconnects.

*/

class gamePool {
  constructor(poolLimit, poolId) {
    this.poolId = poolId;
    this.poolLimit = poolLimit;
    this.currentSessionsCount = 0;
    this.sessions = [];
  }

  addSession(sessionInfo) {
    if (this.currentSessionsCount === this.poolLimit) return null;
    else {
      // TODO: add session to pool
      this.currentSessionsCount = this.currentSessions++;
    }

    return sessionInfo;
    // returns session info for a success
    // returns null if not successful
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
            delete session;
        }

    return removed;
  }

  mergePool() {
    // TODO: handle some stuff for merging pools
  }
}
