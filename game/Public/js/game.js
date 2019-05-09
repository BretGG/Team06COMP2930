var question;

var smallPlatform, bigPlatform;
var platform1, platform2, platform3;
var cursors;


var player1, player2, player3;
//To be changed to true if they are connected to server.
player1=false;
player2=false;
player3=false;



//flashcard class that creates

function Flashcard(text, answer) {
  this.text = text,
  this.answer = answer,

  function getText(){
    return this.text;
  }

  function getAnswer() {
    return this.answer;
  }
}


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
      gravity: { y: 0 },
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
  this.load.image('opponentPlayer', 'assets/character/cake.png');
  this.load.image("platform", "../assets/character/platform.png");
  this.load.image("scroll", "../assets/character/scroll.png");
  this.load.image("card", "../assets/character/empty_card.png");


};

function create() {

  this.socket = io();
  this.opponentPlayers = this.physics.add.group();
  cursors = this.input.keyboard.createCursorKeys();
  var self = this;
  // setting the backgroubnd image
  this.add.image(000, 00, "sky").setOrigin(0).setDisplaySize(800, 600);
  //invisible platforms for players to stand on.
  this.add.image(400, 100, 'scroll').setScale(.15);
  // p1 = this.add.image (300,300,'cake').setScale(0.25);

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      console.log(id);
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        console.log("inside currentPlayers");
        addopponentPlayers(self, players[id]);
      }
    });
  });

  this.socket.on('newPlayer', function (playerInfo) {
    console.log("inside newplayer");//never ran
    addopponentPlayers(self, playerInfo);
  });

  this.socket.on('disconnect', function (playerId) {
    self.opponentPlayers.getChildren().forEach(function (opponentPlayer) {
      if (playerId === opponentPlayer.playerId) {
        opponentPlayer.destroy();
      }
    });
  });
  this.socket.on('playerMoved', function (playerInfo) {
    self.opponentPlayers.getChildren().forEach(function (opponentPlayer) {
      if (playerInfo.playerId === opponentPlayer.playerId) {
        // opponentPlayer.setRotation(playerInfo.rotation);
        opponentPlayer.setPosition(playerInfo.x, playerInfo.y);
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
  this.input.on('gameobjectup', function (pointer, gameObject)
  {
    gameObject.emit('clicked', gameObject);
  }, this);

}

function addPlayer(self, playerInfo) {
  self.cake = self.physics.add.image(playerInfo.x, playerInfo.y, 'cake').setScale(0.25);
}

function addopponentPlayers(self, playerInfo) {
  console.log("addopponentPlayers called");
  const opponentPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'opponentPlayer').setScale(0.25);
  // if (playerInfo.team === 'blue') {
  //   opponentPlayer.setTint(0x0000ff);
  // } else {
  //   opponentPlayer.setTint(0xff0000);
  // }
  opponentPlayer.playerId = playerInfo.playerId;
  self.opponentPlayers.add(opponentPlayer);
}



////////////////////////click handler////////////////////
function clickHandler(box)
{
  console.log("card clicked");
  // player.y += 32;
  if(this.cake){
    this.cake.y += 32;
  }
}
////////////////////////////////////////////////////////
function update(){
  if(this.cake){
    if (this.input.keyboard.checkDown(cursors.left, 250))
    {
      this.cake.x -= 32;
    }
    else if (this.input.keyboard.checkDown(cursors.right, 250))
    {
      this.cake.x += 32;
    }

    //  Vertical movement every 150ms
    if (this.input.keyboard.checkDown(cursors.up, 150))
    {
      this.cake.y -= 32;
    }
    else if (this.input.keyboard.checkDown(cursors.down, 150))
    {
      this.cake.y += 32;
    }
    this.socket.emit('playerMovement', { x: this.cake.x, y: this.cake.y});
  }

}
