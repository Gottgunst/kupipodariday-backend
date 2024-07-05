import { forwardRef, Module } from '@nestjs/common';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishEntity, WishlistEntity } from '../entities.index';
import { WishesModule } from '../modules.index';

@Module({
  imports: [
    TypeOrmModule.forFeature([WishlistEntity, WishEntity]),
    forwardRef(() => WishesModule),
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService],
  exports: [WishlistsService],
})
export class WishlistsModule {}
