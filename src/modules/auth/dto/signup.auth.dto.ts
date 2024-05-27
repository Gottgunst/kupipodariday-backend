import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class CreateUserDto extends PickType(UserEntity, [
  'username',
  'about',
  'avatar',
  'email',
  'password',
] as const) {}
