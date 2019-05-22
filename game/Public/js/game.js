const config = {
  type: Phaser.AUTO,
  scale: {
    // mode: Phaser.Scale,
    mode: Phaser.Scale.SHOW_ALL,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  width: 800,
  height: 600,
  parent: "gameDiv",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 450
      },
      debug: "true"
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// Main game object
const game = new Phaser.Game(config);
const playerAnswers = new Map();

let self;
let background;
let cursor;
let mainPlayer;
let question;
var players = [];
var losers = [];
let platforms = [];
let states = [];
let answerCards = [];
let gameStarted = false;
let myScore = 0;
let scoreText;

// var readyKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

// Holds all the spawn points for when users join, could be done with math (should be)
// index 0 is for 1 player, index 1 is for 2 players and so on
const spawnPoints = [
  [400],
  [266.6, 533.3],
  [200, 400, 600],
  [160, 320, 480, 640]
];

if (window.innerHeight > window.innerWidth) {
  alert("Please use Landscape!");
}
// if (screen.lockOrientationUniversal("landscape-primary")) {
// if (screen.lockOrientation('landscape')) {
//   // Orientation was locked
// } else {
//   // Orientation lock failed
//   console.log("failed");
// }

function preload() {
  this.load.image("sky", "../assets/backgrounds/sky.png");
  this.load.image("exclamation", "../assets/character/exclamation.png");
  this.load.image("questionMark", "../assets/character/question.png");
  this.load.image("ghost", "../assets/character/ghost.png");
  this.load.image("ready", "../assets/character/star.png");
  this.load.image("none", "../assets/character/none.png");
  this.load.image("p1", "../assets/character/dratini_resize.png");
  this.load.image("p2", "../assets/character/eevee_resize.png");
  this.load.image("p3", "../assets/character/pikachu_resize.png");
  this.load.image("p4", "../assets/character/rapidash_resize.png");
  this.load.image("platform1", "../assets/backgrounds/platform3.png");
  this.load.image("platform", "../assets/character/platform.png");
  this.load.image("cardFront", "../assets/backgrounds/cardFront.png");
  this.load.image(
    "questionBackground",
    "../assets/backgrounds/uglyQuestionBackground.png"
  );

}


function create() {
  this.socket = io();
  self = this;
  cursor = this.input.keyboard.createCursorKeys();
  this.readyKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

  background = this.add
    .image(000, 00, "sky")
    .setOrigin(0)
    .setDisplaySize(800, 600);

  // ----------------------------------------Server Connection----------------------------------------------
  // ----------Incoming Information----------
  if (!gameStarted) {
    this.socket.on("newPlayer", createPlayer);
  }
  this.socket.on("removePlayer", removePlayer);
  this.socket.on("playerJump", playerJump);
  this.socket.on("playerStateChange", playerStateChange);
  this.socket.on("currentPlayers", currentPlayers);
  this.socket.on("startRound", startRound);
  this.socket.on("endRound", endRound);
  this.socket.on("gameEnd", playerStateChange);
  this.socket.on("gameOver", playerStateChange);


  this.socket.on(
    "me",
    me => (mainPlayer = players.find(player => player.playerId === me.playerId))
  );
  // ---------Asking for Information-------------
  this.socket.emit("currentPlayers");
  this.socket.emit("me");
  // -------------------------------------------------------------------------------------------------------
  //Detects touch on mobile devices
  this.input.on('pointerup', (pointer) => {
    if (mainPlayer.body.touching.down && gameStarted) {
      mainPlayer.setVelocityY(-300);
      this.socket.emit("playerJump");
    } else if (!gameStarted) {
      this.socket.emit("playerStateChange", {
        state: "ready"
      });
    }
  });



}



// One of the three main Phaser functions, this one gets called continuously


function update() {

  // Jumping player
  if (cursor.space.isDown && mainPlayer.body.touching.down && gameStarted) {
    mainPlayer.setVelocityY(-300);
    this.socket.emit("playerJump");
  }

  if ((cursor.space.isDown || this.readyKey.isDown) && !gameStarted) {
    this.socket.emit("playerStateChange", {
      state: "ready"
    });
  }

  // update each state position
  for (let player of players) {
    updateStatePosition(player);
  }
}

function updateStatePosition(player) {
  let playerState = player.supportingState;
  playerState.setY(player.y - playerState.height - 30);
}

// Start new round (i.e create new cards), reset game objects
function startRound(roundInfo) {

  gameStarted = true;
  scoreAndPlayer();
  // Other round start stuff, reset game objects
  console.log("startRound() in game.js");
  if (!mainPlayer.gameOver) {
    setTimeout(() => mainPlayer.supportingState.setTexture("questionMark"), 1500);
    self.socket.emit("playerStateChange", {
      state: "questionMark"
    });
  }
  displayAnswers(roundInfo.answer);
  displayQuestion(roundInfo.question);


}


// Make the player with the given id jump
function playerJump(playerId) {
  players.find(player => player.playerId === playerId)
    .setVelocityY(-300);
}

function playerStateChange(stateInfo) {
  let player = players.find(holder => stateInfo.playerId === holder.playerId);
  switch (stateInfo.state) {
    case "ready":

      player.supportingState.setTexture("ready");
      break;
    case "questionMark":
      if (!isLoser(stateInfo.playerId)) {
        for (player of players) {
          player.supportingState.setTexture("questionMark");
        }
      }
      break;

    case "exclamation":
      if (!isLoser(stateInfo.playerId)) {

        player.supportingState.setTexture("exclamation");
      }
      break;

    case "gameOver":

      player.gameOver = true;
      self.deadPlayerY = player.y;
      player.body.allowGravity = false;
      player.alpha = 0.5;
      player.setTexture("ghost");

      // player.supportingState.setTexture("none");
      player.supportingState.destroy();
      player.setImmovable(true);
      player.supportingPlatform.destroy();
      losers = stateInfo.losers;
      console.log("Update losers list: ", losers);
      self.tweens.timeline({
        targets: player.body.velocity,
        loop: -1,
        tweens: [{
            // x: spawnPoints[players.length][players.length],
            y: -30,
            duration: 700,
            ease: 'Stepped'
          },
          {
            // x: spawnPoints[players.length][players.length],
            y: 30,
            duration: 700,
            ease: 'Stepped'
          },


        ]
      });
      break;
    case "gameEnd":
      player.supportingState.destroy();
      gameEnd();
      break;

    default:
      console.log("state undefined!!!");
      break;
  }
}

// Add players to game, called at the start of a session
function currentPlayers(currentPlayers) {
  players = [];
  console.log(currentPlayers);
  for (let player of currentPlayers) {
    createPlayer(player);
  }
}

function gameEnd() {


  for (let player of players) {

    if (!player.gameOver) {
      player.y = 0;
      player.supportingState.destroy();
      self.tweens.add({
        targets: player.supportingPlatform,
        y: 270,
        ease: "Quint",
        duration: 1000,
        repeat: 0
      });
    }

  }
}
// End the round and update players accordingly
function endRound(roundInfo) {

  console.log("Round ending");
  for (let card of answerCards) {
    // console.log("RoundInfo: " + JSON.stringify(roundInfo));

    if (roundInfo.answer === card.text.text) {

      self.tweens.add({
        targets: card,
        x: 400,
        y: 480 + 70,
        ease: "Quint",
        duration: 3000,
        repeat: 0
      });
      self.tweens.add({
        targets: card.text,
        x: 400 - card.text.width / 2,
        y: 480 + 70 - 18,
        ease: "Quint",
        duration: 3000,
        repeat: 0
      });
    } else {
      // Slide incorrect cards off the screen
      self.tweens.add({
        targets: card,
        y: 1500,
        ease: "Quint",
        duration: 20000,
        repeat: 0
      });
      self.tweens.add({
        targets: card.text,
        y: 1500,
        ease: "Quint",
        duration: 20000,
        repeat: 0
      });
    }
  }



  updatePlayerValues(roundInfo);

  updatePlayerScoreHeight();
}

function updatePlayerValues(data) {
  // Update the count of correct and incorract anwers for each player
  for (let player of players) {
    for (let playerUpdate of data.players)
      if (playerUpdate.playerId === player.playerId) {
        player.correctAnswers = playerUpdate.correctAnswers;
        player.wrongAnswers = playerUpdate.wrongAnswers;
      }
  }

}

// Create to player object, could be another class but...
function createPlayer(playerInfo) {
  // Setting starting x to the next value of spawnPoints
  let startingX = spawnPoints[players.length][players.length];
  let startingY = -10;
  let newPlayer;
  switch (players.length) {
    case 0:
      newPlayer = self.physics.add.sprite(startingX, startingY, "p1");
      break;
    case 1:
      newPlayer = self.physics.add.sprite(startingX, startingY, "p2");
      break;
    case 2:
      newPlayer = self.physics.add.sprite(startingX, startingY, "p3");
      break;
    case 3:
      newPlayer = self.physics.add.sprite(startingX, startingY, "p4");
      break;
  }

  // Mage players bounce and have the player sit infront of the platforms
  newPlayer.setBounce(0.3);
  newPlayer.setDepth(5);
  //   newPlayer.setImmovable(true);
  newPlayer.body.height = newPlayer.body.height - newPlayer.body.height / 2.5;
  newPlayer.playerId = playerInfo.playerId;

  // Set the current player if not already
  if (!mainPlayer) {
    mainPlayer = newPlayer;
  }

  // Create the platform for this player
  let newPlatform = createPlatform({
    x: spawnPoints[players.length][players.length],
    y: 1000,
    supportingPlayer: newPlayer
  });
  let newState = createState({
    x: spawnPoints[players.length][players.length],
    y: -200,
    supportingPlayer: newPlayer
  });

  // Have the player object contain a reference to their platform
  // newPlayer.supportingState.setBounce(0.3);
  // newPlayer.supportingState.setDepth(5);
  // self.physics.add.collider(newPlayer.supportingState, newPlayer);
  newPlayer.supportingPlatform = newPlatform;
  newPlayer.supportingState = newState;
  newPlayer.gameOver = false;
  players.push(newPlayer);


  // Update other players positions, (i.e slide them over for the new player)
  updatePlayerPosition();
}

function createState(stateInfo) {
  let newState = self.physics.add.image(stateInfo.x, stateInfo.y, "none");

  newState.setDepth(8);
  newState.body.allowGravity = false;
  newState.supportingPlayer = stateInfo.supportingPlayer;

  states.push(newState);
  return newState;
}
// Create platform under a character
function createPlatform(platformInfo) {
  let newPlatform = self.physics.add.sprite(
    platformInfo.x,
    platformInfo.y,
    "platform1"
  );

  // Set the platform to ignore collision and gravity
  newPlatform.setImmovable(true);
  newPlatform.body.allowGravity = false;

  // Slide platform onto the screen
  self.tweens.add({
    targets: newPlatform,
    y: 400,
    ease: "Power4",
    duration: 1000,
    repeat: 0
  });

  // Have the platform contain a reference to its supporting player and have
  // collision with that player
  newPlatform.supportingPlayer = platformInfo.supportingPlayer;
  self.physics.add.collider(platformInfo.supportingPlayer, newPlatform);

  platforms.push(newPlatform);

  return newPlatform;
}

// Remove player from the game and update player positions
function removePlayer(playerInfo) {
  // Finiding the player and destroying them
  for (let i = 0; i < players.length; i++) {
    if (playerInfo.playerId === players[i].playerId) {
      let removing = players.splice(i, 1)[0];
      console.log("removed: " + JSON.stringify(removing));
      removing.supportingPlatform.destroy();
      removing.supportingState.destroy();
      removing.destroy();

      break;
    }
  }

  updatePlayerPosition();
}

// Update y position of platform based on incorrect answers and the game score
function updatePlayerScoreHeight() {
  // console.log("updating player heights: " + JSON.stringify(players));


  for (let i = 0; i < players.length; i++) {
    // console.log(players[i], ": player[i].wrongAnswers");
    self.tweens.add({
      targets: [players[i].supportingPlatform],
      y: 400 + 50 * players[i].wrongAnswers,
      ease: "Power4",
      duration: 1000,
      repeat: 0
    });
  }


}

// Used for adding, removing, and setting player position
function updatePlayerPosition() {

  for (let i = 0; i < players.length; i++) {
    self.tweens.add({
      targets: [
        players[i],
        players[i].supportingPlatform,
        players[i].supportingState
      ],
      x: spawnPoints[players.length - 1][i],
      ease: "Power4",
      duration: 1000,
      repeat: 0
    });
  }
}

// Creates the display for the question text
function displayQuestion(questionInfo) {
  if (question) {
    question.text.destroy();
    question.destroy();
  }

  // Using group but will probably change this design
  question = self.add.image(400, 100, "questionBackground");
  question.setScale(0.5);

  // Set the question text
  question.text = self.add.text(0, 0, questionInfo, {
    fontFamily: "Arial",
    fontSize: 50,
    color: "#000000",
    align: "center",
    boundsAlignH: "center",
    boundsAlignV: "middle",
    wordWrap: {
      width: question.width - 25
    }
  });
  question.text.setDepth(2);

  // Center text on card
  question.text.setPosition(
    question.x - question.text.getBounds()
    .width / 2,
    question.y - question.text.getBounds()
    .height / 2
  );

}

// Creates the display for all answers
function displayAnswers(answers) {

  let cardX = [400 - 135, 400 + 135, 400 - 135, 400 + 135];
  let cardY = [480, 480, 480 + 70, 480 + 70];
  // Remove all old answer cards
  for (let card of answerCards) {
    card.text.destroy();
    card.destroy();
  }
  answerCards = [];

  // Start off screen
  for (let answer of answers) {
    let card = self.add.image(-100, 550, "cardFront");
    // Creation of text and adding to group
    card.text = self.add.text(0, 0, answer, {
      fontFamily: "Arial",
      fontSize: 28,
      color: "#000000",
      align: "center",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      wordWrap: {
        width: card.width - 25
      }
    });
    card.text.setDepth(2);

    // Center text on card
    card.text.setPosition(
      card.x - card.text.getBounds()
      .width / 2,
      card.y - card.text.getBounds()
      .height / 2
    );

    // Set card to be interactive and fire answer on click
    card.setInteractive()
      .on("pointerdown", () => {
        if (!mainPlayer.gameOver) {
          self.socket.emit("playerAnswered", {
            answer: card.text.text,
            playerId: mainPlayer.playerId
          });
        } else {
          self.socket.emit("playerAnswered", {
            answer: "N/A",
            playerId: mainPlayer.playerId
          });
          console.log("Can't click, you're dead.");
        }
      });

    // Add card to our master list
    answerCards.push(card);
  }

  // Cards sliding in animation
  if (answerCards.length > 0) {

    // for (let card of answerCards) {
    for (let i = 0; i < 4; i++) {

      // Slide in card front
      self.tweens.add({
        targets: answerCards[i],
        x: cardX[i],
        y: cardY[i],
        ease: "Quint",
        duration: 3000,
        repeat: 0
      });

      // Slide in card text
      self.tweens.add({
        targets: answerCards[i].text,
        x: cardX[i],
        y: cardY[i] - 18,
        ease: "Quint",
        duration: 3000,
        repeat: 0
      });

    }
  }


}

// Add text to the screen for player score
function scoreAndPlayer() {
  console.log("array:", players);

  if (scoreText) {
    scoreText.destroy();
  }
  let scores = [];
  let me = players.find(player => player.playerId === mainPlayer.playerId);


  console.log("Me, players.correctAnswers ", me.correctAnswers);


  myScore = me.correctAnswers * 90;

  for (let player of players) {
    if (player.playerId != me) {
      scores.push(player.correctAnswers * 90);
    }
  }

  let scoreBoard = "Score: " + myScore;


  scoreText = self.add.text(16, 16, scoreBoard, {
    fontFamily: "Macondo Swash Caps",
    fontSize: "40px",
    fill: "#000"
  });


}

function isLoser(id) {
  for (let playerId of losers) {
    if (playerId === id) {
      return true;
    }
  }
  return false;

}