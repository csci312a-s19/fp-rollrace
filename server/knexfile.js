module.exports = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: './rollrace.db'
    },
    useNullAsDefault: true,
    seeds: {
      directory: './seeds/test'
    }
  },

  development: {
    client: 'sqlite3',
    connection: {
      filename: './rollrace.db'
    },
    seeds: {
      directory: './seeds/dev'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: true,
    pool: {
      min: 2,
      max: 10
    }
  }
};
