var question,  numOfPlayers;
var smallPlatform, bigPlatform, playercursor, p2cursor, p3cursor;
var platform1, platform2, platform3;
var cursors;
var p1;
//flashcard class that creates
var Game = {};
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
    }
};

Game.preload = function() {
    // this.load.setBaseURL("http://labs.phaser.io");
    this.load.image("sky", "../assets/backgrounds/sky.png");
    this.load.image("peach", "../assets/character/peach.png");
    this.load.image("cake", "../assets/character/cake.png");
    this.load.image("platform", "../assets/character/platform.png");
    this.load.image("scroll", "../assets/character/scroll.png");
    this.load.image("card", "../assets/character/empty_card.png");


};

Game.create = function() {
    Game.playerMap={};
    // setting the backgroubnd image
    this.add.image(000, 00, "sky").setOrigin(0).setDisplaySize(800, 600);
    //invisible platforms for players to stand on.
    this.add.image(400, 100, 'scroll').setScale(.15);
    p1 = this.add.image (300,300,'cake').setScale(0.25);
    cursors = this.input.keyboard.createCursorKeys();
    // player = this.add.image(200, 350, 'cake').setScale(0.5);

    // p2.hidden();

    var card1 = this.add.image(165, 550, 'card').setScale(.45);
    card1.setInteractive();
    card1.on('clicked', Game.clickHandler, this);

    var card2 = this.add.image(415, 550, 'card').setScale(.45);
    card2.setInteractive();
    card2.on('clicked', Game.clickHandler, this);

    var card3 = this.add.image(670, 550, 'card').setScale(.45);
    card3.setInteractive();
    card3.on('clicked', Game.clickHandler, this);
    //  If a Game Object is clicked on, this event is fired.
    //  We can use it to emit the 'clicked' event on the game object itself.
    this.input.on('gameobjectup', function (pointer, gameObject)
    {
        gameObject.emit('clicked', gameObject);
    }, this);
    Client.askNewPlayer();
    //  Display the game stats




};

Game.addNewPlayer = function(id,x,y){
  Game.playerMap[id] = this.add.image(x, y, 'cake').setScale(0.25);

};
////////////////////////click handler////////////////////
Game.clickHandler = function(id,x,y)
{
  var player = Game.playerMap[id];
    // player.y += 32;
    console.log(Game.playerMap[0]);
};
////////////////////////////////////////////////////////



// Game.update = function(id,x,y){
//   var player = Game.playerMap[id];
//  if (this.input.keyboard.checkDown(cursors.left, 250))
//     {
//         player.x -= 16;
//     }
//     else if (this.input.keyboard.checkDown(cursors.right, 250))
//     {
//         player.x += 16;
//     }
//
//     //  Vertical movement every 150ms
//     if (this.input.keyboard.checkDown(cursors.up, 150))
//     {
//         player.y -= 16;
//     }
//     else if (this.input.keyboard.checkDown(cursors.down, 150))
//     {
//         player.y += 16;
//     }
// };

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

var game = new Phaser.Game(config);
game.scene.add('Game',Game);
game.scene.start('Game');
