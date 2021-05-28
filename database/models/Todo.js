
const Sequelize = require('sequelize');
const connection = require('../database');

const Todo = connection.define(
  // table name
  'todo',
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
    }
  }
);

Todo.sync({ force: false }).then(() => { })
module.exports = Todo;