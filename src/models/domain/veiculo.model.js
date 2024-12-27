"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var sequelize_2 = require("../../config/sequelize");
var VeiculoModel = sequelize_2.default.define('veiculo', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    placa: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    chassi: sequelize_1.DataTypes.STRING,
    renavam: sequelize_1.DataTypes.STRING,
    uf: sequelize_1.DataTypes.STRING,
    marcaModelo: {
        type: sequelize_1.DataTypes.STRING,
        field: 'marca_modelo',
    },
    anoFabricacao: {
        type: sequelize_1.DataTypes.STRING,
        field: 'ano_fabricacao',
    },
    anoModelo: {
        type: sequelize_1.DataTypes.STRING,
        field: 'ano_modelo',
    },
    cpfCnpj: {
        type: sequelize_1.DataTypes.STRING,
        field: 'cpf_cnpj',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'created_at',
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
    },
}, {
    schema: 'veicular', // Define o schema para este modelo
    timestamps: true, // Garante createdAt e updatedAt automáticos
});
exports.default = VeiculoModel;
