# Yatzy Laboratory

*https://roll.with.dirty.vodka*

Yatzy Laboratory is a progressive web app Yahtzee game with a competitive twist. Each game you play is identified by a seed value and the rolls of the dice are generated with a [HOTP algorithm](https://en.wikipedia.org/wiki/HMAC-based_One-Time_Password) using that seed. This seed is accessible as a QR code after you complete a game, which you can screenshot and send to a friend. When your friend loads that QR code, the game they play is the exact same sequence of rolls that you played. When they finish their game you'll be able to compare notes and see who played the sequence the best.

## Development

If you're interested in a detailed breakdown of some of the concepts used in this project, I've written some tutorials on [CodeREVUE.net](https://coderevue.net/tags/202101-javascript-pixijs-game/) that work through a smaller example project.

### Building

This project includes a [Docker Compose configuration](docker-compose.yml) that's used for building and developing this project. You'll need to have Docker Desktop installed to use it, but if you prefer to just use npm directly that should work just fine as well.

```sh
# Launch a local server
# See the npm start target
docker-compose up

# Generate a release build
docker-compose run development npm run build

# Cleanup Docker containers
docker-compose down
```

## License

The code in this repository is made available under the [MIT license](LICENSE). The scientist graphics are licensed from [VectorStock.com](https://www.vectorstock.com/royalty-free-vector/working-scientists-professional-lab-research-vector-26720597) with an extended license. This means that I can use PNG versions of the images in this project and distribute that to you, but you cannot then redistribute them without first purchasing a license of your own.
