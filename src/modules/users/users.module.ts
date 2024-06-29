import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, WishesModule } from '../modules.index';
import { UserEntity, WishEntity } from '../entities.index';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, WishEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => WishesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
