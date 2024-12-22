import Sequelize, { DataTypes, Model } from "sequelize";

class Veiculo extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        placa: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        chassi: DataTypes.STRING,
        renavam: DataTypes.STRING,
        marcaModelo: {
          // camelCase no código
          type: DataTypes.STRING,
          field: "marca_modelo", // snake_case no banco
        },
        anoFabricacao: {
          type: DataTypes.STRING,
          field: "ano_fabricacao",
        },
        anoModelo: {
          type: DataTypes.STRING,
          field: "ano_modelo",
        },
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
        tableName: "veiculo",
        schema: "veicular",
        underscored: true, // Converte automaticamente camelCase para snake_case no banco
        timestamps: true, // Sequelize cuida de createdAt e updatedAt
      },
    );
    return this;
  }
}

export default Veiculo;
