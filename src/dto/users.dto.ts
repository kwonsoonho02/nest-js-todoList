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
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  @ApiProperty({ type: String, description: 'Password' })
  password: string;
}

export class UpdateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  @ApiProperty({ type: String, description: 'Password' })
  password: string;
}
