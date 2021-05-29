
const Sequelize = require('sequelize');
const connection = require('../database');

const Task = connection.define(
  // table name
  'tasks',
  // fields 
  {
    // field
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isDone: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
  },
  {
    // createdAt, updatedAt, createdAt, 
    paranoid: true,
  }

);

Task.sync({ force: false }).then(() => { })
module.exports = Task;