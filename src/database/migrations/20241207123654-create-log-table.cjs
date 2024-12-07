'use strict';

const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parcelatudo_log', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      pedidoId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "parcelatudo_pedido",
          key: "id",
        }
      },
      descricao: DataTypes.STRING(200),
      statusAtual: DataTypes.STRING(35),
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parcelatudo_log');
  },
};
