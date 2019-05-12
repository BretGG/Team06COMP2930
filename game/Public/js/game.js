var question;
var myPlayerSocket;
var thisSprite;
var Node0;
var playersArray = [];
//number of players in the room.
var noOfPlayers;
var noOfPlayersText;
var emptyCard;
var width = 800;
var height = 600;
var self;
var smallPlatform, bigPlatform;
var platform1, platform2, platform3;
var cursors;
var scroll;
var player1, player2, player3;
//To be changed to true if they are connected to server.
player1 = false;
player2 = false;
player3 = false;
var globalFlashCard, globalTurnFinished;
var questionList;
///////////////////////////////////////////////////////////////////////////////
//////////////Should probably be in a different file///////////////////////////
///////////////////////////////////////////////////////////////////////////////


class NodeHolder {
  constructor(value) {
     this.previous = null;
    this.value = value;
    this.next = this.value.next;
  }
  updateToNextValue(){
      this.previous = this.value;
      this.value = this.value.next;
      this.next = this.value.next;
  }
  getValue(){
      return this.value;
  }
}
class Node{
    constructor(value, nextNode){
        this.value = value;
        this.next = nextNode;
    }
}



//
class qandA {
    constructor(question, answer){
        this.question = question;
        this.answersList = [answer];
          this.getQuestion = function() {return this.question;};

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
    addDummy(dummy) {
                console.log("dummy" + dummy.answer);

        this.answersList.push(dummy);
        let tempArray = [];
        while (this.answersList.length != 0) {
            let randIndex = Math.floor(Math.random() * this.answersList.length);
            tempArray.push(this.answersList[randIndex]);
            this.answersList.splice(randIndex, 1);
        }
        this.answersList = tempArray;
        console.log(this.answersList);
    }
    
}
////////////////////////////////////////////////
class answers {
    constructor(text, correct){
        this.answer = text;
        this.correct = correct;    
    };
    
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

    let card1 = new answers("1", false);
    let card2 = new answers("2", false);
    let card3 = new answers("3", false);
    let card4 = new  answers("4", true);
    let questionAnswer1 = new qandA("What is 2 + 2", card4);
    questionAnswer1.addDummy(card1);
    questionAnswer1.addDummy(card2);
    questionAnswer1.addDummy(card3);
    let card11 =  new answers("1", false);
    let card22 = new  answers("2", true);
    let card33 = new  answers("3", false);
    let card44 = new     answers("4", false);
    let questionAnswer2 = new qandA("What is 1 + 1", card44);
    questionAnswer2.addDummy(card11);
    questionAnswer2.addDummy(card22);
    questionAnswer2.addDummy(card33);

    let card111 = new  answers("1", true);
    let card222 =  new answers("2", false);
    let card333 = new  answers("3", false);
    let card444 = new  answers("4", false);
    let questionAnswer3 = new qandA("What is 1 + 0", card444);
    questionAnswer3.addDummy(card111);
    questionAnswer3.addDummy(card222);
    questionAnswer3.addDummy(card333);
    
     Node0 = new Node( questionAnswer1, null);
    let Node1 = new Node( questionAnswer2, null);
    let Node2 = new Node( questionAnswer3, null);

    Node0.next = Node1;
    Node1.next = Node2;
    Node2.next = -1;
    questionList = new NodeHolder(Node0);
    
    
    
    
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
    scroll = this.load.image("scroll", "../assets/character/scroll.png");
    emptyCard = this.load.image("card", "../assets/character/empty_card.png");

};

function create() {
    /// connected A901
    this.socket = io();
    this.opponentPlayers = this.physics.add.group();
    cursors = this.input.keyboard.createCursorKeys();
    self = this;
    startGame();
    // setting the backgroubnd imagedela
    this.add.image(000, 00, "sky").setOrigin(0).setDisplaySize(800, 600);
    //invisible platforms for players to stand on.

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
        console.log("ins ide newplayer"); //never ran
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
    
    globalFlashcard = createQuestionAnswer(this, questionList.getValue());
    globalTurnFinished = false;
    //  If a Game Object is clicked on, this event is fired.
    //  We can use it to emit the 'clicked' event on the game object itself.


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
///1
    if(box.isItCorrect){
        box.setTint(0x00FF00);
        self.time.delayedCall(1500, callbackEvent);

        
    }else{
        box.setTint(0xFF0000);
        thisSprite.y += 32;
    }
}
///2
function callbackEvent ()
{
        globalTurnFinished = true;
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
    
        if (globalTurnFinished){
           afterGlobalTurnFinished();
        }
    
}
function afterGlobalTurnFinished(){
            removeQuestionAnswer();
            globalTurnFinished = false;
            globalFlashCard = null;
            questionList.updateToNextValue();
            
            globalFlashcard = createQuestionAnswer(self, questionList.getValue());
    
}

function opponentGraphicChooser(selff, opponentInfo) {
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

function createQuestionAnswer(self, Node){
    if (Node == -1){
            let cardText =  self.add.text(100, 100, "END OF FLASHCARDS", { fontFamily: '"Roboto Condensed"', fontSize: 55, color:'#000000'});

    } else{
        
    
    let scrollEmpty;
    let questionText;
    let emptyCardArray = []
    let textArray = [];
    let scale = (width /  Node.value.answersList.length)
        - ((width /  Node.value.answersList.length)/2);
        
    let ehhh = self.input.on('gameobjectup', function(pointer, gameObject) {
        gameObject.emit('clicked', gameObject);
        
    }, self);
    
    
    
    for (let i  = 0; i < Node.value.answersList.length; i++){
        let card = self.add.image(scale + (scale * i * 2) + 5, 550, 'card').setScale(.35);
       
        card.isItCorrect = Node.value.answersList[i].correct;
        emptyCardArray.push(card);
        card.setInteractive().on('clicked', clickHandler, self);
       // console.log(Node.value.answersList[i]);
    
    let cardText =  self.add.text(scale + (scale * i * 2) - 4, 540, Node.value.answersList[i].answer, { fontFamily: '"Roboto Condensed"', fontSize: 24, color:'#000000'});
        textArray.push(cardText)
    }

    scrollEmpty = self.add.image(400, 100, 'scroll').setScale(.15); // p1 = this.add.image (300,300,'cake').setScale(0.25);
    questionText = self.add.text(300, 90, Node.value.getQuestion(), {fontFamily: '"Roboto Condensed"', fontSize: 36, color:'#000000' });
    

    return {
            eh: ehhh,
            questionCard: scrollEmpty, 
            questionText: questionText,
            cardArray: emptyCardArray,
            answerArray: textArray
    };
    }
    
}
function removeQuestionAnswer(){

    for (let i = 0; i < globalFlashcard.cardArray.length; i++){
       console.log(globalFlashcard.cardArray[i]);
       globalFlashcard.cardArray[i].destroy();
    }
    
    for (let i = 0; i < globalFlashcard.answerArray.length; i++){
        globalFlashcard.answerArray[i].destroy();
    }
    globalFlashcard.questionText.destroy();
    globalFlashcard.questionCard.destroy();
    globalFlashcard.questionCard.destroy();
 //   globalFlashcard.eh.destroy();
    globalFlashcard = null;

}
