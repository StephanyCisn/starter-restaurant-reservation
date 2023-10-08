/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

const {
  DATABASE_URL = "postgres://cfwvayuq:a9sA8WS4d8d5km4KxQkn2Cjr1HJ5SCj0@peanut.db.elephantsql.com/cfwvayuq",
  DATABASE_URL_DEVELOPMENT = "postgres://ibjtxlgp:NnsSj0DDUkZzXinJF9q1ndGzSZpePrsj@castor.db.elephantsql.com/ibjtxlgp",
  DATABASE_URL_TEST = "postgres://vdpffkqh:n4HwqKZ-zx-7qZaMN85Q8qdEkXrT8Kat@castor.db.elephantsql.com/vdpffkqh",
  DATABASE_URL_PREVIEW = "postgres://hojdzmrn:kQBkFV6uxQQpLdInfhmGaBcMHIt5I7SD@castor.db.elephantsql.com/hojdzmrn",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
