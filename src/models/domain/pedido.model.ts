import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { Veiculo } from './veiculo.model';
import { Debito } from './debito.model';

@Table({
  tableName: 'pedido',
  schema: 'veicular',
  timestamps: true,
})
export class Pedido extends Model<Pedido> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Veiculo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'veiculo_id',
  })
  veiculoId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'pedido',
  })
  pedido: number;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'mensagem',
  })
  mensagem: string;

  @Column({
    type: DataType.STRING(60),
    allowNull: false,
    field: 'status',
  })
  status: string;

  @Column({
    type: DataType.DATE,
    field: 'created_at',
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at', // Alinha com o nome da coluna no banco
  })
  updatedAt!: Date;

  @BelongsTo(() => Veiculo, { foreignKey: 'veiculo_id' })
  veiculo: Veiculo;

  @HasMany(() => Debito, { foreignKey: 'pedidoId' })
  debitos!: Debito[];
}
