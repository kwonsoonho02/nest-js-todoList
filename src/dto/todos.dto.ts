import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateTodoDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(15)
  public title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  public content: string;
}

export class UpdateTodoDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(15)
  public title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  public content: string;
}
