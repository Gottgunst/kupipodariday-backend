import { ApiProperty } from '@nestjs/swagger';

export class SignInUserResponseDto {
  @ApiProperty({ description: 'Access token', example: 'Bearer <JWT Token>' })
  access_token: string;
}
