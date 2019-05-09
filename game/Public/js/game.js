var question;
var myPlayerSocket;
var thisSprite;
var playersArray = [];
//number of players in the room.
var noOfPlayers;
var noOfPlayersText;


var smallPlatform, bigPlatform;
var platform1, platform2, platform3;
var cursors;


var player1, player2, player3;
//To be changed to true if they are connected to server.
player1 = false;
player2 = false;
player3 = false;


///////////////////////////////////////////////////////////////////////////////
//////////////Should probably be in a different file///////////////////////////
///////////////////////////////////////////////////////////////////////////////
function qandA(question, answer) {
    this.question = question;
    this.answersList = [answer];

    function getQuestion() {
        return this.question;
    }
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
    function addDummy(dummy) {
        answersList.push(dummy);
        let tempArray = [];
        while (this.answersList.length != 0) {
            let randIndex = Math.floor(Math.random() * this.answersList.length);
            tempArray.push(answersList[randIndex]);
            answersList.splice(randomIndex, 1);
        }
        this.answersList = tempArray;
    }
}
////////////////////////////////////////////////
function answers(text, correct) {
    this.answer = text;
    this.correct = correct;
}
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

function startGame() {
    p1 = player("rose", true);
    p2 = player("jessica", true);
    p2 = player("hannah", true);
    p4 = player("stella", true);
    playerList = {
        p1,
        p2,
        p3,
        p4
    };
    let card1 = answers("1", false);
    let card2 = answers("2", false);
    let card3 = answers("3", false);
    let card4 = answers("4", true);
    questionAnswer = new qandA("What is 2 + 2", card4);
    questionAnswer.addDummy(card1);
    questionAnswer.addDummy(card2);
    questionAnswer.addDummy(card3);
}


////////////////////////////////

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);


function preload() {
    // this.load.setBaseURL("http://labs.phaser.io");
    this.load.image("sky", "../assets/backgrounds/sky.png");
    this.load.image("cake", "../assets/character/cake.png");
    this.load.image("p1", "../assets/character/dratini.png");
    this.load.image("p2", "../assets/character/eevee.png");
    this.load.image("p3", "../assets/character/pikachu.png");
    this.load.image("p4", "../assets/character/rapidash.png");

    this.load.image('otherPlayer', 'assets/character/cake.png');
    this.load.image("platform", "../assets/character/platform.png");
    this.load.image("scroll", "../assets/character/scroll.png");
    this.load.image("card", "../assets/character/empty_card.png");

};

function create() {
    /// connected A901
    this.socket = io();
    this.opponentPlayers = this.physics.add.group();
    cursors = this.input.keyboard.createCursorKeys();
    var self = this;
    // setting the backgroubnd image
    this.add.image(000, 00, "sky").setOrigin(0).setDisplaySize(800, 600);
    //invisible platforms for players to stand on.
    this.add.image(400, 100, 'scroll').setScale(.15); // p1 = this.add.image (300,300,'cake').setScale(0.25);

    this.socket.on('currentPlayers', function(players) {
        console.log(players);
        Object.keys(players).forEach(function(id) {
            playersArray = players;
        //    console.log(id);
            if (players[id].playerId === self.socket.id) {
                //global variable for own character
                playersArray[self.socket.id].sprite = thisSprite;
                //global variable to save the self.socket.id
                myPlayerSocket = self.socket.id;
                thisSprite = myCharacterChooser(self, playersArray[id]);

            } else {
                let opponentGraphic = opponentGraphicChooser(self, playersArray[id]);
                //updateSpriteGroup(self.opponentPlayers, opponentGraphic, playersArray[id]);
            }
        });
    });

    ///A6 receives player object in a call back function and calls at other players. to show it. 
    this.socket.on('newPlayer', function(newOpponentInfo) {
        console.log("inside newplayer"); //never ran
        playersArray[newOpponentInfo.playerId] = newOpponentInfo;
        let graphic = opponentGraphicChooser(self, newOpponentInfo);
      //  updateSpriteGroup(self.opponentPlayers, graphic, newOpponentInfo);
    });

    this.socket.on('disconnect', function(playerId) {
        self.opponentPlayers.getChildren().forEach(function(opponent) {
            if (playerId === opponent.playerId) {
                playersArray[playerId].sprite.destroy();
                delete playersArray[playerId];
            }
        });
    });
    
    this.socket.on('playerMoved', function(movementData) {
        //  console.log("inside plyaer moved");
        self.opponentPlayers.getChildren().forEach(function(opponent) {
            //console.log("inside plyaer moved");

            if (movementData.playerId === opponent.playerId) {
                // otherPlayer.setRotation(playerInfo.rotation);
                //     console.log("inside plyaer moved");
                opponent.setPosition(movementData.x, movementData.y);
                //console.log("inside plyaer moved");
            }
        });
    });
    

    var card1 = this.add.image(165, 550, 'card').setScale(.45);
    card1.setInteractive().on('clicked', clickHandler, this);

    var card2 = this.add.image(415, 550, 'card').setScale(.45);
    card2.setInteractive().on('clicked', clickHandler, this);

    var card3 = this.add.image(670, 550, 'card').setScale(.45);
    card3.setInteractive().on('clicked', clickHandler, this);

    //  If a Game Object is clicked on, this event is fired.
    //  We can use it to emit the 'clicked' event on the game object itself.
    this.input.on('gameobjectup', function(pointer, gameObject) {
        gameObject.emit('clicked', gameObject);
    }, this);

}

