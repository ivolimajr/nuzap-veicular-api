import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Pedido } from '../../pedido/models/pedido.model';

@Table({
  tableName: 'debito',
  schema: 'veicular',
  timestamps: true,
})
export class Debito extends Model<Debito> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Pedido)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'pedido_id',
  })
  pedidoId!: number;

  @Column({
    type: DataType.INTEGER,
    field: 'cod_fatura',
    defaultValue: DataType.NOW,
  })
  codFatura!: number;

  @Column({
    type: DataType.DATE,
    field: 'vencimento',
    defaultValue: DataType.NOW,
  })
  vencimento!: Date;

  @Column({
    type: DataType.STRING(25),
    field: 'status_debito',
    allowNull: true,
  })
  statusDebito!: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
  })
  descricao!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  valor!: number;

  @Column({
    type: DataType.DATE,
    field: 'created_at',
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at', // Alinha com o nome da coluna no banco
  })
  updatedAt!: Date;

  @BelongsTo(() => Pedido, { foreignKey: 'pedido_id' })
  pedido!: Pedido;
}
