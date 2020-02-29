var pos, //position of player
    or = 0, //rotation of player
    v = 0, //velocity of player
    orV = 0, //turning speed of player
    shipPoint, //location of the point of the ship
    projectiles = [], //projectiles the player fires
    asteroids = [], //asteroids
    score = 0, //yeah
    scoreboard = [new SevDisplay(3,0), new SevDisplay(2,0), new SevDisplay(1,0), new SevDisplay(0,0)], //score display in top left
    nameLabel, //says NAME if you get a leaderboard spot
    gameOverLabel, //GAME OVER
    lives = 3, //yeah
    highs = [{name: "",score: "0000"}, //blank leaderboard
             {name: "",score: "0000"},
             {name: "",score: "0000"}],
    leaderboard = [], //display for leaderboard
    numDisplay, //displays 1, 2, 3
    acceptingInput = false, //whether a name is being typed
    written = false, //whether a name has been submitted
    name = "", //placeholder playername
    nameDisp = []; //display for the player's name


function Projectile(location, orientation) { //class for projectiles
    this.pos = location;
    this.or = orientation;
}

function SevDisplay(power,row,col=0) { //class for 7 (and 14) segment display emulation
    this.pow = power; //place value represented by a segment display
    this.row = row; //Y and X location respectively
    this.col = col;
    this.show = function() { //display a digit (7 digit)
        let digit = floor(score/pow(10,this.pow))%10;
        if([0,2,3,5,6,7,8,9].includes(digit)) { //1
            line(20+25*(3-this.pow),20 + 25*this.row,40+25*(3-this.pow),20 + 25*this.row);
        }
        if([0,4,5,6,8,9].includes(digit)) { //2
            line(20+25*(3-this.pow),20 + 25*this.row,20+25*(3-this.pow),40 + 25*this.row);
        }
        if([0,1,2,3,4,7,8,9].includes(digit)) { //3
            line(40+25*(3-this.pow),20 + 25*this.row,40+25*(3-this.pow),40 + 25*this.row);
        }
        if([2,3,4,5,6,8,9].includes(digit)) { //4
            line(20+25*(3-this.pow),40 + 25*this.row,40+25*(3-this.pow),40 + 25*this.row);
        }
        if([0,2,6,8].includes(digit)) { //5
            line(20+25*(3-this.pow),40 + 25*this.row,20+25*(3-this.pow),60 + 25*this.row);
        }
        if([0,1,3,4,5,6,7,8,9].includes(digit)) { //6
            line(40+25*(3-this.pow),40 + 25*this.row,40+25*(3-this.pow),60 + 25*this.row);
        }
        if([0,2,3,5,6,8,9].includes(digit)) { //7
            line(20+25*(3-this.pow),60 + 25*this.row,40+25*(3-this.pow),60 + 25*this.row);
        }
        if([0].includes(digit)) {
            line(20+25*(3-this.pow),60+25*this.row,40+25*(3-this.pow), 20+25*this.row);
        }
    }
    this.alphShow = function(text) { //display text (14 segment display)
        let char = text[text.length - this.pow];
        if(["A","B","C","D","E","F","G","I","O","P","Q","R","S","T","Z","0","2","3","5","6","7","8","9"].includes(char)) { //1
            line(20+25*this.col ,20+25*this.row,40+25*this.col ,20+25*this.row);
        }
        if(["A","C","E","F","G","H","K","L","M","N","O","P","Q","R","U","V","W","0","4","5","6","8","9"].includes(char)) { //2
            line(20+25*this.col ,20+25*this.row,20+25*this.col ,40+25*this.row);
        }
        if(["M","N","S","X","Y"].includes(char)) { //3
            line(20+25*this.col ,20+25*this.row,30+25*this.col ,40+25*this.row);
        }
        if(["B","D","I","T"].includes(char)) { //4
            line(30+25*this.col ,20+25*this.row,30+25*this.col ,40+25*this.row);
        }
        if(["K","M","V","X","Y","Z","0"].includes(char)) { //5
            line(30+25*this.col ,40+25*this.row,40+25*this.col ,20+25*this.row);
        }
        if(["A","B","D","H","J","M","N","O","P","Q","R","U","W","0","1","2","3","4","7","8","9"].includes(char)) { //6
            line(40+25*this.col ,20+25*this.row,40+25*this.col ,40+25*this.row);
        }
        if(["A","E","F","H","K","P","R","2","3","4","5","6","8","9"].includes(char)) { //7
            line(20+25*this.col , 40+25*this.row,30+25*this.col ,40+25*this.row);
        }
        if(["A","B","E","F","H","P","R","S","2","3","4","5","6","8","9"].includes(char)) { //8
            line(30+25*this.col , 40+25*this.row,40+25*this.col ,40+25*this.row);
        }
        if(["A","C","E","F","G","H","J","K","L","M","N","O","P","Q","R","U","V","W","0","2","6","8"].includes(char)) {
            line(20+25*this.col ,40+25*this.row,20+25*this.col ,60+25*this.row);
        }
        if(["V","W","X","Z","0"].includes(char)) { //A
            line(20+25*this.col ,60+25*this.row,30+25*this.col ,40+25*this.row);
        }
        if(["B","D","I","T","Y"].includes(char)) { //B
            line(30+25*this.col ,40+25*this.row,30+25*this.col ,60+25*this.row);
        }
        if(["K","N","Q","R","W","X"].includes(char)) { //C
            line(30+25*this.col ,40+25*this.row,40+25*this.col ,60+25*this.row);
        }
        if(["A","B","D","G","H","J","M","N","O","Q","S","U","W","0","1","3","4","5","6","7","8","9"].includes(char)) {
            line(40+25*this.col ,40+25*this.row,40+25*this.col ,60+25*this.row);
        }
        if(["B","C","D","E","G","I","J","L","O","Q","S","U","Z","0","2","3","5","6","8","9"].includes(char)) {
            line(20+25*this.col ,60+25*this.row,40+25*this.col ,60+25*this.row);
        }
    }
}


