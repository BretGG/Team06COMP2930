const debug = require("debug")("comp2930-team2:server");
const Session = require("../models/session.js");
const { workerData, parentPort } = require("worker_threads");

// Cancel if the object type is wrong
let session = new Session(workerData);
if (!(session instanceof Session)) {
  debug("Invalid session object");
  return;
}

parentPort.postMessage(session);
