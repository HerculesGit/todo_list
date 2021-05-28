'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('todos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      isDone: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      deteledAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('todos');
  }
};
