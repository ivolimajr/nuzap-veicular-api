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
        pedidoId: DataTypes.BIGINT,
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
        tableName: "parcelatudo_log",
        timestamps: false,
      },
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.Pedido, { foreignKey: "pedidoId", as: "Pedido" });
  }
}

export default Log;
