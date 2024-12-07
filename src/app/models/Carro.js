import Sequelize, { DataTypes, Model } from "sequelize";

class Carro extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        placa: DataTypes.STRING(7),
        uf: DataTypes.STRING(2),
        renavam: DataTypes.STRING(25),
        chassi: DataTypes.STRING(45),
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        userId: {
          type: DataTypes.BIGINT,
          references: {
            model: 'parcelatudo_users',
            key: 'userId',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
      },
      {
        sequelize,
        tableName: "parcelatudo_carro",
        timestamps: false,
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId", as: "User" });
    this.hasMany(models.Pedido, { foreignKey: "carroId", as: "Pedidos" });
  }
}

export default Carro;
