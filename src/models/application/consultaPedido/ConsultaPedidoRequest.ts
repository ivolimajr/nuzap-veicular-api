import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from '@nestjs/class-validator';

export class ConsultaPedidoRequest {
  @IsNotEmpty({ message: 'A informação do numero do pedido não pode estar vazio.' })
  @IsString({ message: 'O número do pedido deve ser uma string.' })
  @Length(5, 10, { message: 'O numero deve ter entre 5 e 10 caracteres.' })
  @ApiProperty({
    description: 'Número do pedido',
    example: "5648753",
    type: String
  })
  numeroPedido: string;
}
