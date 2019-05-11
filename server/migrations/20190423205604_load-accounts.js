/* eslint-disable func-names */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
exports.up = function(knex, Promise) {
  return knex.schema.createTable('Users', table => {
    table.increments('id');
    table.string('googleId').notNullable();
    table.string('givenName').notNullable();
    table.text('email').notNullable();
    table
      .integer('total_games')
      .notNullable()
      .defaultTo(0);
    table
      .integer('total_multi_games')
      .notNullable()
      .defaultTo(0);
    table
      .integer('total_multi_wins')
      .notNullable()
      .defaultTo(0);
    table
      .integer('map_0')
      .notNullable()
      .defaultTo(-1);
    table
      .integer('map_1')
      .notNullable()
      .defaultTo(-1);
    table
      .integer('map_2')
      .notNullable()
      .defaultTo(-1);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('Users');
};
