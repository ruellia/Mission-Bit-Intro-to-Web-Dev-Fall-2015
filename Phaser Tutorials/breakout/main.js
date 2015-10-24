//Defines main state
var main = {
    
    //function that executes at the beginning of the game
    //so we load our assets here
    preload: function() {
        //loads paddle image
        game.load.image('paddle', 'assets/paddle.png');
        
        //loads the brick sprite
        game.load.image('brick', 'assets/brick.png');
        
        //loads the ball sprite
        game.load.image('ball', 'assets/ball.png');
    },

    //function that's called after the preload function
    //where we setup the basics of the game by displaying sprites etc
    create: function() {
        //initializes physics system for the game
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //creates a variable that handles the arrow keys
        this.cursor = game.input.keyboard.createCursorKeys();
        
        //makes paddle appear at the bottom of the screen
        this.paddle = game.add.sprite(200, 400, 'paddle');
        
        //enables the physics system for the paddle
        game.physics.arcade.enable(this.paddle);
        
        //makes sure the paddle doesn't move when it's hit by the ball
        this.paddle.body.immovable = true;
        
        //make it so the paddle can't leave the screen
        this.paddle.body.collideWorldBounds = true;
        
        //creates a group that will contain all the bricks
        this.bricks = game.add.group();
        
        //desc
        this.bricks.enableBody = true;
        
        //creates the 16 bricks in the appropriate places
        for (var i = 0; i <5; i++) {
            for (var j = 0; j < 5; j++) {
                game.add.sprite(55+i*60, 55+j*35, 'brick', 0, this.bricks);
            }
        } 

        //make bricks immovable when hit
        this.bricks.setAll('body.immovable', true);  
        
        //creates the ball
        this.ball = game.add.sprite(200, 300, 'ball');
        
        //enables the physics system for the ball
        game.physics.arcade.enable(this.ball);
        
        //add velocity to the ball
        this.ball.body.velocity.x = 200;
        this.ball.body.velocity.y = 200;
        
        //makes the ball bouncy
        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.x = 1;
        this.ball.body.bounce.y = 1;
    
    },
    
    
    //function that is called 60 times per second
    //where we put the logic of the game
    update: function() {
        //if the right arrow is pressed, move to the right
        if (this.cursor.right.isDown) {
            this.paddle.body.velocity.x = 350;
        } else if (this.cursor.left.isDown) { //if the left arrow is pressed, move to the left
            this.paddle.body.velocity.x = -350;
        } else { //if neither is pressed, stop moving
            this.paddle.body.velocity.x = 0;
        }
        
        //make the paddle and the ball collidable with each other
        game.physics.arcade.collide(this.paddle, this.ball);
        
        //makes the ball and the bricks collidable with each other
        //and calls the "hit" function when they collide
        game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);
    },
    
    hit: function (ball, brick) {
        //when the ball hits the brick, erase the brick from the game
        brick.kill();
    }
    
};

//initializes Phaser and starts the main state
var game = new Phaser.Game(400, 450, Phaser.AUTO, 'gameDiv');
game.state.add('main', main);
game.state.start('main');