function Asteroid(location, orientation,initial_orientation, radius) { //class for asteroids
    this.pos = location;
    this.or = orientation;
    this.gor = initial_orientation;
    this.rad = radius;
    this.draw = function() { //coordinates are degrees around a circle
        let a = this.or;
        beginShape();
        vertex(this.pos[0] + this.rad*cos(10+a),this.pos[1] + this.rad*sin(10+a));
        vertex(this.pos[0] + 2*this.rad*cos(32.5+a)/3,this.pos[1] + 2*this.rad*sin(32.5+a)/3);
        vertex(this.pos[0] + this.rad*cos(65+a),this.pos[1] + this.rad*sin(65+a));
        vertex(this.pos[0] + this.rad*cos(125+a),this.pos[1] + this.rad*sin(125+a));
        vertex(this.pos[0] + this.rad*cos(210+a),this.pos[1] + this.rad*sin(210+a));
        vertex(this.pos[0] + 2*this.rad*cos(260+a)/3,this.pos[1] + 2*this.rad*sin(260+a)/5);
        vertex(this.pos[0] + this.rad*cos(300+a),this.pos[1] + this.rad*sin(300+a));
        vertex(this.pos[0] + this.rad*cos(345+a),this.pos[1] + this.rad*sin(345+a));
        endShape(CLOSE);
    };
}