function scoreAndPlayer() {
    scoreText = this.add.text(16, 16, 'score: 0', {
        fontSize: '32px',
        fill: '#000'
    });

}

////////////////////////click handler////////////////////
function clickHandler(box) {
    console.log("card clicked");
    // player.y += 32;
    if (thisSprite) {
        thisSprite.y += 32;
    }
}
////////////////////////////////////////////////////////
///A12 it emits new X and Y coordinates 
function update() {
    if (thisSprite) {
        if (this.input.keyboard.checkDown(cursors.left, 250)) {
            thisSprite.x -= 32;
        } else if (this.input.keyboard.checkDown(cursors.right, 250)) {
            thisSprite.x += 32;
        }
        //  Vertical movement every 150ms
        if (this.input.keyboard.checkDown(cursors.up, 150)) {
            thisSprite.y -= 32;
        } else if (this.input.keyboard.checkDown(cursors.down, 150)) {
            thisSprite.y += 32;
        }
        this.socket.emit('playerMovement', {
            x: thisSprite.x,
            y: thisSprite.y
        });
    }
    //console.log(playersArray[myPlayerSocket]);
}

function opponentGraphicChooser(self, opponentInfo) {
    let playerVisual;
    switch (opponentInfo.playerNo) {
        case 1:
            playerVisual = self.add.sprite(opponentInfo.x, opponentInfo.y, 'p2').setScale(0.25);
            break;
        case 2:
            playerVisual = self.add.sprite(opponentInfo.x, opponentInfo.y, 'p3').setScale(0.25);
            break;
        case 3:
            playerVisual = self.add.sprite(opponentInfo.x, opponentInfo.y, 'p4').setScale(0.25);
            break;
        default:
            playerVisual = self.add.sprite(opponentInfo.x, opponentInfo.y, 'p1').setScale(0.25);
    }
    //add sprite attribute to access srpite in the array. 
    opponentInfo.sprite = playerVisual;
    //adding attributes to the sprite.
    playerVisual.playerId = opponentInfo.playerId;
    playerVisual.playerNo = opponentInfo.playerNo;
   // opponentPlayers.add(picture);
    self.opponentPlayers.add(playerVisual);
    return playerVisual;
}

function myCharacterChooser(self, playerInfo) {
    let picture;
    switch (playerInfo.playerNo) {
        case 1:
            picture = self.physics.add.image(playerInfo.x, playerInfo.y, 'p2').setScale(0.25);
            break;
        case 2:
            picture = self.physics.add.image(playerInfo.x, playerInfo.y, 'p3').setScale(0.25);
            break;
        case 3:
            picture = self.physics.add.image(playerInfo.x, playerInfo.y, 'p4').setScale(0.25);
            break;
        default:
            picture = self.physics.add.image(playerInfo.x, playerInfo.y, 'p1').setScale(0.25);
    }
    return picture;
}