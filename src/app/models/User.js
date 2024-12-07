import Sequelize, { DataTypes, Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
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
          defaultValue: Sequelize.fn("NOW"),
        },
      },
      {
        sequelize,
        tableName: "parcelatudo_users",
        timestamps: false,
      }
    );
    return this;
  }
}

export default User;
