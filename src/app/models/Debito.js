import Sequelize, { DataTypes, Model } from "sequelize";

class Debito extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        pedidoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        codFatura: DataTypes.INTEGER,
        vencimento: DataTypes.DATE,
        statusDebito: DataTypes.STRING,
        valor: DataTypes.DECIMAL(10, 2),
        descricao: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "debito",
        schema: "veicular",
        underscored: true,
        timestamps: true, // Garante createdAt e updatedAt automaticamente
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Pedido, { foreignKey: "pedidoId", as: "pedido" });
  }
}

export default Debito;
