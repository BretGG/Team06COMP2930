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

function preload() {
    // this.load.setBaseURL("http://labs.phaser.io");
        this.load.image("sky", "assets/backgrounds/sky.png");
    this.load.image("peach", "assets/static/peach.png");
    this.load.image("cake", "assets/static/cake.png");
    this.load.image("platform", "assets/dynamic/platform.png");
    this.load.image("scroll", "assets/dynamic/scroll.png");


}

function create() {
    
    // setting the backgroubnd image
    this.add.image(000, 00, "sky").setOrigin(0).setDisplaySize(800, 600);
    //invisible platforms for players to stand on.
   cursors = this.input.keyboard.createCursorKeys();
    p1 = this.add.image(400, 300, 'cake').setScale(0.4);
  


}

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
