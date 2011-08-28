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
    myInt = this.myInt
    switch(myTurn){
        case 'cw':
            name = dirList[(myInt+1)%4];
            break;
        case 'ccw':
            name = dirList[(myInt+3)%4];
            break;
        case 'around':
            name = dirList[(myInt+2)%4];
            break;
        default:
            name = undefined;
    }
    if (name)
        return new Direction(name);
    return undefined;
};
Direction.prototype.behind = Direction.prototype.turn('around');
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

if(false){
    myDirs = [north,east,south,west];
    for(myInt in myDirs){
        console.log(myInt);
        console.log(myDirs[myInt]);
        //console.log(myDir.turn('cw'));
        //console.log(myDir.turn('ccw'));
        //console.log(myDir.turn('around'));
        //console.log(myDir.move([0,0])); 
    }   
}

module.exports.north = north;
module.exports.south = south;
module.exports.east = east;
module.exports.west = west;
