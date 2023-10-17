/*external modules*/
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  @ApiProperty({ example: 'test12345' })
  readonly password: string;

  @IsString()
  @MinLength(12)
  @IsNotEmpty()
  @ApiProperty({ example: 'ce7df9cd0c13d01afbf5fcc8' })
  readonly code: string;
}
