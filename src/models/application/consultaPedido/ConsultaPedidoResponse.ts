import { ApiProperty } from '@nestjs/swagger';

export class ConsultaPedidoResponse {
  @ApiProperty({
    description: 'Status do retorno',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensagem de retorno da API parceira',
    example: 'Retorno Com Sucesso',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Lista de débitos',
    example: {
      pedido: 5081106,
      status: 'Negado Adquirente',
    },
  })
  data: Data;
}

interface Data {
  pedido: number;
  status: string;
}
