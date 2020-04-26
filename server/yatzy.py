import bottle, bottle.ext.redis
from datetime import datetime, timezone
from pyotp import totp
from schema import Schema
from uuid import uuid4

SECRET = 'i_am_a_dirty_little_teapot'

app = bottle.Bottle()
plugin = bottle.ext.redis.RedisPlugin(host='redis')
app.install(plugin)

def now():
    return int(datetime.now(tz=timezone.utc).timestamp() * 1000)

def game_is_done(user, game):
    return

@app.route('/static/<filename:path>')
def send_static(filename):
    return app.static_file(filename, root='./static')

@app.get('/v1/games')
def v1_get_games(rdb):
    user = bottle.request.get_cookie('user', secret=SECRET)
    if user is None:
        return bottle.redirect('/v1/login')
    # get recent games from user's sorted set of games
    # get scorecards for recent games
    return 'OK'

@app.post('/v1/games')
def v1_post_games(rdb):
    user = bottle.request.get_cookie('user', secret=SECRET)
    if user is None:
        return bottle.redirect('/v1/login')
    latest_game = rdb.zrevrange('user:{0}:games'.format(user), 0, 0)
    in_progress = latest_game and not game_is_done(user, latest_game)
    if latest_game:

    # get first game from user's sorted set of games
    # check if it's done; if it is return a new game else return ongoing
    return 'OK'

def v1_get_games_game_data(user, game, rdb):
    seed = rdb.get('user:{0}:games:{1}:seed'.format(user, game))
    if seed is None:
        return None
    rolls = rdb.hgetall('user:{0}:games:{1}:rolls'.format(user, game))
    scorecard = rdb.hgetall('user:{0}:games:{1}:scorecard'.format(user, game))
    dice = rdb.hgetall('user:{0}:games:{1}:dice'.format(user, game))
    return {'seed': seed, 'rolls': rolls, 'scorecard': scorecard, 'dice': dice}

@app.get('/v1/games/<game>')
def v1_get_games_game(game, rdb):
    user = bottle.request.get_cookie('user', secret=SECRET)
    if user is None:
        return bottle.redirect('/v1/login')
    game_data = v1_get_games_game_data(user, game, rdb)
    if game_data is None:
        return bottle.abort(404, 'Game not found.')
    return game_data

@app.post('/v1/games/<game>/roll')
def v1_post_games_game_roll(game_id, rdb):
    user = bottle.request.get_cookie('user', secret=SECRET)
    if user is None:
        return bottle.redirect('/v1/login')
    game_data = v1_get_games_game_data(user, game, rdb)
    if game_data is None:
        return bottle.abort(404, 'Game not found.')
    # check can roll?
    # return new state
    return 'OK'

@app.post('/v1/games/<game>/score')
def v1_post_games_game_score(game, rdb):
    user = bottle.request.get_cookie('user', secret=SECRET)
    if user is None:
        return bottle.redirect('/v1/login')
    game_data = v1_get_games_game_data(user, game, rdb)
    if game_data is None:
        return bottle.abort(404, 'Game not found.')
    # check can score?
    # return new state
    return 'OK'

@app.get('/v1/login')
def v1_get_login():
    user = bottle.request.get_cookie('user', secret=SECRET)
    if user is not None:
        bottle.response.set_cookie('user', user, secret=SECRET)
        return bottle.redirect('/v1/lobby')
    # if cookie OK then reset fresh cookie and redirect to lobby
    # client side JS looks for localforage user/totp_seed
    # makes post request to login if available
    # if not or login failure, post to register
    # install new credentials and redirect
    return bottle.template('layout', body='<login></login>')

@app.post('/v1/login')
def v1_post_login(rdb):
    login_schema = Schema({'user': str, 'totp': str})
    if not login_schema.is_valid(bottle.request):
        return bottle.abort(400, 'Post data failed schema validation.')
    login_data = login_schema.validate(bottle.request.json)
    totp_seed = rdb.get('user:{0}:seed'.format(login_data['user']))
    if totp_seed is None:
        return bottle.abort(401, 'Bad user credentials.')
    otp_verified = totp.TOTP(totp_seed).verify(login_data['totp'], valid_window=4)
    if not otp_verified:
        return bottle.abort(401, 'Bad user credentials.')
    rdb.set('user:{0}:recent'.format(login_data['user']), now())
    bottle.response.set_cookie('user', user_id, secret=SECRET)

@app.post('/v1/register')
def v1_post_register(rdb):
    new_user_id = uuid4()
    new_totp_seed = pyotp.random_base32()
    rdb.set('user:{0}:recent'.format(new_user_id), now())
    rdb.set('user:{0}:seed'.format(new_user_id), new_totp_seed)
    bottle.response.set_cookie('user', new_user_id, secret=SECRET)
    return {'user': new_user_id, 'totp_seed': new_totp_seed}

@app.get('/v1/lobby')
def v1_get_lobby(rdb):
    user = bottle.request.get_cookie('user', secret=SECRET)
    if user is None:
        return bottle.redirect('/v1/login')
    rdb.set('user:{0}:recent'.format(user), now())
    return bottle.template('layout', body='<lobby></lobby>')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
