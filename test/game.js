var Game = require('../lib/Game'),
    Player = require('../lib/Player'),
    test = require('tap').test,
    _ = require('underscore');

function getAllKeys(obj) {
    if (obj == Object.prototype || !obj) {
        return [];
    }
    return _.union(
        Object.getOwnPropertyNames(obj),
        getAllKeys(Object.getPrototypeOf(obj))
    );
}

function proxyMock(obj) {
    var mock = Object.create(obj);
    mock.__calls__ = [];
    _.chain(getAllKeys(obj)).filter(function (key) {
        return !Object.hasOwnProperty(key) && typeof mock[key] === 'function';
    }).each(function (key) {
        var old_fn = mock[key];
        mock[key] = function () {
            mock.__calls__.push('call', key, arguments);
            return old_fn.apply(this, arguments);
        };
    });
    return mock;
}

test('test game', function (t) {
    var game = Game(),
        ryan = proxyMock(Player()),
        oliver = Player();

    ryan.turnState('hello', 'world');
    ryan.turnState('hello', 'world');
    ryan.turnState('hello', 'world');
    console.log(ryan.__calls__);

    game.addPlayer(ryan);
    game.addPlayer(oliver);

    t.end();
});
