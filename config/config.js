require('dotenv').config();

module.exports = {
  "development": {
    'username': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'database': process.env.DB_NAME,
    'host': process.env.DB_HOST,
    'port':process.env.DB_PORT,
    'dialect': 'mysql',
    'max': 20,
    'min': 0,
    'acquire': 20000,
    'idle': 20000,
    'evict': 10000
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "port": process.env.DB_PORT,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
  },
  "production": {
    'username': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'database': process.env.DB_NAME,
    'host': process.env.DB_HOST,
    'port':process.env.DB_PORT,
    'dialect': 'mysql',
    'max': 20, // maximum connection which postgresql or mysql can initiate
    'min': 0, // minimum connection which postgresql or mysql can initiate
    'acquire': 20000, // time require to reconnect
    'idle': 20000, // get idle connection
    'evict': 10000
  }
}
