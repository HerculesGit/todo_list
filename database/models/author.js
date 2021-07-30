// 'use strict';
// const { Model, Sequelize } = require('sequelize');
// const Book = require('./book')['book']
// const sequelize = require('../database')

// class Author extends Model { }
// Author.init({
//   userName: Sequelize.STRING
// }, {
//   // underscored: true,
//   sequelize,
//   modelName: 'author',
//   tableName: 'author'

// });

// // Will add userId to Book model, but field will be set to `user_id`
// // This means column name will be `user_id`
// Author.hasMany(Book);

// module.exports = Author;

module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('author', {
    userName: DataTypes.STRING
  }, {

    tableName: "author",
    modelName: "author"
  });
  Author.associate = (models) => {
    Author.hasMany(models.Book);
  };
  return Author;
};