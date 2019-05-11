const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
const { Model } = require('objection');
const Users = require('./models/Users');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { OAuth2Client } = require('google-auth-library');

/* We will need to update the number of lobbies later */
const { lobbies } = require('./seeds/dev/lobbies.js');

// db-errors provides a consistent wrapper around database errors
const { wrapError, DBError } = require('db-errors');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Bind all Models to a knex instance.
Model.knex(knex);
const app = express();
const maps = new Map();

// express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  // Resolve client build directory as absolute path to avoid errors in express
  const buildPath = path.resolve(__dirname, '../client/build');

  app.use(express.static(buildPath));

  // Serve the HTML file included in the CRA client on the root path
  app.get('/', (request, response) => {
    response.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Cross-Origin-Resource-Sharing headers tell the browser is OK for this page to request resources
// from another domain (which is otherwise prohibited as a security mechanism)
const corsOptions = {
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  origin: '*',
  allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With', 'Origin']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// middleware to host images
app.use('/maps', express.static(path.join(__dirname, '/maps')));
if (process.env.NODE_ENV !== 'production') {
  app.use(
    session({
      secret: 'asfdasfdasf123412',
      resave: false,
      saveUninitialized: false
    })
  );
} else {
  app.use(
    session({
      store: new (require('connect-pg-simple')(session))(), // eslint-disable-line
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    })
  );
}

app.use(
  session({
    secret:
      process.env.NODE_ENV !== 'production'
        ? 'asfdasfdasf123412'
        : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Users.query()
    .findOne('id', id)
    .then(user => {
      done(null, user);
    });
});

const authenticationMiddleware = (request, response, next) => {
  if (request.isAuthenticated()) {
    return next(); // we are good, proceed to the next handler
  }
  return response.sendStatus(403); // forbidden
};

passport.use(
  new BearerStrategy((token, done) => {
    googleClient
      .verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      .then(async ticket => {
        const payload = ticket.getPayload();
        let user = await Users.query().findOne('googleId', payload.sub);
        if (!user) {
          user = await Users.query().insertAndFetch({
            googleId: payload.sub,
            givenName: payload.given_name,
            email: payload.email
          });
        }
        done(null, user);
      })
      .catch(error => {
        done(error);
      });
  })
);

// Google login
app.post(
  '/login',
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    response.sendStatus(200);
  }
);

// update player's stats
app.put('/api/users/', authenticationMiddleware, (request, response, next) => {
  const mapParam = `map_${request.body.mapId}`;
  if (request.body.type === 'end') {
    (async () => {
      const user = await Users.query().findById(request.user.id);
      if (
        !request.body.wasBooted &&
        (user[mapParam] === -1 || user[mapParam] > request.body.contents.time)
      ) {
        user
          .$query()
          .patchAndFetch({
            [mapParam]: request.body.contents.time, // give key var name?
            total_games: user.total_games + 1
          })
          .then(rows => {
            response.send(rows);
          }, next);
      } else {
        user
          .$query()
          .patchAndFetch({
            total_games: user.total_games + 1
          })
          .then(rows => {
            response.send(rows);
          }, next);
      }
    })();
  }
});

// get player's stats
app.get(
  '/api/users/stats',
  authenticationMiddleware,
  (request, response, next) => {
    Users.query()
      .findById(request.user.id)
      .then(rows => {
        response.send(rows);
      }, next);
  }
);

/* Lobbies */
app.get('/api/lobbies/', (request, response) => {
  /* Allow user to connect to lobbies with less than 3 players */
  const available = lobbies.filter(lobby => {
    return (
      lobby.nPlayers < 3
    ); /* TODO: This should be a constant in another file */
  });

  response.send(available);
});

// get a map object
app.get('/api/maps/:id', (request, response) => {
  const mapId = parseInt(request.params.id, 10);
  response.send(maps.get(mapId));
});

// get all maps
app.get('/api/maps', (request, response) => {
  response.send(Array.from(maps.values()));
});

// Error handler.
app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error);
  }

  /*
   * Do not want to send information about the inner workings of the
   * database to the client.
   */
  if (process.env.NODE_ENV !== 'production') {
    const wrappedError = wrapError(error);
    if (wrappedError instanceof DBError) {
      response
        .status(400)
        .send(wrappedError.data || wrappedError.message || {});
    } else {
      response
        .status(wrappedError.statusCode || wrappedError.status || 500)
        .send(wrappedError.data || wrappedError.message || {});
    }
  }
});

module.exports = {
  app,
  knex,
  maps
};