function setup() { //finally! only took 128 lines of class declarations and setup
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  
  pos = [windowWidth/2,windowHeight/2]; //middle of the screen
  for(var i = 0; i < 5; i++) { //add 5 random asteroids
    asteroids.push(new Asteroid([random(0,windowWidth),random(0,windowHeight)],random(0,360),random(0,360),random([10,20,40])));
  }
  
  var colConstant = (-75 + 0.5*windowWidth)/25; //based on position of Game Over text, makes this easier
  leaderboard = [ //3 rows of leaderboard, 7 characters each (3 for name, 4 for score)
      [new SevDisplay(7,12.5,colConstant), new SevDisplay(6,12.5,colConstant+1), new SevDisplay(5,12.5,colConstant+2),new SevDisplay(4,12.5,colConstant+3), new SevDisplay(3,12.5,colConstant+4), new SevDisplay(2,12.5,colConstant+5),new SevDisplay(1,12.5,colConstant+6)],
      [new SevDisplay(7,14.5,colConstant), new SevDisplay(6,14.5,colConstant+1), new SevDisplay(5,14.5,colConstant+2),new SevDisplay(4,14.5,colConstant+3), new SevDisplay(3,14.5,colConstant+4), new SevDisplay(2,14.5,colConstant+5),new SevDisplay(1,14.5,colConstant+6)],
      [new SevDisplay(7,16.5,colConstant), new SevDisplay(6,16.5,colConstant+1), new SevDisplay(5,16.5,colConstant+2),new SevDisplay(4,16.5,colConstant+3), new SevDisplay(3,16.5,colConstant+4), new SevDisplay(2,16.5,colConstant+5),new SevDisplay(1,16.5,colConstant+6)]
    ];
    gameOverLabel = [ //GAME OVER is 9 characters
        new SevDisplay(9,10.5, colConstant-2),
        new SevDisplay(8,10.5, colConstant-1),
        new SevDisplay(7,10.5, colConstant),
        new SevDisplay(6,10.5, colConstant+1),
        new SevDisplay(5,10.5, colConstant+2),
        new SevDisplay(4,10.5, colConstant+3),
        new SevDisplay(3,10.5, colConstant+4),
        new SevDisplay(2,10.5, colConstant+5),
        new SevDisplay(1,10.5, colConstant+6)
    ];
    numDisplay = [new SevDisplay(1, 12.5, colConstant-3), new SevDisplay(1, 14.5, colConstant-3), new SevDisplay(1, 16.5, colConstant-3)];
    nameLabel = [new SevDisplay(4,20.5,colConstant-4),new SevDisplay(3,20.5,colConstant-3),new SevDisplay(2,20.5,colConstant-2),new SevDisplay(1,20.5,colConstant-1)]; //4 characters for NAME
    nameDisp = [new SevDisplay(3, 20.5,colConstant+1), new SevDisplay(2, 20.5, colConstant+2), new SevDisplay(1, 20.5, colConstant+3)]; //3 characters for playername display

  noFill();
}

function draw() {
  background(0);
  stroke(255);
  if(lives >= 0) { //gamestate control
    livesDraw(); //draws ships representing lives
    playerDraw(); //draws player
    velocityPosHandler(); //handles movement of player + asteroids
    inputHandler(); //handles left, right, and up arrows
    projectileHandler(); //handles movement + collision of projectiles
    collisionHandler(); //handles collision of player with asteroids
  } else {
      gameOverScreen(); //displays game over and scoreboard information
  }
  scoreDraw(); //displays scoreboard in top left
  
  
}
function livesDraw() { //draws ships
    for(var i = 0; i<lives; i++) { //# of lives
        beginShape();
        vertex(30 + 25*i + 15*cos(270), 85 + 15*sin(270)); //point of ship
        vertex(30 + 25*i + 15*cos(410), 85 + 15*sin(410)); //bottom of ship
        vertex(30+25*i, 85); //center of ship
        vertex(30 + 25*i + 15*cos(490), 85 + 15*sin(490)); //other bottom of ship
        endShape(CLOSE);
    }
}

function playerDraw() { //draws player
  shipPoint = [pos[0] + 15*cos(or), pos[1] + 15*sin(or)]; //point of ship
  var shipBottom1 = [pos[0] + 15*cos(or+140), pos[1] + 15*sin(or+140)]; //bottom of ship
  var shipBottom2 = [pos[0] + 15*cos(or+220), pos[1] + 15*sin(or+220)]; //other bottom of ship

  beginShape();
  vertex(shipPoint[0],shipPoint[1]);
  vertex(shipBottom1[0], shipBottom1[1]);
  vertex(pos[0],pos[1]);
  vertex(shipBottom2[0], shipBottom2[1]);
  endShape(CLOSE);
}

