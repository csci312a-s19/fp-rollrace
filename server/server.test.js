/* eslint-disable arrow-body-style */
const request = require('supertest');
const { app, knex, maps } = require('./server');

const user = {
  id: 1,
  googleId: '111216980333337153369',
  givenName: 'Jack',
  email: 'jboi@google.edu',
  total_games: 10,
  total_multi_games: 9,
  total_multi_wins: 9,
  map_0: 120,
  map_1: -1,
  map_2: -1
};

const mapContent = [
  {
    id: 0,
    title: 'Lazy Hills',
    level: 'Easy',
    image: 'easy.jpg',
    path: [
      'm 0, 650 h 359 v -180 h 159 v 100 h 95 v 100 h 143 v -100 h 381 v -100 h 159 v 100 h 238 v -95 h 365 v -95 h 286 v -95 h 143 v 413 h 333 v -95 h 603 v 95 h 238 v -79 h 143 v 175 h 127 v -79 h 143 v -95 h 111 v 16 h 429 v -143 h 111 v 143 h 333 v -111 h 127 v 111 h 270 v 143 h 143 v -79 h 79 v -79 h 238 v -127 h 175 v 127 h 143 v -95 h 127 v 238 h 159 v -111 h 270 v -127 h 159 v 175 h 238 v -111 h 190 v 95 h 127 v -127 h 397 v -127 h 190 v 190 h 206 v -95 h 111 v 79 h 127 v -111 h 111 v 143 h 95 v -127 h 127 v 143 h 127 v -127 h 127 v 318 h 460 v -175 h 127 v 143 h 111 v -222 h 333 v -127 h 412 v -1000 h 500'
    ],
    end: 667,
    startTime: {
      minutes: '00',
      seconds: '30'
    }
  },
  {
    id: 1,
    title: 'Slippery when Wet',
    level: 'Medium',
    image: 'medium.jpg',
    path: [
      'm 0, 650 h 359 v -180 h 159 v 100 h 95 v 100 h 143 v -100 h 381 v -100 h 159 v 100 h 238 v -95 h 365 v -95 h 286 v -95 h 143 v 413 h 333 v -95 h 603 v 95 h 238 v -79 h 143 v 175 h 127 v -79 h 143 v -95 h 111 v 16 h 429 v -143 h 111 v 143 h 333 v -111 h 127 v 111 h 270 v 143 h 143 v -79 h 79 v -79 h 238 v -127 h 175 v 127 h 143 v -95 h 127 v 238 h 159 v -111 h 270 v -127 h 159 v 175 h 238 v -111 h 190 v 95 h 127 v -127 h 397 v -127 h 190 v 190 h 206 v -95 h 111 v 79 h 127 v -111 h 111 v 143 h 95 v -127 h 127 v 143 h 127 v -127 h 127 v 318 h 460 v -175 h 127 v 143 h 111 v -222 h 333 v -127 h 412 v -1000 h 500'
    ],
    end: 667,
    startTime: {
      minutes: '00',
      seconds: '30'
    }
  }
];

mapContent.forEach(map => maps.set(map.id, map));

test('Server "smoke" test', () => {
  expect(app).toBeDefined();
});

describe('Rollrace API', () => {
  beforeEach(() => {
    // fake authentication
    app.request.isAuthenticated = () => true;
    app.request.user = user;

    return knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run());
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  afterAll(() => {
    app.end();
  });

  // SuperTest has several helpful methods for conveniently testing responses
  // that we can use to make the tests more concise

  describe('GET operations', () => {
    test('GET /api/users/stats should return all user stats', () => {
      return request(app)
        .get('/api/users/stats')
        .expect(200)
        .expect(user);
    });

    test('GET /api/maps should return all maps', () => {
      return request(app)
        .get('/api/maps')
        .expect(200)
        .expect(mapContent);
    });

    test('GET /api/maps/:id should return correct map', () => {
      return request(app)
        .get('/api/maps/1')
        .expect(200)
        .expect(maps.get(1));
    });

    test('GET /maps/easy.png should return OK', () => {
      return request(app)
        .get('/maps/easy.png')
        .expect(200);
    });

    test('GET should fail when unauthorized', () => {
      app.request.isAuthenticated = () => false;
      return request(app)
        .get('/api/users/stats')
        .expect(403);
    });
  });

  describe('PUT operations', () => {
    afterEach(() => {
      app.request.user = user;
    });

    test('PUT should update user if score is better than current', () => {
      const updatedUser = {
        type: 'end',
        contents: {
          time: 3
        }
      };

      request(app)
        .put('/api/users/')
        .send(updatedUser)
        .then(() =>
          expect(app.request.user).toEqual(Object.assign(user, { time: 3 }))
        );
    });

    test('PUT should update user if score === -1 (if they have not yet played)', () => {
      app.request.user = Object.assign(user, { time: -1 });
      const updatedUser = {
        type: 'end',
        contents: {
          time: 3
        }
      };

      request(app)
        .put('/api/users/')
        .send(updatedUser)
        .then(() =>
          expect(app.request.user).toEqual(Object.assign(user, { time: 3 }))
        );
    });

    test('PUT should not update user if score is worse than current', () => {
      const updatedUser = {
        type: 'end',
        contents: {
          time: 20
        }
      };
      request(app)
        .put('/api/users/')
        .send(updatedUser)
        .then(() => expect(app.request.user).toEqual(Object.assign(user)));
    });

    test('PUT should fail when unauthorized', () => {
      app.request.isAuthenticated = () => false;

      const updatedUser = {
        type: 'end',
        contents: {
          time: 20
        }
      };
      return request(app)
        .put('/api/users/')
        .send(updatedUser)
        .expect(403);
    });
  });
});
