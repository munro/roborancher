/* simple object to simplify direction algebra
 * each cardinal direction is an instance of the Direction object
 */
var dirList = ['north', 'east','south', 'west']

Direction = function(name){
    this.name = name;
}

//takes a starting direction and a turn, returns an ending direction
Direction.prototype.turn = function(myTurn){
    myInt = dirList.indexOf(this.name);
    switch(myTurn){
        case 'cw':
            return dirList[(myInt+1+4)%4];
            break;
        case 'ccw':
            return dirList[(myInt-1+4)%4];
            break;
        default:
            return undefined;
    }
}

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

north = Object.create(new Direction);
north.name = 'north';
east = Object.create(new Direction);
east.name = 'east';
south = Object.create(new Direction);
south.name = 'south';
west = Object.create(new Direction);
west.name = 'west';

if(true){
    console.log(north);
    console.log(north.turn('cw'));
    console.log(north.turn('ccw'));
    console.log(north.move([0,0]));
    console.log(east);
    console.log(east.turn('cw'));
    console.log(east.turn('ccw'));
    console.log(east.move([0,0]));
    console.log(south);
    console.log(south.turn('cw'));
    console.log(south.turn('ccw'));
    console.log(south.move([0,0]));
    console.log(west);
    console.log(west.turn('cw'));
    console.log(west.turn('ccw'));
    console.log(west.move([0,0]));    
}
