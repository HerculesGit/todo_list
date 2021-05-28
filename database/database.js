const Sequelize = require('sequelize');

const databaseName = 'todo_api';

const connection = new Sequelize(databaseName, 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = connection;