var util = require('./util');

/* a bot isa collection of bot parts
 * a bot part hasa name and a list of information such that
 * information := [description, listAttributes, lstResources] where
 *   description := string descrition of the bot part
 *   listAttributes := [thingProp, thingCost] where
 *     thingProp := seralized string represneting this part's properties
 *     thingCost := weight, energy, "points" and other costs seralized
 *   listResources := [thingSprite, thingSound] where
 *     thingSprite := link to sprite file
 *     thingSound := link to sound file (optional)
 */
 
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
    this.status = {damage: 0, postition: [0,0], step: 0};
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
    //~ for(myI in myBot){
        //~ console.log(myI+myBot[myI]);
        //~ for(myJ in myBot[myI]){
            //~ console.log(myI +" "+myJ+ "::" + myBot[myI][myJ])
        //~ }
    //~ }
    console.log(myBot.health());
    console.log(myBot.dead());
    console.log(myBot.takeDamage(7));
    console.log(myBot.health());
    console.log(myBot.takeDamage(10));
    console.log(myBot.health());
    console.log(myBot.dead());
}
