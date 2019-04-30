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
    // returns session info for a success
    // returns null if not successful
  }
  getSession(sessionId) {
    // TODO: find and return the given session
    // if session is null on return, no session was found
  }
  removeSession(sessionId) {
    // TODO: remove session
  }
  mergePool() {
    // TODO: handle some stuff for merging pools
  }
}
