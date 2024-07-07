import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, WishesModule } from '../modules.index';
import { UserEntity, WishEntity } from '../entities.index';
import { UserOrEmailExistExceptionsFilter } from 'src/common/filters';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, WishEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => WishesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserOrEmailExistExceptionsFilter],
  exports: [UsersService],
})
export class UsersModule {}
