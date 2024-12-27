import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from '@nestjs/class-validator';

export class ConsultaDebitoRequest {
  @IsString({ message: 'A placa deve ser uma string.' })
  @Length(7, 8, { message: 'A placa deve ter entre 7 e 8 caracteres.' })
  @ApiProperty({ description: 'Placa do veiculo', example: 'ABC1234' })
  placa: string;

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao.silva@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Telefone celular do cliente',
    example: '61912345678',
  })
  telefone: string;
}
