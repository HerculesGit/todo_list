const uuid = require('uuid').v4

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('task', {
    name: DataTypes.STRING,
    isDone: DataTypes.BOOLEAN,
    userId: DataTypes.UUID,
  }, {
    paranoid: true,
    tableName: "task",
    modelName: "task"
  });

  Task.associate = (models) => {
    Task.belongsTo(models.user);
  };

  Task.beforeCreate(task => task.id = uuid())
  return Task;
};