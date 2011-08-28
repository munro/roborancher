var util = require('./util');
var dir = require('./direction');

/* a bot isa collection of bot parts
 * a bot part hasa name and a list of information such that
 *   description := string descrition of the bot part
 *   thingProp := seralized string represneting this part's properties
 *   thingCost := weight, energy, "points" and other costs seralized
 *   thingSprite := link to sprite file
 *   thingSound := link to sound file (optional)
 */
 
 north = dir.north;
 east = dir.east;
 south = dir.south;
 west = dir. west;
 
 lstDirs = [north,east,west,south];
 
BotPart = function(){ 
    this.name="partName";
    this.desc="partDesc";
    this.props="partProps";
    this.cost="partCost";
    this.sprite="partSprite";
    this.sound="partSound";
    this.callbacks={};
};

BotPart.prototype.init = function(spec){
    for(myKey in spec){
        this[myKey] = spec[myKey];
    }
};

BotPart.prototype.report = function(myTarget){
    for(myinfo in this){
        myTarget.log(myinfo+"::"+this[myinfo]);
    }; 
};

Bot = function(){
    this.top = Object.create(new BotPart);
    this.base =  Object.create(new BotPart);
    this.callbacks = {};
    this.status = {damage: 0, postition: [0,0], direction: north, step: 0};
    this.sprite = "mySprite";
}

Bot.prototype.initPart = function(target, spec){target.init(spec)};
Bot.prototype.init = function(topSpec, baseSpec){
    this.initPart(this.top, topSpec);
    this.initPart(this.base, baseSpec);
};
Bot.prototype.health = function(){return this.base.cost.points *4-this.status.damage};
Bot.prototype.dead = function(){return this.health() <= 0};
Bot.prototype.takeDamage = function(intDamage){
    this.status.damage += intDamage;
    if(this.dead()){
        return "dead from "+intDamage+" damage."
    };
    return "took "+intDamage+" damage."
};
Bot.prototype.move = function(type){
    console.log("whoop");
    switch(type){
        case 'move':
            return this.status.direction.move(this.status.position);
            break;
        case 'reverse':
            return this.status.direction.move(this.status.position.behind);
            break;
        case 'turnLeft':
            return(this.status.direction.turn('cw'));
            break;
        case 'turnRight':
            return(this.status.direction.turn('ccw'));
            break;
        default:
            return undefined
    }
};
Bot.prototype.report = function(target){
    for(myI in this){
        target.log(myI+this[myI]);
        for(myJ in this[myI]){
            target.log(myI +" "+myJ+ "::" + this[myI][myJ])
        }
    }
};


/*example use and test
 */

if(true){
    var myTopSpec = {
        name:"Head unit 1", 
        desc:"first model for the top of the bot",
        props:{lazer:'1', sensor:1, power:1, energy:1},
        cost:{points:4},
        sprite:"spriteTop",
        sound:"sound2"
    };

    var myBaseSpec = {
        name:"Base unit 1", 
        desc:"first model for the base of the bot",
        props:{move:1, turn:1, capacity:1, slots:1},
        cost:{points:4},
        sprite:"spriteBase",
        sound:"sound2"
    };

    myBot = Object.create(new Bot);
    myBot.init(myTopSpec, myBaseSpec);
    if(false){
        myBot.report(console);
        console.log(myBot.health());
        console.log(myBot.dead());
        console.log(myBot.takeDamage(7));
        console.log(myBot.health());
        console.log(myBot.takeDamage(10));
        console.log(myBot.health());
        console.log(myBot.dead());
    };
    if(true){
        myBot.report(console);
        myBot.move();
        console.log(myBot.move('move'));
        //~ console.log(myBot.move('reverse'));
        //~ console.log(myBot.move('turnLeft'));
        //~ console.log(myBot.move('turnRight'));
    }
    
}
