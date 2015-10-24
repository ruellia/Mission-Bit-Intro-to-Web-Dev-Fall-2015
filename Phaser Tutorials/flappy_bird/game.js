/*global Phaser*/
/*jslint sloppy:true, browser: true, devel: true, eqeq: true, vars: true, white: true*/

//creates a new pipe pair
var makePipePair = function(group, offsetX, newOffsetX) {
    //adds new topPipe to the group
    var top = group.create(0, 0, 'topPipe');
    
    //adds new bottomPipe to the group
    var bottom = group.create(0, 0, 'bottomPipe');

    //sets the origin point of the top pipe to the top right part of the scrren
    top.anchor.set(0, 1);

    //enables physics in the top pipe
    addPhysics(top);
    
    //enables physics in the bottom pipe
    addPhysics(bottom);
    
    //positions the pipes randomly
    positionPipes(top, bottom);
    
    //and pushes them more forward than the last pair
    top.x += offsetX;
    bottom.x += offsetX;
    
    //checks if the top pipe is within the screen
    top.checkWorldBounds = true;
    
    //if it's not, readjust pipe positions
    top.events.onOutOfBounds.add(function () {
        if (top.x < 0) {
            positionPipes(top, bottom);
            top.x += newOffsetX - top.width / 2;
            bottom.x += newOffsetX - bottom.width / 2;
        }
    });
}

//adds physics to given pipe
 var addPhysics = function(pipe) {

    //enables physicsc in the pipe
    game.physics.enable(pipe);
     
    //makes it so the pipe doesn't move if hit
    pipe.body.immovable = true;
    
    //makes it so the pipe doesn't adhere to gravity
    pipe.body.allowGravity = false;
     
    //pans the pipes to the left for the illusion of speed
    pipe.body.velocity.x = -200;
}
    
//positions given pipes
var positionPipes = function(top, bottom) {
    
    //make center random to an extent
    var center = game.rnd.integerInRange(30, game.world.height - 50);
    
    //sets left to the width of the screen
    var left = game.world.width;
    
    //assigns x coordinate of the pipes to left
    top.x = left;
    bottom.x = left;
    
    //assigns their y coordinates to random centert point
    top.y = center - 100;
    bottom.y = center + 100;
}

var mainState = {
    // Here we add all the functions we need for our state
    // For this project we will just have 3 functions
    preload: function () {
        // This function will be executed at the beginning
        // That's where we load the game's assets
        
        //loads the bird spritesheet
        game.load.spritesheet('bird', 'assets/bird_sheet.png', 68, 48);
        
        //loads the floor image
        game.load.image('floor', 'assets/floor.png');
        
        //loads the topPipe image
        game.load.image('topPipe', 'assets/pipe_top.png');
        
        //loads the bottomPipe image
        game.load.image('bottomPipe', 'assets/pipe_bottom.png');
        
        //loads the background image
        game.load.image('bg', 'assets/back.png');
        
    },
    create: function () {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.
        
        //adds the background into the game
        this.bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bg');
        
        //zooms the floor out 50%
        this.bg.tileScale.set(0.4);
        
        // Create a game sprite from the bird image positioned
        // at the center of the game world
        this.sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'bird');
        
        // The position of the sprite should be based on the
        // center of the image (default is top-left)
        this.sprite.anchor.setTo(0.5, 0.5);
        
        //defines a flapping animation
        this.sprite.animations.add('flap', [0,1,2,1], 10, true);
        
        //plays the flapping animation constantly
        this.sprite.animations.play('flap');
        
        //enables physics for the bird
        game.physics.enable(this.sprite);
        
        //sets gravity value for the bird
        game.physics.arcade.gravity.y = 125;
        
        // Stop the bird from falling off the screen, for now
        this.sprite.body.collideWorldBounds = true;
        
        // keep space from scrolling the page
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        
        //adds the floor into the game
        this.floor = game.add.tileSprite(0, game.world.height - 40, game.world.width, game.world.height, 'floor');
        
        //zooms the floor out 50%
        this.floor.tileScale.set(0.5);
        
        //creates a group of obstacles
        this.obstacles = game.add.group();
        
        //adds the floor into the obstacle group
        this.obstacles.add(this.floor);
        
        //enables physics for the floor
        game.physics.enable(this.floor);
        
        //makes it so the floor won't move when the bird hits it
        this.floor.body.immovable = true;
        
        //makes it so the floor doesn't adhere to gravity
        this.floor.body.allowGravity = false;
        
        for (var i = 0; i < 10; i++) {
            makePipePair(this.obstacles, i * 400, 400 * 10 - game.world.width);
        }
        
    },
    
    update: function () {
        // This function is called 60 times per second
        // It contains the game's logic
        
        //pans through the floor so it looks like it's moving
        this.floor.tilePosition.x -= 50;
        
        //changes the bird's velocity when the space key is pressed
        if (this.spaceKey.justDown) {
            this.sprite.body.velocity.y = -100;
        }
        
        //pauses the game if the bird touches the floor
        if (game.physics.arcade.collide(this.sprite, this.obstacles)) {
            console.log('Game over!');
            game.paused = true;
        }
        
    }
};

// Initialize Phaser
var game = new Phaser.Game(640, 480, Phaser.AUTO, 'gameDiv');

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');