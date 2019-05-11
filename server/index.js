/*
 * First we populate the maps map (lol), then we create the server.  The map
 * comes from our server file and uses tha maps map to fulfull get requests.
 * we populate the maps here to ensure the map is populated the second our
 * our client has loaded the page.
 */
readFile(path.join(__dirname, 'maps/maps.json'))
  .then(contents => {
    const mapsArr = JSON.parse(contents);
    mapsArr.forEach(map => maps.set(map.mapId, map));

    const server = http.createServer(app).listen(process.env.PORT || 3001); // 3002?); switch these back in production
    console.log('Listening on port %d', server.address().port); // eslint-disable-line no-console
    const io = require('socket.io')(server); // eslint-disable-line global-require

    /*
	use map to store players
	given that socket ids are unique
	this helps remove players
 	when they disconnect

 	NOTE: emitting anything requires sending the data
 	in a JS object
*/

/* Map for list of people playing in galactus lobby */
const gPlayers = new Map();

const galactus = io.of('/galactus');
galactus.on('connection', socket => {
  socket.on('NEW_PLAYER', (player, fn) => {
    /*
      add the new player to the list of players
      and them emit the new list of players
    */
    gPlayers.set(socket.id, player);

    /*
      tell this newly connected socket about the other players
      player
    */
    const arr = Array.from(gPlayers.values()).filter(playerData => {
      return playerData.key !== socket.id;
    });

    fn(arr);
    // tell all other sockets about the player that just joined
    socket.broadcast.emit('PLAYER', arr);
  });

  socket.on('CHANGE_POS', (player, fn) => {
    gPlayers.set(socket.id, player);
    const arr = Array.from(gPlayers.values()).filter(playerData => {
      return playerData.key !== socket.id;
    });

    fn(arr);
    // tell all other sockets about the player that just joined
    socket.broadcast.emit('CHANGE_POS', arr);
  });

  socket.on('disconnect', () => {
    // eliminate the player from the container of players
    gPlayers.delete(socket.id);
    if (gPlayers.length === 0) {
      gPlayers.clear();
    }
    // broadcast the updated list to the rest of the players
    io.emit('BROADCAST', gPlayers);
  });
});

/* Map for list of people playing in galactus lobby */
const aPlayers = new Map();

const abraxas = io.of('/abraxas');
abraxas.on('connection', socket => {
  socket.on('NEW_PLAYER', (player, fn) => {
    /*
      add the new player to the list of players
      and them emit the new list of players
    */
    aPlayers.set(socket.id, player);

    /*
      tell this newly connected socket about the other players
      player
    */
    const arr = Array.from(aPlayers.values()).filter(playerData => {
      return playerData.key !== socket.id;
    });

    fn(arr);
    // tell all other sockets about the player that just joined
    socket.broadcast.emit('PLAYER', arr);
  });

  socket.on('CHANGE_POS', (player, fn) => {
    aPlayers.set(socket.id, player);
    const arr = Array.from(aPlayers.values()).filter(playerData => {
      return playerData.key !== socket.id;
    });

    fn(arr);
    // tell all other sockets about the player that just joined
    socket.broadcast.emit('CHANGE_POS', arr);
  });

  socket.on('disconnect', () => {
    // eliminate the player from the container of players
    aPlayers.delete(socket.id);
    if (aPlayers.length === 0) {
      aPlayers.clear();
    }
    // broadcast the updated list to the rest of the players
    io.emit('BROADCAST', aPlayers);
  });
});

/* Map for list of people playing in galactus lobby */
const dPlayers = new Map();

const doom = io.of('/doom');
doom.on('connection', socket => {
  socket.on('NEW_PLAYER', (player, fn) => {
    /*
      add the new player to the list of players
      and them emit the new list of players
    */
    dPlayers.set(socket.id, player);

    /*
      tell this newly connected socket about the other players
      player
    */
    const arr = Array.from(dPlayers.values()).filter(playerData => {
      return playerData.key !== socket.id;
    });


    fn(arr);
    // tell all other sockets about the player that just joined
    socket.broadcast.emit('PLAYER', arr);
   });

  socket.on('CHANGE_POS', (player, fn) => {
    dPlayers.set(socket.id, player);
    const arr = Array.from(dPlayers.values()).filter(playerData => {
      return playerData.key !== socket.id;
    });
      fn(arr);
      // tell all other sockets about the player that just joined
      socket.broadcast.emit('CHANGE_POS', arr);
    });

  socket.on('disconnect', () => {
    // eliminate the player from the container of players
    dPlayers.delete(socket.id);
    if (dPlayers.length === 0) {
      dPlayers.clear();
    }
    // broadcast the updated list to the rest of the players
    io.emit('BROADCAST', dPlayers);
  });
});
});
