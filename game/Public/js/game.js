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
    },
    matter: {
      debug: true
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
let players = [];
let platforms = [];
let answerCards = [];

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
  self = this;
  this.socket = io();
  cursor = this.input.keyboard.createCursorKeys();

  background = this.add
    .image(000, 00, "sky")
    .setOrigin(0)
    .setDisplaySize(800, 600);

  // ----------------------------------------Server Connection----------------------------------------------
  this.socket.on("newPlayer", createPlayer);
  this.socket.on("removePlayer", removePlayer);
  this.socket.on("playerJump", playerJump);
  this.socket.on("currentPlayers", currentPlayers);
  this.socket.on("startRound", startRound);
  this.socket.on("endRound", endRound);
  this.socket.on(
    "me",
    me => (mainPlayer = players.find(player => player.playerId === me.playerId))
  );

  //   this.socket.on("flashcards", displayFlashcards);

  //   function displayFlashcards(data) {
  //     if (data[count] != undefined) {
  //       let string = self.add.text(300, 90, data[count].question, {
  //         fontFamily: '"Roboto Condensed"',
  //         fontSize: 36,
  //         color: "#000000"
  //       });
  //     }
  //   }
  // Update all current players

  // Set the main player

  // Ask for info
  this.socket.emit("currentPlayers");

  //////////////// Test code
  // displayAnswers([
  //   "something is going on here",
  //   "yay for another question of this length",
  //   "wow",
  //   "Another question, Amazing"
  // ]);

  // displayQuestion("somethingElse");
  //////////////// Test code

  // -------------------------------------------------------------------------------------------------------
  this.socket.emit("me");
}

function update() {
  // Jumping player
  if (cursor.space.isDown && mainPlayer.body.touching.down) {
    mainPlayer.setVelocityY(-300);
    this.socket.emit("playerJump");
  }
}

// Start new round (i.e create new cards)
function startRound(roundInfo) {
  displayAnswers(roundInfo.answers);
  displayQuestion(roundInfo.question);
  console.log("round started" + JSON.stringify(roundInfo));
  // Other round start stuff
}

// Make the player with the given id jump
function playerJump(playerId) {
  players.find(player => player.playerId === playerId).setVelocityY(-300);
}

// Add players to game
function currentPlayers(currentPlayers) {
  players = [];
  console.log(currentPlayers);
  for (let player of currentPlayers) {
    createPlayer(player);
  }
}

function endRound(roundInfo) {
  console.log(roundInfo);
}

// Create to player object, could be another class but...
function createPlayer(playerInfo) {
  // Always adding in the last postition
  let startingX = spawnPoints[players.length][players.length];

  let newPlayer;
  switch (players.length) {
    case 0:
      newPlayer = self.physics.add.sprite(startingX, -50, "p1");
      break;
    case 1:
      newPlayer = self.physics.add.sprite(startingX, -50, "p2");
      break;
    case 2:
      newPlayer = self.physics.add.sprite(startingX, -50, "p3");
      break;
    case 3:
      newPlayer = self.physics.add.sprite(startingX, -50, "p4");
      break;
  }
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
  newPlayer.supportingPlatform = newPlatform;
  players.push(newPlayer);

  // Update other players positions
  updatePlayerPosition();
}

function createPlatform(platformInfo) {
  let newPlatform = self.physics.add.sprite(
    platformInfo.x,
    platformInfo.y,
    "platform1"
  );
  newPlatform.setImmovable(true);
  newPlatform.body.allowGravity = false;

  self.tweens.add({
    targets: newPlatform,
    y: 400,
    ease: "Power4",
    duration: 1000,
    repeat: 0
  });

  newPlatform.supportingPlayer = platformInfo.supportingPlayer;
  self.physics.add.collider(platformInfo.supportingPlayer, newPlatform);
  platforms.push(newPlatform);

  return newPlatform;
}

function removePlayer(playerInfo) {
  console.log("looking to remove: " + JSON.stringify(playerInfo));
  for (let i = 0; i < players.length; i++) {
    if (playerInfo[0].playerId === players[i].playerId) {
      let removing = players.splice(i, 1)[0];
      console.log("removed: " + JSON.stringify(removing));
      removing.supportingPlatform.destroy();
      removing.destroy();
      break;
    }
  }

  updatePlayerPosition();
}

function wrongAnswer(player) {
  self.tweens.add({
    targets: player.supportingPlatform,
    y: player.supportingPlatform.y + 50,
    ease: "Linear",
    duration: 200,
    repeat: 0
  });
}

// Used for adding and removing players
function updatePlayerPosition() {
  for (let i = 0; i < players.length; i++) {
    self.tweens.add({
      targets: [players[i], players[i].supportingPlatform],
      x: spawnPoints[players.length - 1][i],
      ease: "Power4",
      duration: 1000,
      repeat: 0
    });
  }
}

