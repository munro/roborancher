# RR
## Server-Side

### HTTP Server

Serves static HTML

### Socket.IO Server

Gateway for all game logic

### Connection

When someone connects, a connection object is created.  Since there is currently
no authentication method, they must enter a name before given a user object.

* Methods
    * `player`

### Player

A user object will be given to a connection when they host/join a game.  Before
joining a game, the connection must first check if that name already exists, if
so, don't create the player object and return an error.  If the name doesn't exist
create the player object and join the game.

* Methods
    * `name()`
    * `color()`
    * `host()`

### Game

* Methods

* Events
    * `player_join` — Fires when someone joins the game
    * `player_leave` — Fires when someone leaves the game
    * `start` — Fires when the game has started
    * `end` — Fires when the game is finished

### GameManager

* Methods
    * `findGame(game_slug)` — Finds a game based on a hash
    * `createGame()` — Creates a new game!

## Client-Side

## Design

* Splash page - large graphic / info about game / host & join game buttons
* About page - small logo / info about developers
* Game lobby - link to this game / list of players / chat box
* Game - board / list of pages & flags / chat box
    * Finished game - overlay with stats / buttons play again & home
