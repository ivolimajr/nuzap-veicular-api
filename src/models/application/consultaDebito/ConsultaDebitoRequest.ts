import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from '@nestjs/class-validator';

export class ConsultaDebitoRequest {
  @IsNotEmpty({ message: 'A placa não pode estar vazio.' })
  @IsString({ message: 'A placa deve ser uma string.' })
  @Length(7, 15, { message: 'A placa deve ter entre 7 e 15 caracteres.' })
  @ApiProperty({
    description: 'Placa do veiculo',
    example: 'ABC1234',
    type: String,
  })
  placa: string;

  @IsOptional()
  @ApiProperty({
    description: 'Renavam do veiculo',
    example: '01094850567',
    type: String,
    required: false,
  })
  renavam: string;

  @IsNotEmpty({ message: 'O e-mail não pode estar vazio.' })
  @IsString({ message: 'E-mail deve ser uma string.' })
  @Length(5, 70, { message: 'E-mail deve ter entre 5 e 70 caracteres.' })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao.silva@example.com',
    type: String,
  })
  email: string;

  @IsNotEmpty({ message: 'O telefone não pode estar vazio.' })
  @IsString({ message: 'O telefone deve ser uma string.' })
  @Matches(/^\d{10,11}$/, {
    message: 'O telefone deve conter apenas números com 10 ou 11 dígitos.',
  })
  @ApiProperty({
    description: 'Telefone celular do cliente',
    example: '11912345678',
    type: String,
  })
  telefone: string;
}