// Creates the display for the question
function displayQuestion(question) {
  let group = self.physics.add.group();
  group.create(400, 100, "questionBackground");
  let questionBackground = group.getChildren()[0];
  questionBackground.setScale(0.5);

  let text = self.add.text(0, 0, question, {
    fontFamily: "Arial",
    fontSize: 20,
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

// Creates the display for answers
function displayAnswers(answers) {
  for (let card of answerCards) {
    card.text.destroy();
    card.destroy();
  }

  answerCards = [];

  // Start off screen
  for (let answer of answers) {
    // Creation of group and adding the car front
    // let group = self.physics.add.group();
    // group.create(-100, 550, "cardFront");
    // let cardFront = group.getChildren()[0];

    let card = self.add.image(-100, 550, "cardFront");

    // Creation of text and adding to group
    card.text = self.add.text(0, 0, answer, {
      fontFamily: "Arial",
      fontSize: 18,
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

    // Ignore gravity on all parts of card
    // for (let  of group.getChildren()) {
    //   thing.body.allowGravity = false;
    // }

    // Set the object to be interactive
    card
      .setInteractive()
      .on("pointerdown", () => self.socket.emit("answered", text.text));

    // Add card to our master list
    answerCards.push(card);
  }

  // Sliding in the cards
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

// var question;
// var myPlayerSocket;
// var thisSprite;
// var thisAvatar;
// var Node0;
// var playersArray = [];
// //number of players in the room.
// var noOfPlayers;
// var noOfPlayersText;
// var emptyCard;
// var width = 800;
// var height = 600;
// var self;
// var smallPlatform, bigPlatform;
// var platform1, platform2, platform3;
// var cursors;
// var scroll;
// var player1, player2, player3;
// //To be changed to true if they are connected to server.
// player1 = false;
// player2 = false;
// player3 = false;
// var globalFlashCard, globalTurnFinished;
// var questionList;
// var currentPlayerAnswered = false;
// var opponentPlayerAnswered = false;
// ///////////////////////////////////////////////////////////////////////////////
// //////////////Should probably be in a different file///////////////////////////
// ///////////////////////////////////////////////////////////////////////////////

// class NodeHolder {
//   constructor(value) {
//     this.previous = null;
//     this.value = value;
//     this.next = this.value.next;
//   }
//   updateToNextValue() {
//     this.previous = this.value;
//     this.value = this.value.next;
//     this.next = this.value.next;
//   }
//   getValue() {
//     return this.value;
//   }
// }
// class Node {
//   constructor(value, nextNode) {
//     this.value = value;
//     this.next = nextNode;
//   }
// }
//
// //
// class qandA {
//   constructor(question, answer) {
//     this.question = question;
//     this.answersList = [answer];
//     this.getQuestion = function() {
//       return this.question;
//     };
//   }
// }
/**
    Adds a dummy answer card to the original array.
    Goes through a while loop, and pushes a random index
    from the original array into the temp array,
    Removes that index that is pushed into the temp array.
    Object pushed into the array is removed from the original array.
    While loop repeats until all objects are randomly selected and
    pushed into the new array.
    Then the original Array is reassigned to temp array.
    **/
// addDummy(dummy) {
//
//
//   this.answersList.push(dummy);
//   let tempArray = [];
//   while (this.answersList.length != 0) {
//     let randIndex = Math.floor(Math.random() * this.answersList.length);
//     tempArray.push(this.answersList[randIndex]);
//     this.answersList.splice(randIndex, 1);
//   }
//   this.answersList = tempArray;
//   console.log(this.answersList);
// }

////////////////////////////////////////////////
// class answers {
//   constructor(text, correct) {
//     this.answer = text;
//     this.correct = correct;
//   }
// }
/**
 player object skeleton:
    this.name = name;
    this.active = active;
    this.score = 0;
    this.platform;
    this.spriter;
    this.
}
**/

// function startGame() {
//   let card1 = new answers("1", false);
//   let card2 = new answers("2", false);
//   let card3 = new answers("3", false);
//   let card4 = new answers("4", true);
//   let questionAnswer1 = new qandA("What is 2 + 2", card4);
//   questionAnswer1.addDummy(card1);
//   questionAnswer1.addDummy(card2);
//   questionAnswer1.addDummy(card3);
//   let card11 = new answers("1", false);
//   let card22 = new answers("2", true);
//   let card33 = new answers("3", false);
//   let card44 = new answers("4", false);
//   let questionAnswer2 = new qandA("What is 1 + 1", card44);
//   questionAnswer2.addDummy(card11);
//   questionAnswer2.addDummy(card22);
//   questionAnswer2.addDummy(card33);
//
//   let card111 = new answers("1", true);
//   let card222 = new answers("2", false);
//   let card333 = new answers("3", false);
//   let card444 = new answers("4", false);
//   let questionAnswer3 = new qandA("What is 1 + 0", card444);
//   questionAnswer3.addDummy(card111);
//   questionAnswer3.addDummy(card222);
//   questionAnswer3.addDummy(card333);
//
//   Node0 = new Node(questionAnswer1, null);
//   let Node1 = new Node(questionAnswer2, null);
//   let Node2 = new Node(questionAnswer3, null);
//
//   Node0.next = Node1;
//   Node1.next = Node2;
//   Node2.next = -1;
//   questionList = new NodeHolder(Node0);
// }

////////////////////////////////

// globalFlashcard = createQuestionAnswer(this, questionList.getValue());

// globalTurnFinished = false;

//  If a Game Object is clicked on, this event is fired.
//  We can use it to emit the 'clicked' event on the game object itself.

// this.socket.on("allPlayerAnswered", function(msg) {
//   console.log("opponentPlayerAnswered=true ");
//   opponentPlayerAnswered = true;
//   if (currentPlayerAnswered && opponentPlayerAnswered) {
//     console.log("moving on to next question!!");
//     afterGlobalTurnFinished();
//   }
// });

// } //create() ends here.

function scoreAndPlayer() {
  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000"
  });
}

////////////////////////click handler////////////////////
function clickHandler(box) {
  console.log("card clicked");
  currentPlayerAnswered = true;
  this.socket.emit("playerAnswered", { data: true });

  afterGlobalTurnFinished();
  if (box.isItCorrect) {
    box.setTint(0x00ff00);
  } else {
    box.setTint(0xff0000);
  }
}

///2
// function callbackEvent()
// {
//   console.log(this.socket, " inside callbackEvent");
//   this.socket.emit("playerAnswered",{data:true});
//         // globalTurnFinished = true;
// }
////////////////////////////////////////////////////////
///A12 it emits new X and Y coordinates
// function update() {
//   if (thisSprite) {
//     if (this.input.keyboard.checkDown(cursors.left, 250)) {
//       thisSprite.x -= 32;
//     } else if (this.input.keyboard.checkDown(cursors.right, 250)) {
//       thisSprite.x += 32;
//     }
//     //  Vertical movement every 150ms
//     if (this.input.keyboard.checkDown(cursors.up, 150)) {
//       thisSprite.y -= 32;
//     } else if (this.input.keyboard.checkDown(cursors.down, 150)) {
//       thisSprite.y += 32;
//     }
//     // this.socket.emit("playerMovement", {
//     //   platformX: thisSprite.x,
//     //   platformY: thisSprite.y,
//     //   avatarX: thisAvatar.x,
//     //   avatarY: thisAvatar.y
//     // });
//   }
// }
// function afterGlobalTurnFinished() {
//   opponentPlayerAnswered = false;
//   currentPlayerAnswered = false;
//   globalFlashCard = null;
//   removeQuestionAnswer();
//   questionList.updateToNextValue();
//   globalFlashcard = createQuestionAnswer(self, questionList.getValue());

//   console.log("finished turn, uopdate to next val");
// }

// function createQuestionAnswer(self, Node) {
//   if (Node == -1) {
//     let cardText = self.add.text(100, 100, "END OF FLASHCARDS", {
//       fontFamily: '"Roboto Condensed"',
//       fontSize: 55,
//       color: "#000000"
//     });
//   } else {
//     let scrollEmpty;
//     let questionText;
//     let emptyCardArray = [];
//     let textArray = [];
//     let scale =
//       width / Node.value.answersList.length -
//       width / Node.value.answersList.length / 2;

//     let ehhh = self.input.on(
//       "gameobjectup",
//       function(pointer, gameObject) {
//         gameObject.emit("clicked", gameObject);
//       },
//       self
//     );

//     for (let i = 0; i < 4; i++) {
//       let card = self.add
//         .image(scale + scale * i * 2 + 5, 550, "card")
//         .setScale(0.35);

//       card.setInteractive().on("clicked", clickHandler, self);
//       // console.log(Node.value.answersList[i]);

//       let cardText = self.add.text(
//         scale + scale * i * 2 - 4,
//         540,
//         Node.value.answersList[i].answer,
//         { fontFamily: '"Roboto Condensed"', fontSize: 24, color: "#000000" }
//       );
//       textArray.push(cardText);
//     }

//     scrollEmpty = self.add.image(400, 100, "scroll").setScale(0.15); // p1 = this.add.image (300,300,'cake').setScale(0.25);
//     questionText = self.add.text(300, 90, Node.value.getQuestion(), {
//       fontFamily: '"Roboto Condensed"',
//       fontSize: 36,
//       color: "#000000"
//     });

//     return {
//       eh: ehhh,
//       questionCard: scrollEmpty,
//       questionText: questionText,
//       cardArray: emptyCardArray,
//       answerArray: textArray
//     };
//   }
// } /////

// function removeQuestionAnswer() {
//   for (let i = 0; i < globalFlashcard.cardArray.length; i++) {
//     // console.log(globalFlashcard.cardArray[i]);
//     globalFlashcard.cardArray[i].destroy();
//   }

//   for (let i = 0; i < globalFlashcard.answerArray.length; i++) {
//     globalFlashcard.answerArray[i].destroy();
//   }
//   globalFlashcard.questionText.destroy();
//   globalFlashcard.questionCard.destroy();
//   globalFlashcard.questionCard.destroy();
//   //   globalFlashcard.eh.destroy();
//   globalFlashcard = null;
// }
