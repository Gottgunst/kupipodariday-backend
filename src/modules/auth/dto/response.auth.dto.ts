import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/users/entities/user.entity';

class UserAuthResponseDto extends PickType(UserEntity, ['id', 'email']) {}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Email & id user',
    type: () => UserAuthResponseDto,
  })
  user: {
    id: UserEntity['id'];
    email: UserEntity['email'];
  };

  @ApiProperty({ description: 'Access token', example: 'Bearer <JWT Token>' })
  accessToken: string;
}
