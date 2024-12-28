import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from '@nestjs/class-validator';

export class ConsultaPlacaRequest {
  @IsNotEmpty({ message: 'O numero da placa não pode estar vazio.' })
  @IsString({ message: 'A placa deve ser uma string.' })
  @Length(7, 7, { message: 'A placa ter 7 caracteres.' })
  @ApiProperty({
    description: 'Numero da placa',
    example: "ABC1D23",
  })
  placa: string;
}
