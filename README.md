# Yatzy Deathmatch

## API

```
GET /me
  An overview of your own stats.
GET /games
  List of your games played.
POST /games
  Start a new random game.
GET /games/:seed
  State of the given game; creates new state if unplayed.
POST /games/:seed/roll
POST /games/:seed/score
GET /friends
POST /friends
GET /friends/:user
  Trailing 30 day competition stats; wins/loses, average spread.
POST /register (user, totp)
  
```

## Data Model

```
user:<user>:name <username>
user:<user>:seeds <totp seeds>
user:<user>:recent <timestamp>
user:<user>:email <email address>
user:<user>:games <games sorted by timestamp set>
user:<user>:games:<game>:seed <game seed>
game:<user>:<game>:rolls <game total and turn rolls map>
game:<user>:<game>:scorecard <game scorecard map>
game:<user>:<game>:dice <game current dice map>
analysis:<game>:scorecard <optimal gameplay scorecard map>
friends:<user>:active <user sorted by timestamp set>
friends:<user>:pending <user sorted by timestamp set>
friends:<user>:blocked <user sorted by timestamp set>
feed:<user> <json event list>
```

## CLI Commands

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# test the production build locally
npm run serve
```
