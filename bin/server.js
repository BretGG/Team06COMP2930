#!/usr/bin/env node

/**
* Module dependencies.
*/
var app = require("../app");
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


  //on the new user connection do the following


  io.on('connection',function(socket){
    console.log('a user connected: '+ socket.id );
    let x,y,playerNo;

    if(isRoomFull()!= -1){
      switch (isRoomFull()) {
        case 0:
        x=Game1_XYCoordinates[0].x;
        y=Game1_XYCoordinates[0].y;
        playerNo = 0;
        Game1_XYCoordinates[0].isTaken=true;
        break;
        case 1:
        x=Game1_XYCoordinates[1].x;
        y=Game1_XYCoordinates[1].y;
        playerNo = 1;
        Game1_XYCoordinates[1].isTaken=true;
        break;
        case 2:
        x=Game1_XYCoordinates[2].x;
        y=Game1_XYCoordinates[2].y;
        playerNo = 2;
        Game1_XYCoordinates[2].isTaken=true;
        break;
        case 3:
        x=Game1_XYCoordinates[3].x;
        y=Game1_XYCoordinates[3].y;
        playerNo = 3;
        Game1_XYCoordinates[3].isTaken=true;
        break;
        default://when adding first player
        x=Game1_XYCoordinates[0].x;
        y=Game1_XYCoordinates[0].y;
        playerNo = 0;
        Game1_XYCoordinates[0].isTaken=true;
      }
      players[socket.id] = {
        playerNo: playerNo,
        playerId: socket.id,
        // player spawn location x,y
        // x: 110 + (increaseX * (times++)),
        x: x,
        y: y
      };

      console.log("new player added");
      printPlayers(Game1_XYCoordinates);



    }else{
      console.log("The room is full");
      delete players[socket.id];

    }

    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);


    //user disconnect
    // when a player disconnects, remove them from our players object
    socket.on('disconnect', function () {
      console.log('user disconnected: ', socket.id);
      if(Game1_XYCoordinates[playerNo]!=undefined){
        Game1_XYCoordinates[playerNo].isTaken = false;
        console.log("set ISTAKEN to false");
        delete players[socket.id];
        io.emit('disconnect', socket.id);

        console.log("after disconnect");
        printPlayers(Game1_XYCoordinates);
      }else{
        console.log('disconnected user undefined');
      }
      // emit a message to all players to remove this player
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
  });
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  function isRoomFull(){
    for(let i=0; i<Game1_XYCoordinates.length; i++){
      if(!Game1_XYCoordinates[i].isTaken){
        return i; //false
      }
    }
    return -1; //true
  }

  function printPlayers(coordinates){
    for(let i=0;i<coordinates.length;i++){
      console.log(coordinates[i].isTaken);
    }
  }
