import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from '@nestjs/class-validator';

export class ConsultaPlacaRequest {
  @IsNotEmpty({ message: 'O numero da placa não pode estar vazio.' })
  @IsString({ message: 'A placa deve ser uma string.' })
  @Length(7, 7, { message: 'A placa ter 7 caracteres.' })
  @ApiProperty({
    description: 'Numero da placa',
    type: String,
    example: 'ABC1D23',
  })
  placa: string;

  @IsOptional()
  @ApiProperty({
    description: 'Renavam do veículo',
    type: String,
    example: '01234512345',
    required: false,
  })
  renavam?: string;
}
