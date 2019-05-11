/* eslint-disable camelcase */
const { Model } = require('objection');

class Users extends Model {
  static get tableName() {
    return 'Users';
  }

  // For more: https://json-schema.org/understanding-json-schema/reference/numeric.html#integer
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['googleId'],

      properties: {
        id: { type: 'integer' },
        googleId: { type: 'string' },
        givenName: { type: 'string' },
        email: { type: 'string' },
        total_games: { type: 'integer' },
        total_multi_games: { type: 'integer' },
        map_0: { type: 'integer' },
        map_1: { type: 'integer' },
        map_2: { type: 'integer' }
      }
    };
  }
}

module.exports = Users;
