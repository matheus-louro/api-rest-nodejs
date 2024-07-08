import { env } from './src/env/index';
// Update with your config settings.

const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: env.DATABASE_URL
    },
    useNullAsDefault: true,
    migrations: {
      extension: "ts",
      directory: './db/migrations',
    }
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: env.DATABASE_URL
    },
    useNullAsDefault: true,
    migrations: {
      extension: "ts",
      directory: './db/migrations',
    }
  }

};

module.exports = config;
