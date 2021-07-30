'use strict';
// const { Model, Sequelize } = require('sequelize');

const sequelize = require('./database/database')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: uuidPrimaryKey(),
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { },
      },
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Post);
  };
  return User;
};
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

class Author extends Model { }
Author.init({
  userName: Sequelize.STRING
}, {
  // underscored: true,
  sequelize,
  modelName: 'author',
  tableName: 'author'

});

// Will add userId to Book model, but field will be set to `user_id`
// This means column name will be `user_id`
Author.hasMany(Book);

// Will also add userId to Book model, but field will be set to `user_id`
// This means column name will be `user_id`
Book.belongsTo(Author);

module.exports = { author: Author, book: Book };