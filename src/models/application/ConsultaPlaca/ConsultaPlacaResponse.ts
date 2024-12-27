import { ApiProperty } from '@nestjs/swagger';

export class ConsultaPlacaResponse {
  @ApiProperty({ description: 'ID do veículo', example: 1 })
  id: number;

  @ApiProperty({ description: 'Placa do veículo', example: 'ABC1234' })
  placa: string;

  @ApiProperty({ description: 'Chassi do veículo', example: '123456789ABCDEFG' })
  chassi: string;

  @ApiProperty({ description: 'Renavam do veículo', example: '1234567890' })
  renavam: string;

  @ApiProperty({ description: 'Marca e modelo do veículo', example: 'Honda Civic' })
  marcaModelo: string;

  @ApiProperty({ description: 'Ano de fabricação', example: '2020' })
  ano_fabricacao: string;

  @ApiProperty({ description: 'Ano do modelo', example: '2021' })
  anoModelo: string;

  @ApiProperty({ description: 'Cor do veículo', example: 'Preto' })
  cor: string;

  @ApiProperty({ description: 'UF de registro', example: 'SP' })
  uf: string;

  @ApiProperty({ description: 'CPF ou CNPJ do proprietário', example: '12345678901' })
  cpfCnpj: string;
}
