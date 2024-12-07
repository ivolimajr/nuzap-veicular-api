'use strict';

const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parcelatudo_user', {
      userId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      fullName: DataTypes.TEXT,
      preferredName: DataTypes.TEXT,
      pushName: DataTypes.TEXT,
      birthDate: DataTypes.TEXT,
      email: DataTypes.TEXT,
      phoneNumber: DataTypes.TEXT,
      lastUpdated: DataTypes.DATE,
      sessionId: DataTypes.TEXT,
      userType: DataTypes.TEXT,
      messageHistory: DataTypes.ARRAY(DataTypes.JSONB),
      conversationId: DataTypes.BIGINT,
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parcelatudo_user');
  },
};
