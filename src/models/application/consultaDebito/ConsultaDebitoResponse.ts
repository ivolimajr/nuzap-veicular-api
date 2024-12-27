import { ApiProperty } from '@nestjs/swagger';
import { DebitoResponse } from './DebitoResponse';

export class ConsultaDebitoResponse {
  @ApiProperty({ description: 'Numero externo do pedido', example: 5648753 })
  pedido: number;

  @ApiProperty({
    description: 'Mensagem de retorno',
    example: 'Retorno Com Sucesso',
  })
  mensagem: string;

  @ApiProperty({ description: 'Status da consulta', example: 'Consulta' })
  status: string;

  @ApiProperty({
    description: 'Lista de débitos',
    example: [
      {
        cod_fatura: 16662630,
        vencimento: '2024-12-23T06:00:00.000Z',
        status_debito: 'Em aberto',
        valor: '62.82',
        descricao: 'Licenciamento 2024',
      },
    ],
  })
  debitos!: DebitoResponse[];
}
