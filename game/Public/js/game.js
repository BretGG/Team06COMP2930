var question,  numOfPlayers;
var smallPlatform, bigPlatform, playercursor, p2cursor, p3cursor;
var platform1, platform2, platform3;
var cursors;
var p1;
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
  this.load.image('otherPlayer', 'assets/character/cake.png');
  this.load.image("platform", "../assets/character/platform.png");
  this.load.image("scroll", "../assets/character/scroll.png");
  this.load.image("card", "../assets/character/empty_card.png");


};

function create() {
  this.socket = io();
  this.otherPlayers = this.physics.add.group();
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
        addOtherPlayers(self, players[id]);
      }
    });
  });

  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });

  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });
  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        // otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });

  var card1 = this.add.image(165, 550, 'card').setScale(.45);
  card1.setInteractive();
  card1.on('clicked', clickHandler, this);

  var card2 = this.add.image(415, 550, 'card').setScale(.45);
  card2.setInteractive();
  card2.on('clicked', clickHandler, this);

  var card3 = this.add.image(670, 550, 'card').setScale(.45);
  card3.setInteractive();
  card3.on('clicked', clickHandler, this);

}

function addPlayer(self, playerInfo) {
  self.cake = self.physics.add.image(playerInfo.x, playerInfo.y, 'cake').setScale(0.25);
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setScale(0.25);
  // if (playerInfo.team === 'blue') {
  //   otherPlayer.setTint(0x0000ff);
  // } else {
  //   otherPlayer.setTint(0xff0000);
  // }
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
}



////////////////////////click handler////////////////////
function clickHandler(box)
{
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
