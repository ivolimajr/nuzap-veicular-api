import { IsArray, IsNotEmpty, IsNumber, IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CotacaoDebitoRequest  {

  @IsNotEmpty({ message: 'Informe o número do pedido' })
  @IsNumber()
  @ApiProperty({
    description: 'Número do pedido',
    example: 5648753,
    type: Number
  })
  pedido: number;

  @IsNotEmpty({ message: 'Informe a quantidade de parcelas' })
  @IsArray()
  @ApiProperty({
    description: 'Numero de parcelas a ser simulado, padrão 24',
    example: [123,1234],
  })
  codFaturas: number[];

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Numero de parcelas a ser simulado, padrão 24',
    example: 24,
    type: Number
  })
  qtdParcelas: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'codigo da bandeira, 3 para todos, padrão 3',
    example: 3,
    type: Number
  })
  cBandeira: number;
}
