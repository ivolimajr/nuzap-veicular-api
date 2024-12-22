import Sequelize, { DataTypes, Model } from "sequelize";

class Log extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        descricao: DataTypes.STRING(200),
        statusAtual: DataTypes.STRING(60),
        statusFinal: DataTypes.STRING(60),
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
      },
      {
        sequelize,
        tableName: "log",
        timestamps: false,
      },
    );
    return this;
  }
}

export default Log;
