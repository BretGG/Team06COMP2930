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
  plugins: {
    global: [{
      key: "WebFontLoader",
      plugin: WebFontLoaderPlugin,
      start: true
    }]
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
let water;
let cursor;
let setBG = false;
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
let startMessage;

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
  this.load.image("sky", "../assets/backgrounds/city.png");
  this.load.image("water", "../assets/backgrounds/city-wave.png");
  this.load.image("exclamation", "../assets/character/exclamation.png");
  this.load.image("questionMark", "../assets/character/question.png");
  this.load.image("1st", "../assets/character/1st.png");
  this.load.image("2nd", "../assets/character/2nd.png");
  this.load.image("3rd", "../assets/character/3rd.png");
  this.load.image("ghost", "../assets/character/ghost.png");
  this.load.image("ready", "../assets/character/star.png");
  this.load.image("none", "../assets/character/none.png");
  this.load.image("yelloChar", "../assets/character/yellowChar.png");
  this.load.image("blueChar", "../assets/character/blueChar.png");
  this.load.image("greenChar", "../assets/character/greenChar.png");
  this.load.image("redChar", "../assets/character/redChar.png");
  this.load.image("platform3", "../assets/backgrounds/platform3.png");
  this.load.image("platform", "../assets/character/platform.png");
  this.load.image("rabbitpet", "../assets/character/rabbitpet.png");
  this.load.image("cardFront", "../assets/backgrounds/cardFront.png");
  this.load.image(
    "questionBackground",
    "../assets/backgrounds/uglyQuestionBackground.png"
  );
  this.load.webfont("ponderosa", "../fonts/ponderosa.ttf");
  this.load.webfont("Ubuntu-Regular", "../fonts/Ubuntu-Regular.ttf");
}

