import Sequelize, { DataTypes, Model } from "sequelize";

class Debito extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        status: DataTypes.STRING(25),
        descricao: DataTypes.STRING(150),
        valor: DataTypes.DECIMAL(5, 2),
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
      },
      {
        sequelize,
        tableName: "parcelatudo_debito",
        timestamps: false,
      },
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.Pedido, { foreignKey: "pedidoId"});
  }
}

export default Debito;
