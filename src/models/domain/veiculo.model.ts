import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'veiculo',
  schema: 'veicular',
  timestamps: true,
})
export class Veiculo extends Model<Veiculo> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  placa!: string;

  @Column(DataType.STRING(17))
  chassi!: string;

  @Column(DataType.STRING(12))
  renavam!: string;

  @Column(DataType.STRING(2))
  uf!: string;

  @Column({
    type: DataType.STRING(100),
    field: 'marca_modelo',
  })
  marcaModelo!: string;

  @Column({
    type: DataType.STRING(4),
    field: 'ano_fabricacao',
  })
  anoFabricacao!: string;

  @Column({
    type: DataType.STRING(4),
    field: 'ano_modelo',
  })
  anoModelo!: string;

  @Column({
    type: DataType.STRING(50),
    field: 'cor',
  })
  cor!: string;

  @Column({
    type: DataType.STRING(14),
    field: 'cpf_cnpj',
  })
  cpfCnpj!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'created_at', // Alinha com o nome da coluna no banco
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at', // Alinha com o nome da coluna no banco
  })
  updatedAt!: Date;
}

export default Veiculo;