function create() {
  this.socket = io("", {
    query: "token=" + localStorage.getItem("auth-token")
  });
  self = this;
  cursor = this.input.keyboard.createCursorKeys();
  this.readyKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

  background = this.add
    .image(000, 00, "sky")
    .setOrigin(0)
    .setDisplaySize(800, 600);
  water = this.physics.add.sprite(400, 530, "water");
  water.setDepth(8);
  water.alpha = 0.8;
  water.body.allowGravity = false;
  this.tweens.timeline({
    targets: water.body.velocity,
    loop: -1,
    tweens: [{
        y: -30,
        duration: 700,
        ease: "Stepped"
      },
      {
        y: 30,
        duration: 700,
        ease: "Stepped"
      }
    ]
  });
  let startString = "Touch screen to start";
  startMessage = self.add.text(400, 300, startString, {
    font: "28px ponderosa",
    fill: "#000"
  });
  startMessage.setOrigin(0.5);
  startMessage.y += -150;

  // this.tweens.timeline({
  //   targets: startMessage,
  //   loop: -1,
  //   tweens: [{
  //       y: -30,
  //       duration: 700,
  //       ease: 'Stepped'
  //     },
  //     {
  //       y: 30,
  //       duration: 700,
  //       ease: 'Stepped'
  //     },
  //
  //
  //   ]
  // });

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
  this.socket.on("setCosmetics", setCosmetics);
  this.socket.on("gameEnd", playerStateChange);
  this.socket.on("gameOver", playerStateChange);
  this.socket.on(
    "me",
    me => (mainPlayer = players.find(player => player.playerId === me.playerId))
  );
  // ---------Asking for Information-------------
  this.socket.emit("currentPlayers");
  this.socket.emit("getCosmetics");
  this.socket.emit("me");
  // ------------------------------------------------------------------------------------------------------
  //Detects touch on mobile devices
  this.input.on("pointerup", pointer => {
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
// pin state image above character's head
function updateStatePosition(player) {
  let playerState = player.supportingState;
  playerState.setY(player.y - playerState.height - 27);
}

// Sets players cosmetics
function setCosmetics(cosmeticsInfo) {
  let player = players.find(
    holder => cosmeticsInfo.playerId === holder.playerId
  );

  let cosAvatar = cosmeticsInfo.cosmetics.activeAvatar.imageLink;
  let cosPlatform = cosmeticsInfo.cosmetics.activePlatform.imageLink;
  let cosBackground = cosmeticsInfo.cosmetics.activeBackground.imageLink;

  // player.setTexture(cosmeticsInfo.cosmetics.activeAvatar.subString())
  player.setTexture(
    cosAvatar.substring(
      cosAvatar.lastIndexOf("/") + 1,
      cosAvatar.lastIndexOf(".")
    )
  );
  player.supportingPlatform.setTexture(
    cosPlatform.substring(
      cosPlatform.lastIndexOf("/") + 1,
      cosPlatform.lastIndexOf(".")
    )
  );
  // if (!setBG) {
  //   player.supportingPlatform.setTexture(
  //     cosBackground.substring(
  //       cosBackground.lastIndexOf("/") + 1,
  //       cosBackground.lastIndexOf(".")
  //     )
  //   );
  //   setBG = true;
  // }
}

// Start new round (i.e create new cards), reset game objects
function startRound(roundInfo) {
  startMessage.destroy();
  gameStarted = true;
  scoreAndPlayer();
  // Other round start stuff, reset game objects
  console.log("startRound() in game.js");
  if (!mainPlayer.gameOver) {
    // setTimeout(() => mainPlayer.supportingState.setTexture("questionMark"), 1500);
    console.log("mainPlayer.playerId ", mainPlayer.playerId);
    self.socket.emit("playerStateChange", {
      playerId: mainPlayer.playerId,
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
//Change the state icon according to the incoming state information
function playerStateChange(stateInfo) {
  let player = players.find(holder => stateInfo.playerId === holder.playerId);
  console.log("player ", player);
  switch (stateInfo.state) {
    case "ready":
      console.log(stateInfo.playerId, " in case: ready, stateinfo.playerId");
      player.supportingState.setTexture("ready");
      break;
    case "questionMark":
      console.log("players: ", players);
      console.log("stateinfo: ", stateInfo);
      console.log(stateInfo.playerId, " stateinfo.playerId");
      player.answered = false;
      if (!isLoser(stateInfo.playerId)) {
        for (let player of players) {
          player.supportingState.setTexture("questionMark");
        }
      }
      break;
    case "exclamation":
      player.answered = true;
      if (!isLoser(stateInfo.playerId)) {
        player.supportingState.setTexture("exclamation");
      }
      break;
    case "gameOver":
      player.gameOver = true;
      self.deadPlayerY = player.y;
      player.body.allowGravity = false;
      player.alpha = 0.5;
      setTimeout(() => player.setTexture("ghost"), 800);
      player.supportingState.destroy();
      player.setImmovable(true);
      player.supportingPlatform.destroy();
      losers = stateInfo.losers;
      console.log("Update losers list: ", losers);
      self.tweens.timeline({
        targets: player.body.velocity,
        loop: -1,
        tweens: [{
            y: -30,
            duration: 700,
            ease: "Stepped"
          },
          {
            y: 30,
            duration: 700,
            ease: "Stepped"
          }
        ]
      });

      if (players.length === 1) {
        gameEnd();
      }
      break;
    case "gameEnd":
      player.supportingState.setTexture("none");
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
// After the game is completely over, clear out unnessary object and ranking them
function gameEnd() {
  answerCards.forEach(e => {
    e.destroy();
    e.text.destroy();
  });
  question.destroy();
  question.text.destroy();
  let minusGhosts = players.filter(elem => elem.gameOver !== true);
  let sortedCorrectAnswersDesc = [];
  minusGhosts.forEach(function(element) {
    sortedCorrectAnswersDesc.push(element.correctAnswers);
    sortedCorrectAnswersDesc.sort(function(p, q) {
      return q - p;
    });
  });
  console.log("sortedCorrectAnswersDesc: ", sortedCorrectAnswersDesc);
  if (minusGhosts.length <= 3) {
    for (let i = 0; i < minusGhosts.length; i++) {
      minusGhosts[i].y = 0;
      self.tweens.add({
        targets: minusGhosts[i].supportingPlatform,
        y: 270,
        ease: "Quint",
        duration: 1000,
        repeat: 0
      });
    }
  } else {
    for (let i = 0; i < minusGhosts.length; i++) {
      //raise all players except the fourth place player
      if (
        minusGhosts[i].correctAnswers !==
        sortedCorrectAnswersDesc[sortedCorrectAnswersDesc.length - 1]
      ) {
        minusGhosts[i].y = 0;
        self.tweens.add({
          targets: minusGhosts[i].supportingPlatform,
          y: 270,
          ease: "Quint",
          duration: 1000,
          repeat: 0
        });
      }
    }
  }
  let uniq = [...new Set(sortedCorrectAnswersDesc)];
  console.log("uniq:", uniq);
  for (let i = 0; i < minusGhosts.length; i++) {
    if (minusGhosts[i].correctAnswers === uniq[0]) {
      minusGhosts[i].supportingState.setTexture("1st");
    } else if (minusGhosts[i].correctAnswers === uniq[1]) {
      minusGhosts[i].supportingState.setTexture("2nd");
    } else if (minusGhosts[i].correctAnswers === uniq[2]) {
      minusGhosts[i].supportingState.setTexture("3rd");
    } else {
      minusGhosts[i].supportingState.setTexture("none");
    }
  }
}
// End the round and update players accordingly
function endRound(roundInfo) {
  console.log("Round ending");
  for (let card of answerCards) {
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
        x: 400,
        y: 480 + 70,
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

// Create a player object according to the number of connected users
//and determine the initial spawn position proportionally
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

  // Have the player object contain a reference to their platform and state
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
    y: 345,
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
  for (let i = 0; i < players.length; i++) {
    self.tweens.add({
      targets: [players[i].supportingPlatform],
      y: 345 + 50 * players[i].wrongAnswers,
      //400+50?
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
    font: "20px Ubuntu-Regular",
    color: "#000000",
    align: "center",
    wordWrap: {
      width: question.displayWidth - 60
    }
  });

  question.text.setDepth(2);
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
    console.log("answers.length, ", answers.length);
    let card = self.add.image(-100, 550, "cardFront");
    card.setDepth(9);
    card.alpha = 0.9;
    // Creation of text and adding to group
    card.text = self.add.text(0, 0, answer, {
      font: "17px Ubuntu-Regular",
      // fontSize: 17,
      color: "#000000",
      align: "center",
      wordWrap: {
        width: card.displayWidth - 25
      }
    });

    console.log(card.width);

    card.text.setDepth(10);
    card.text.setOrigin(0.5);

    // Set card to be interactive and fire answer on click
    card.setInteractive()
      .on("pointerdown", () => {
        if (!mainPlayer.gameOver && !mainPlayer.answered) {
          self.socket.emit("playerAnswered", {
            answer: card.text.text,
            playerId: mainPlayer.playerId
          });
        } else {
          self.socket.emit("playerAnswered", {
            answer: "N/A",
            playerId: mainPlayer.playerId
          });
          console.log("Can't click");
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
        y: cardY[i],
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

  myScore = me.correctAnswers * 95;

  for (let player of players) {
    if (player.playerId != me) {
      scores.push(player.correctAnswers * 95);
    }
  }

  let scoreBoard = "Score:" + (myScore || 0);

  scoreText = self.add.text(16, 16, scoreBoard, {
    // fontFamily: "Macondo Swash Caps",
    font: "30px ponderosa",
    // fontSize: "40px",
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