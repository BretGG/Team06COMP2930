/*

gamePool holds running game instances added to this pool, including additional information on each pool.

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
    if (this.sessions.length === this.poolLimit) return null;
    else {

      // TODO: add session to pool
    }

    // returns session info for a success
    // returns null if not successful
    return sessionInfo;
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

  // pool paramater will be merge its sessions into this pool and be handled by the
  // thread assigned to this pool
  mergePool(pool) {
    // TODO: handle some stuff for merging pools
  }

  isFull() {
    return currentSessions
  }

  getPoolStrain(){
    // TODO: return the strain on the current pool thread

    // Maybe make this for fun

    // Calculate how much strain this pool is under (i.e. how many requests are coming in)
  }

}
