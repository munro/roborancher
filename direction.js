/* simple object to simplify direction algebra
 * each cardinal direction is an instance of the Direction object
 */
var dirList = ['north', 'east','south', 'west']

Direction = function(name){
    this.name = name;
    this.myInt = dirList.indexOf(this.name);
}
//takes a starting direction and a turn, returns an ending direction
Direction.prototype.turn = function(myTurn){
    myInt = this.myInt
    switch(myTurn){
        case 'cw':
            return dirList[(myInt+2)%4];
            break;
        case 'ccw':
            return dirList[(myInt+4)%4];
            break;
        case 'around':
            return dirList[(myInt+3)%4];
            break;
        default:
            return undefined;
    }
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

north = Object.create(new Direction);
north.name = 'north';
east = Object.create(new Direction);
east.name = 'east';
south = Object.create(new Direction);
south.name = 'south';
west = Object.create(new Direction);
west.name = 'west';

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
