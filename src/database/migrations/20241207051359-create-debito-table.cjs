"use strict";

const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("parcelatudo_debito", {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      status: DataTypes.STRING(25),
      descricao: DataTypes.STRING(150),
      valor: DataTypes.DECIMAL(5,2),
      vencimento: DataTypes.STRING(50),
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      pedidoId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "parcelatudo_pedido",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("parcelatudo_debito");
  },
};
