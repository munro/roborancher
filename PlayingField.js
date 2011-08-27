function PlayingField(width, height) {
    this.tiles = new Array(width);
    for (i = 0; i < height; i++)
        this.tiles[i] = new Array(height);
};

PlayingField.prototype.setTile = function(x, y, tile) {
    this.tiles[x][y] = tile;
}

PlayingField.prototype.getTile = function(x, y) {
    return this.tiles[x][y];
}



/*
 * unit tests
 */
if(1 == 1) {
    var field = new PlayingField(2, 2);

    field.setTile(0, 0, 'tile1');
    field.setTile(1, 1, 'tile2');

    console.log(field.getTile(0, 0));
    console.log(field.getTile(1, 1));
}