function velocityPosHandler() { //handles orientation + position changes of player + asteroids
    or += orV;
    orV += orV<0 ? 0.5 : orV == 0 ? 0 : -0.5;
    v -= v >= 0.1 ? 0.1 : 0;
    pos[0] += v * cos(or);
    pos[1] += v * sin(or);
    let m = (pos[1]-shipPoint[1])/(pos[0]-shipPoint[0]); //change in location
    if(pos[0] < 0) { //reset to right of screen
        pos[0] = windowWidth;
        pos[1] = m*windowWidth + (pos[1] - m*pos[0]);
    }
    if(pos[0] > windowWidth) { //reset to left of screen
        pos[0] = 0;
        pos[1] = pos[1] - m*pos[0];
    }
    if(pos[1] > windowHeight) { //reset to top of screen
        pos[0] = (m*pos[0])/m;
        pos[1] = 0;
    }
    if(pos[1] < 0) { //reset to bottom of screen
        pos[0] = (-windowHeight + m*pos[0])/m;
        pos[1] = windowHeight;
    }

    asteroids.forEach(function(a) { //does the same thing.... but for every asteroid
        a.or++; 
        a.draw();
        a.pos[0] += pow(2,(-(log(a.rad/5)/log(2))+2)) * cos(a.gor);
        a.pos[1] += pow(2,(-(log(a.rad/5)/log(2))+2)) * sin(a.gor);

        let m = (sin(a.gor))/(cos(a.gor));
        if(a.pos[0] < 0) {
            a.pos[0] = windowWidth;
            a.pos[1] = m*windowWidth + (a.pos[1] - m*a.pos[0]);
        }
        if(a.pos[0] > windowWidth) {
            a.pos[0] = 0;
            a.pos[1] = a.pos[1] - m*a.pos[0];
        }
        if(a.pos[1] > windowHeight) {
            a.pos[0] = (m*a.pos[0])/m;
            a.pos[1] = 0;
        }
        if(a.pos[1] < 0) {
            a.pos[0] = (-windowHeight + m*a.pos[0])/m;
            a.pos[1] = windowHeight;
        }
    });
}


function inputHandler() { //turning + propulsion
    if(keyIsDown(RIGHT_ARROW)) {
        if(orV < 10.5) {
            orV += 0.75;
        }
    }
    if(keyIsDown(LEFT_ARROW)) {
        if(orV > -10.5) {
            orV -= 0.75;
        }
    }
    if(keyIsDown(UP_ARROW)) {
        if(v == 0) {
            v = 0.5;
        } else {
            if(v < 12.5) {
                v += 0.5;
            }
        }
    }
}

function keyPressed() { //keyboard input: projecties, name input, game reset
    console.log([acceptingInput, written]);
    if(!acceptingInput) { //projectiles
        if(keyCode == 32) {
            projectiles.push(new Projectile([shipPoint[0],shipPoint[1]],or));
        }
    } else if(!written) { //name input
        if(name.length <= 3 && acceptingInput) {
            if("ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("").includes(String.fromCharCode(keyCode).toUpperCase()) && name.length < 3) { //valid characters only
                name += String.fromCharCode(keyCode).toUpperCase();
            } else if(keyCode == 13) { //Enter
                name = name.length == 3 ? name : name.length == 2 ? name + " " : name.length == 1 ? name + "  " : "   ";
                acceptingInput = false;
            } else if(keyCode == BACKSPACE) {
                name = name.length > 0 ? name.substring(0,name.length-1) : name;
            }
        }
    } 
    if(!acceptingInput && written) { //reset game
        pos = [windowWidth/2,windowHeight/2]; 
        or = 0; 
        v = 0; 
        orV = 0;  
        projectiles = [];
        asteroids = [];
        for(var i = 0; i < 5; i++) {
            asteroids.push(new Asteroid([random(0,windowWidth),random(0,windowHeight)],random(0,360),random(0,360),random([10,20,40])));
        } 
        score = 0; 
        lives = 3;
        acceptingInput = false;
        written = false;
        name = "";
    }
}

