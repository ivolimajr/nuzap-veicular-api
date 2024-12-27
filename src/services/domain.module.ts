import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VeiculoService } from './domain/veiculo.service';
import { Veiculo } from '../models/domain/veiculo.model';
import { Pedido } from "../models/domain/pedido.model";
import { Debito } from "../models/domain/debito.model";
import { PedidoService } from "./domain/pedido.service";
import { DebitoService } from "./domain/debito.service";

@Module({
    imports: [SequelizeModule.forFeature([Veiculo, Pedido, Debito])],
    providers: [VeiculoService, PedidoService, DebitoService],
    exports: [VeiculoService, PedidoService, DebitoService],
})
export class DomainModule {}
