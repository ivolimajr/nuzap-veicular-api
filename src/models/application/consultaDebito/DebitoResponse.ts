import { ApiProperty } from '@nestjs/swagger';

export class DebitoResponse {
  @ApiProperty({ description: 'Código externo do débito', example: 16662630 })
  cod_fatura: number;

  @ApiProperty({ description: 'Data de vencimento do débito', example: "2024-12-23T06:00:00.000Z" })
  vencimento: string;

  @ApiProperty({ description: 'Status do débito junto ao orgão', example: "Em aberto" })
  status_debito: string;

  @ApiProperty({ description: 'Valor do débito já com todos os juros e encargos', example: "62.82" })
  valor: string;

  @ApiProperty({ description: 'Descriçao do débito', example: "Licenciamento 2024" })
  descricao: string;
}

