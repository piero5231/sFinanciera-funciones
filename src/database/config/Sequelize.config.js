require('ts-node/register');
const { Config } = require('../../config');
const driver = Config.database.connection;
module.exports = {
  username: Config.database.connections.username,
  password: Config.database.connections.password,
  database: Config.database.connections.database,
  host: Config.database.connections.host,
  dialect: Config.database.connections.driver,
  port: Config.database.connections.port,
};
