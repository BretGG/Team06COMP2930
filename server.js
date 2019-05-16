#!/usr/bin/env node

/**
* Module dependencies.
*/
var app = require("./app");
var debug = require("debug")("comp2930-team2:server");
var http = require("http");

var players = {};
//EcoQuest code
const numberOfPlayers = 4;
const Game1_XYCoordinates=[{x:110,y:225, isTaken:false},{x:310,y:225,isTaken:false},
  {x:510,y:225,isTaken:false},{x:710,y:225,isTaken:false}];


  //TODO: //////////////////////////////////
  //1. Implement limited number of max players ..
  //How to get the variable e.g. numberOfPlayers from game.js?
  //emit from game.js doesn't work...=> It can't come from the client side. use namespace instead.
  //2. Give the players different colors..
  //3. Is there way to get the initial spawn location coordinates from game.js?
  //4. Use namespace(multiple channel feature of socket.io) to implement different game
  /////////////////////////////////////////


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



  const self = this;

  //on the new user connection do the following
  io.on('connection',function(socket){
    //number of current sockets
    const numberOfCurrentPlayers = Object.keys(io.sockets.sockets).length;
    console.log('a user connected: '+ socket.id );
    let x,y;
    console.log("number of USER LISTS ", numberOfCurrentPlayers);
    if(numberOfCurrentPlayers<=numberOfPlayers){
      for(let i=0; i<Game1_XYCoordinates.length; i++){
        if(!Game1_XYCoordinates[i].isTaken){
          self.playerNo = i;
          console.log("room: " + this);
          players[socket.id] = {
            playerNo: self.playerNo,
            playerId: socket.id,
            x: Game1_XYCoordinates[i].x,
            y: Game1_XYCoordinates[i].y
          };
          Game1_XYCoordinates[i].isTaken=true;
          console.log("new player added");
          printPlayers(Game1_XYCoordinates);
          break;
        }
      }
    }else{
      console.log("The room is full");
      disconnectPlayer(socket.id);
      console.log("deleted attempted connect, current players: ", numberOfCurrentPlayers);
    }

    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all opponent players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);


    //user disconnect
    // when a player disconnects, remove them from our players object
    socket.on('disconnect', function () {
      disconnectPlayer(socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerMovement', function(movementData){
      if(players[socket.id]!=undefined){
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
      }
      // emit a message to all players about the player that moved
      socket.broadcast.emit('playerMoved', players[socket.id]);

    });
    //Kicks the user out when he's not doing anything for 1 min.
    setTimeout(() => disconnectPlayer(socket.id), 60000);
    ////
  });//io.on ends here

  function printPlayers(coordinates){
    for(let i=0;i<coordinates.length;i++){
      console.log(coordinates[i].isTaken);
    }
  }

  function disconnectPlayer(id){
    console.log('user ',id,' attempts to disconnect..');
    if(players[id]!=undefined){
      // console.log("disc: ", players[id].playerNo);
      Game1_XYCoordinates[players[id].playerNo].isTaken = false;
      delete players[id];
      io.emit('disconnect', id);
      console.log("after disconnect");
      printPlayers(Game1_XYCoordinates);
    }else{
      console.log('User not exist, deleted already or never created');
    }
  }
