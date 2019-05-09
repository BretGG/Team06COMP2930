#!/usr/bin/env node
var playerLimit = 4;
var currentNoOfPlayers = 0;
/**
 * Module dependencies.
 */
var app = require("../app");
var debug = require("debug")("comp2930-team2:server");
var http = require("http");

var players = {};
///Code below will be put into different channels in the future to implement another game
var count = 0;
// var increaseX = 200;
// var times = 0;
const numberOfPlayers = 4;
const Game1_XYCoordinates = [{
        x: 110,
        y: 225,
        isTaken: false
    }, {
        x: 310,
        y: 225,
        isTaken: false
    },
    {
        x: 510,
        y: 225,
        isTaken: false
    }, {
        x: 710,
        y: 225,
        isTaken: false
    }
];


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
/// /////////
/// A1
/// server is up and running
/// server is made here. 
/// //////

/// Connected A901



io.on('connection', function(socket) {
    console.log('a user connected: ' + socket.id);
    let x, y, playerNo;


    // console.log(Object.keys(io.sockets.sockets));
    //Make new player by new connection on random x,y coordinates.
    // if(count+1 <= numberOfPlayers){
        
    if (isRoomFull()!= -1){
        for (let i = 0; i < Game1_XYCoordinates.length; i++){
            if (!Game1_XYCoordinates[i].isTaken){
                Game1_XYCoordinates[i].isTaken = true; 
                playerNo = i;
              
              players[socket.id] = {
                    playerNo: i,
                    playerId: socket.id,
                    x:  Game1_XYCoordinates[i].x,
                    y:  Game1_XYCoordinates[i].y
                };
                console.log("new player added");
                //currentNoOfPlayers++;
                printPlayers(Game1_XYCoordinates);

                break;
            }
        }
    } 
    else {
        console.log("room is full");
        delete players[socket.id];
    }
    // send the players array object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    //user disconnect using socket.io function.
    socket.on('disconnect', function() {
        console.log('count : ' + playerNo + ' / user disconnected: ', socket.id);
        if (Game1_XYCoordinates[playerNo]!=undefined) {
            Game1_XYCoordinates[playerNo].isTaken = false;
            delete players[socket.id];
            printPlayers(Game1_XYCoordinates);
            io.emit('disconnect', socket.id);
        } else {
            console.log("no disconnection");
        }
    });

    // when a player moves, update the player data
    //then sends it to the other players in socket.broadcast.emit*'playermoved'
    socket.on('playerMovement', function(movementData) {
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

function printPlayers(coordinates) {
    for (let i = 0; i < coordinates.length; i++) {
        console.log(coordinates[i].isTaken);
    }   
}


function isRoomFull(){
    for(let i=0; i<Game1_XYCoordinates.length; i++){
      if(!Game1_XYCoordinates[i].isTaken){
        return i; //false
      }
    }
    return -1; //true
}