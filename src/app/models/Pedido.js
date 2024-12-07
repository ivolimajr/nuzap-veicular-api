import Sequelize, { DataTypes, Model } from "sequelize";

class Pedido extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        numeroPedido: DataTypes.BIGINT,
        status: DataTypes.STRING(35),
        valorLiquido: DataTypes.DECIMAL(5,2),
        valorPago: DataTypes.DECIMAL(5,2),
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        carroId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'cars',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
      },
      {
        sequelize,
        tableName: "parcelatudo_pedido",
        timestamps: false,
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.Carro, { foreignKey: "carroId", as: "Carro" });
    this.hasMany(models.Debito, { foreignKey: "pedidoId", as: "Debito" });
  }
}

export default Pedido;
