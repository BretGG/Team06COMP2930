#!/usr/bin/env node

/**
* Module dependencies.
*/
var app = require("../app");
var debug = require("debug")("comp2930-team2:server");
var http = require("http");

var players = {};

/**
* Get port from environment and store in Express.
*/

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
* Create HTTP server.
*/

var server = http.Server(app);
var io = require('socket.io').listen(server);


/**
* Listen on provided port, on all network interfaces.
*/

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
* Normalize a port into a number, string, or false.
*/

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
    console.error(bind + " requires elevated privileges");
    process.exit(1);
    break;
    case "EADDRINUSE":
    console.error(bind + " is already in use");
    process.exit(1);
    break;
    default:
    throw error;
  }
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}


//on the new user connection do the following
io.on('connection',function(socket){
  console.log("hello inside connection");
  console.log('a user connected: ', socket.id);
  //Make new player by new connection on random x,y coordinates. 
  players[socket.id] = {
    playerId: socket.id,
    x: getRandomInt(100,400),
    y: getRandomInt(100,400)
  };
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);


  //user disconnect
  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });

  // when a player moves, update the player data
  socket.on('playerMovement', function(movementData){
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    // emit a message to all players about the player that moved
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

});
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