function projectileHandler() { //movement + collision of projectiles
    projectiles.forEach(function(pro,ind) {
        pro.tempPos = [pro.pos[0],pro.pos[1]]; //stores temporary position
        pro.pos[0] += 10 * cos(pro.or); //increments position
        pro.pos[1] += 10 * sin(pro.or);
        line(pro.tempPos[0],pro.tempPos[1],pro.pos[0],pro.pos[1]); //draws 'bolt' between the two
        if(pro.pos[0] > windowWidth || pro.pos[0] < 0 || pro.pos[1] > windowHeight || pro.pos[1] < 0) { //run offscreen
            projectiles.splice(ind,1);
        }
        asteroids.forEach(function(ast,aind) {
            if(sqrt(pow(pro.pos[0]-ast.pos[0],2) + pow(pro.pos[1]-ast.pos[1],2)) <= ast.rad) { //intersection of projectile and asteroid
                if(ast.rad > 10) { //halves asteroid size
                    asteroids.push(new Asteroid([ast.pos[0],ast.pos[1]],random(0,360),random(0,360),ast.rad/2));
                    asteroids.push(new Asteroid([ast.pos[0],ast.pos[1]],random(0,360),random(0,360),ast.rad/2));
                } else { //adds new random asteroids
                    for(var i = 0; i < 2; i++) {
                        asteroids.push(new Asteroid([random(0,windowWidth),random(0,windowHeight)],random(0,360),random(0,360),random([10,20,40])));
                    }
                }
                score+=pow(2,2-log(ast.rad/10)/log(2)); //increment score
                asteroids.splice(aind,1); //removes asteroid + projectile involved in collision
                projectiles.splice(ind,1);
                if(score%100 == 0) { //increase lives per 100 points
                    lives++;
                }
            }
        });
    });
    
}
function scoreDraw() { //draw score in top left
    scoreboard.forEach(function(a) {
        a.show();
    });
}
function collisionHandler() { //handle collision of player with asteroids
    asteroids.forEach(function(a,ind) {
        let dist = sqrt(pow(a.pos[0]-pos[0],2)+pow(a.pos[1]-pos[1],2)); //intersection of two circles
        if(a.rad-15 <= dist && dist <= a.rad+15) {
            asteroids.splice(ind,1);
            lives--;
        }
    });
}

function gameOverScreen() { //BIG; game over screen
    strScore = score.toString(); //adds leading zeroes
    while(strScore.length < 4) {
        strScore = "0" + strScore;
    }
    if(score > parseInt(highs[0].score)) { //shifts leaderboard standings
        if(name.length != 3) {
            acceptingInput = true;
        }
        if(!acceptingInput && !written) {
            //Update scoreboard
            highs[2].name = highs[1].name;
            highs[2].score = highs[1].score;
            highs[1].name = highs[0].name;
            highs[1].score = highs[0].score;
            highs[0].name = name;
            highs[0].score = strScore;
            written = true;
        }
    } else if(score > parseInt(highs[1].score)) {
        if(name.length != 3) {
            acceptingInput = true;
        }
        if(!acceptingInput && !written) {
            highs[2].name = highs[1].name;
            highs[2].score = highs[1].score;
            highs[1].name = name;
            highs[1].score = strScore;
            written = true;
        }
    } else if(score > parseInt(highs[2].score)) {
        if(name.length != 3) {
            acceptingInput = true;
        }
        if(!acceptingInput && !written) {
            highs[2].name = name;
            highs[2].score = strScore;
            written = true;
        }
    } else {
        written = true;
    }
    nameDisp.forEach(function(a) { //shows name under scoreboard
        a.alphShow(name.length == 3 ? name : name.length == 2 ? name + " " : name.length == 1 ? name + "  " : "   ");
    });
    numDisplay.forEach(function(a,ind) {
        a.alphShow((ind+1).toString());
    });
    if(score > parseInt(highs[2].score)) { //says NAME if you advance in the scoreboard
        nameLabel.forEach(function(a) {
            a.alphShow("NAME");
        });
    }
    gameOverLabel.forEach(function(a) { //GAME OVER text
        a.alphShow("GAME OVER");
    });
    leaderboard.forEach(function(a,ind) { //show leaderboard standings
        a.forEach(function(b) {
            b.alphShow(highs[ind].name + highs[ind].score);
        });
    });
}

function windowResized() {
    resizeCanvas(windowWidth,windowHeight);
    colConstant = (-75 + 0.5*windowWidth)/25;
}
