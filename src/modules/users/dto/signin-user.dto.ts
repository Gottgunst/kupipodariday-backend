import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class SignInUserDto extends PickType(UserEntity, [
  'username',
  'password',
] as const) {}
