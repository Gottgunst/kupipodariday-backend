import { ApiProperty } from '@nestjs/swagger';

export class SignInUserResponseDto {
  // @ApiProperty({
  //   description: 'Email & id user',
  //   type: () => UserAuthResponseDto,
  // })
  // user: {
  //   id: UserId;
  //   email: UserEntity['email'];
  // };

  @ApiProperty({ description: 'Access token', example: 'Bearer <JWT Token>' })
  access_token: string;
}
