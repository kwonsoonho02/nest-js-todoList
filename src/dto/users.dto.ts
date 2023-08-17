import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Email' })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(32)
  @ApiProperty({ type: String, description: 'Password' })
  public password: string;
}

export class UpdateUserDTO extends CreateUserDTO {}
