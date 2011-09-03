/* simple object to simplify direction algebra
 * each cardinal direction is an instance of the Direction object
 */
var dirList = ['north', 'east','south', 'west']

function Direction(name){
    this.name = name;
    this.myInt = dirList.indexOf(this.name);
}
//takes a starting direction and a turn, returns an ending direction
Direction.prototype.turn = function(myTurn){
    var name;
    myInt = this.myInt;
    myTurns = ['cw','around','ccw'];
    addI = myTurns.indexOf(myTurn)+1;
    if (addI >0)
        return new Direction(dirList[(myInt+addI)%4]);
    return undefined;
};
Direction.prototype.behind = function(){return this.turn('around')};
//takes a starting x,y and direction, returns a new x,y (moves one square)
Direction.prototype.move = function(myPosition){
    switch(this.name){
        case "north":
            return([myPosition[0],myPosition[1]+1])
            break;
        case "east":
            return([myPosition[0]+1,myPosition[1]])
            break;
        case "south":
            return([myPosition[0],myPosition[1]-1])
            break;
        case "west":
            return([myPosition[0]-1,myPosition[1]])
            break;
        default:
            return undefined;
    };
}

Direction.prototype.reverse = function(myPosition){
    switch(this.name){
        case "north":
            return([myPosition[0],myPosition[1]-1])
            break;
        case "east":
            return([myPosition[0]-1,myPosition[1]])
            break;
        case "south":
            return([myPosition[0],myPosition[1]+1])
            break;
        case "west":
            return([myPosition[0]+1,myPosition[1]])
            break;
        default:
            return undefined;
    };
}

north = new Direction('north');
east = new Direction('east');
south = new Direction('south');
west = new Direction('west');
myDirs = [north,east,south,west];

if(false){
    for(myInt in myDirs){
        myDir = myDirs[myInt]
        console.log(myDir);
        console.log('\t'+myDir.turn('cw').name);
        console.log('\t'+myDir.turn('ccw').name);
        console.log('\t'+myDir.turn('around').name);
        console.log('\t'+myDir.move([0,0])); 
        console.log('\t'+myDir.behind().move([0,0])); 
    }   
}

module.exports.north = north;
module.exports.south = south;
module.exports.east = east;
module.exports.west = west;
