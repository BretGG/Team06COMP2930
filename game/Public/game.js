var question,  numOfPlayers;
var smallPlatform, bigPlatform, p1, p2, p3, p1cursor, p2cursor, p3cursor;
var platform1, platform2, platform3;
var cursors;
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
        width: 400,
        height: 400
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

function preload() {
    // this.load.setBaseURL("http://labs.phaser.io");
        this.load.image("sky", "assets/backgrounds/sky.png");
    this.load.image("peach", "assets/static/peach.png");
    this.load.image("cake", "assets/static/cake.png");
    this.load.image("platform", "assets/dynamic/platform.png");
    this.load.image("scroll", "assets/dynamic/scroll.png");
    this.load.image("card", "assets/dynamic/empty_card.png");


}

function create() {
    // setting the backgroubnd image
    this.add.image(000, 00, "sky").setOrigin(0).setDisplaySize(400, 400);
    //invisible platforms for players to stand on.
    this.add.image(200, 200, 'scroll').setScale(.3);

    cursors = this.input.keyboard.createCursorKeys();
    p1 = this.add.image(200, 350, 'cake').setScale(0.5);

    var card1 = this.add.image(330, 400, 'card').setScale(.9);
    card1.setInteractive();
    card1.on('clicked', clickHandler, this);

    var card2 = this.add.image(230, 300, 'card').setScale(.9);
    card2.setInteractive();
    card2.on('clicked', clickHandler, this);

    var card3 = this.add.image(330, 100, 'card').setScale(.9);
    card3.setInteractive();
    card3.on('clicked', clickHandler, this);


    //  If a Game Object is clicked on, this event is fired.
    //  We can use it to emit the 'clicked' event on the game object itself.
    this.input.on('gameobjectup', function (pointer, gameObject)
    {
        gameObject.emit('clicked', gameObject);
    }, this);

    //  Display the game stats
  



}

////////////////////////click handler////////////////////
function clickHandler (box)
{ 
    p1.y += 32;
}
////////////////////////////////////////////////////////



function update(){
 if (this.input.keyboard.checkDown(cursors.left, 250))
    {
        p1.x -= 32;
    }
    else if (this.input.keyboard.checkDown(cursors.right, 250))
    {
        p1.x += 32;
    }

    //  Vertical movement every 150ms
    if (this.input.keyboard.checkDown(cursors.up, 150))
    {
        p1.y -= 32;
    }
    else if (this.input.keyboard.checkDown(cursors.down, 150))
    {
        p1.y += 32;
    }
}


var game = new Phaser.Game(config);
