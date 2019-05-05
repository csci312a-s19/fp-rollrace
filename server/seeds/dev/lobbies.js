/*
 * Each lobby stores information about the number of players
 * in it and the lobby name.
 *
 * Each lobby has no more than 3 players and at least two players
 */
const lobbies = [
  {
    lName: 'Doom',
    nPlayers: 2
  },
  {
    lName: 'Abraxas',
    nPlayers: 1
  },
  {
    lName: 'Galactus',
    nPlayers: 3
  }
];

module.exports = {
  lobbies
};
