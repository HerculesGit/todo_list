'use strict';

/*
const { Model, Sequelize } = require('sequelize');
const Author = require('./author')
const sequelize = require('../database')

class Book extends Model { }
Book.init({
  title: Sequelize.STRING,
  authorId: Sequelize.INTEGER
}, {
  // underscored: true,
  sequelize,
  modelName: 'book',
  tableName: 'book'
});
*/

// Book.belongsTo(Author);
// console.log('->', Author)
// module.exports = { book: Book };

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    authorId: DataTypes.INTEGER
  }, {
    tableName: "book",
    modelName: "book"

  });
  Book.associate = (models) => {
    Book.belongsTo(models.author);
  };
  return Book;
};