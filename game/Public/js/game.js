const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  width: 800,
  height: 600,
  parent: "gameDiv",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 450 },
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
let self;
let background;
let cursor;
let mainPlayer;
var players = [];
let platforms = [];
let states = [];
let answerCards = [];
let gameStarted = false;

// var readyKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

// Holds all the spawn points for when users join, could be done with math (should be)
// index 0 is for 1 player, index 1 is for 2 players and so on
const spawnPoints = [
  [400],
  [266.6, 533.3],
  [200, 400, 600],
  [160, 320, 480, 640]
];

function preload() {
  this.load.image("sky", "../assets/backgrounds/sky.png");
  this.load.image("exclamation", "../assets/character/exclamation.png");
  this.load.image("questionMark", "../assets/character/question.png");
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
  this.socket.on("playerAnswered", endRound);
  // this.socket.on("endRound", endRound);
  this.socket.on(
    "me",
    me => (mainPlayer = players.find(player => player.playerId === me.playerId))
  );
  // ---------Asking for Information-------------
  this.socket.emit("currentPlayers");
  this.socket.emit("me");
  // -------------------------------------------------------------------------------------------------------
}

// One of the three main Phaser functions, this one gets called continuously
function update() {
  // Jumping player
  if (cursor.space.isDown && mainPlayer.body.touching.down) {
    mainPlayer.setVelocityY(-300);
    this.socket.emit("playerJump");
  }
  //Ready button
  if (this.readyKey.isDown && !gameStarted) {
    this.socket.emit("playerStateChange", { state: "ready" });
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

  // Other round start stuff, reset game objects
  console.log("startRound() in game.js");
  setTimeout(() => mainPlayer.supportingState.setTexture("questionMark"), 1500);
  self.socket.emit("playerStateChange", { state: "questionMark" });
  displayAnswers(roundInfo.answer);
  displayQuestion(roundInfo.question);
}

// Make the player with the given id jump
function playerJump(playerId) {
  players.find(player => player.playerId === playerId).setVelocityY(-300);
}

function playerStateChange(stateInfo) {
  let player = players.find(holder => stateInfo.playerId === holder.playerId);
  switch (stateInfo.state) {
    case "ready":
      player.supportingState.setTexture("ready");
      break;
    case "questionMark":
      for (player of players) {
        player.supportingState.setTexture("questionMark");
      }
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

// End the round and update players accordingly
function endRound(roundInfo) {
  console.log("Round ending");
  for (let card of answerCards) {
    // Slide correct answer card to center
    if (card.text.text === roundInfo.answer) {
      console.log("CORRECT@@@@@@@@@@@@@@@@@@@@@@");
      self.tweens.add({
        targets: card,
        x: 400,
        ease: "Quint",
        duration: 3000,
        repeat: 0
      });
      self.tweens.add({
        targets: card.text,
        x: 400 - card.text.width / 2,
        ease: "Quint",
        duration: 3000,
        repeat: 0
      });
    } else {
      // Slide incorrect cards off the screen
    dropPlayer(roundInfo.playerId);
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
}

// Create to player object, could be another class but...
function dropPlayer(id){
  let player = players.find( (e)=> e.playerId==id);
  console.log("dropping this player: ", player.playerId);
  player.supportingPlatform.y -= -80;
}
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
  players.push(newPlayer);

  // Update other players positions, (i.e slide them over for the new player)
  updatePlayerPosition();
}

function createState(stateInfo) {
  let newState = self.physics.add.image(stateInfo.x, stateInfo.y, "none");

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

// Used for adding, removing, and setting player position based on wrong answers
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
function displayQuestion(question) {
  // Using group but will probably change this design
  let group = self.physics.add.group();
  group.create(400, 100, "questionBackground");
  let questionBackground = group.getChildren()[0];
  questionBackground.setScale(0.5);

  // Set the question text
  let text = self.add.text(0, 0, question, {
    fontFamily: "Arial",
    fontSize: 50,
    color: "#000000",
    align: "center",
    boundsAlignH: "center",
    boundsAlignV: "middle",
    wordWrap: { width: questionBackground.width - 25 }
  });

  group.add(text);
  text.setDepth(2);

  // Center text on card
  text.setPosition(
    questionBackground.x - text.getBounds().width / 2,
    questionBackground.y - text.getBounds().height / 2
  );

  // Ignore gravity on all parts of question
  for (let thing of group.getChildren()) {
    thing.body.allowGravity = false;
  }
}

// Creates the display for all answers
function displayAnswers(answers) {
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
      wordWrap: { width: card.width - 25 }
    });
    card.text.setDepth(2);

    // Center text on card
    card.text.setPosition(
      card.x - card.text.getBounds().width / 2,
      card.y - card.text.getBounds().height / 2
    );

    // Set card to be interactive and fire answer on click
    card.setInteractive().on("pointerdown", () =>
      self.socket.emit("playerAnswered", {
        answer: card.text.text,
        playerId: mainPlayer.playerId
      })
    );

    // Add card to our master list
    answerCards.push(card);
  }

  // Cards sliding in animation
  if (answerCards.length > 0) {
    for (let card of answerCards) {
      // Slide in card front
      self.tweens.add({
        targets: card,
        x:
          spawnPoints[answerCards.length - 1][
            answerCards.findIndex(holder => card === holder)
          ],
        ease: "Quint",
        duration: 3000,
        repeat: 0
      });

      // Slide in card text
      self.tweens.add({
        targets: card.text,
        x:
          spawnPoints[answerCards.length - 1][
            answerCards.findIndex(holder => card === holder)
          ] -
          card.text.width / 2,
        ease: "Quint",
        duration: 3000,
        repeat: 0
      });
    }
  }
}

// Add text to the screen for player score
function scoreAndPlayer() {
  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000"
  });
}
