'use strict';

const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parcelatudo_carro', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      placa: DataTypes.STRING(7),
      uf: DataTypes.STRING(2),
      renavam: DataTypes.STRING(25),
      chassi: DataTypes.STRING(45),
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'parcelatudo_user',
          key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parcelatudo_carro');
  },
};
