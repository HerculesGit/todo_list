module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING
    },
    userName: DataTypes.STRING,
  }, {
    tableName: "user",
    modelName: "user"
  });

  User.associate = (models) => {
    console.log('all models =>', models)
    User.hasMany(models.task);
  };

  User.beforeCreate(user => user.id = uuid());

  return User;
};