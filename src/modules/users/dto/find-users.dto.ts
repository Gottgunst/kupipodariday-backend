import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindUsersDto {
  @ApiProperty({
    description: 'username или email',
    example: 'some@ya.ru',
  })
  @IsString()
  query: string;
}
