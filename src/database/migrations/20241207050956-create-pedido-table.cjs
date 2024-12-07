'use strict';

const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parcelatudo_pedido', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      numeroPedido: DataTypes.BIGINT,
      status: DataTypes.STRING(25),
      valorLiquido: DataTypes.DECIMAL(5,2),
      valorPago: DataTypes.DECIMAL(5,2),
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      carroId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'parcelatudo_carro',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parcelatudo_pedido');
  },
};
