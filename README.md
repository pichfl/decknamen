# [Decknamen](https://dn.ylk.gd)

Play with your friends ❤️

Decknamen is an online version of Codenames, a board game created by Vlaada Chvátil. If you enjoy playing this, buy the
original, it's even more fun to play this around a table with snacks and friends.

## Credits

Inspired by [@jbowens/codenames](https://github.com/jbowens/codenames), which can be found online at
[horsepaste.com](http://horsepaste.com). I wanted to do my own version with slightly different features and ways to play
and I wanted to have a small project to test out technologies. I adopted the word lists found there to have a starting
point but changed a few terms that didn't work for me and my testers.

The [spy icon](https://thenounproject.com/term/spy/2518785) was created by Adrien Coquet of the Noun Project.

## Technical details

This project uses a websocket and http backend based on Primus and Node.js. See the `api` folder for details. To
organize everything, this repository uses [Yarn](https://yarnpkg.com) workspaces (for now). Given that the API part
could easily power any game, it might get extracted into its own repository at some point.

The website itself is powered by [Ember.js](https://emberjs.com) & a bunch of addons. The project is inside the `game`
folder.

This public version runs on a free tier of [Heroku](https://heroku.com/) and its
[Redis Addon](https://elements.heroku.com/addons/heroku-redis) and is hosted on [Vercel](https://vercel.com/), both of
which are quite excellent and made deploying this a bliss.

To run the project locally, you will need to create a `.env` file in the root of this project, containing a single
configuration option:

```
REDIS_URL=redis://…
```

You can either run Redis locally on your machine or use connection URL provided by Heroku, it will work locally as well.

## Contributing & License

Feedback and work is always welcome. Keep in mind I'm doing this for free and to be able to play with the friends and
family we currently can't visit in person. Take care.

Licensed under gpl-3.0
