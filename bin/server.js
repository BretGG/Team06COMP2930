#!/usr/bin/env node

/**
 * Module dependencies.
 */
var application = require("../app");


// var express = express();
var debug = require("debug")("comp2930-team2:server");
var http = require("http");


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
application.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.Server(application);
var io = require('socket.io').listen(server);


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
server.lastPlayderID = 0;

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

//added
io.on('connection',function(socket){
  console.log("hello inside connection");
    socket.on('newplayer',function(){
        socket.player = {
            id: server.lastPlayderID++,
            x: getRandomInt(100,400),
            y: getRandomInt(100,400)
        };
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);

        socket.on('click',function(data){
          console.log(JSON.stringify(data));

            console.log('click to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;

            io.emit('move',socket.player);
        });

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });
    socket.on('test',function(){
      console.log('test received');
  });
});
function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
