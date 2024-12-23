import Sequelize, { DataTypes, Model } from "sequelize";

class Pedido extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        veiculoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "veiculo",
            key: "id",
          },
        },
        pedido: DataTypes.INTEGER,
        mensagem: DataTypes.TEXT,
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.fn("NOW"),
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "updated_at",
        },
      },
      {
        sequelize,
        tableName: "pedido",
        schema: "veicular",
        underscored: true, // Converte automaticamente camelCase para snake_case no banco
        timestamps: true, // Sequelize cuida de createdAt e updatedAt
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Veiculo, { foreignKey: "veiculoId" });
    this.hasMany(models.Debito, { foreignKey: "pedidoId", as: "debitos" });
  }
}

export default Pedido;
