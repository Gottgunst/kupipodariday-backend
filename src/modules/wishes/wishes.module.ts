import { Module, forwardRef } from '@nestjs/common';
import { WishesController, WishesPublicController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { WishEntity } from './entities/wish.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, WishEntity]),
    forwardRef(() => UsersModule),
  ],
  controllers: [WishesPublicController, WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {}
