import { forwardRef, Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferEntity } from './entities/offer.entity';
import { WishEntity } from '../wishes/entities/wish.entity';
import { WishesModule } from '../modules.index';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfferEntity, WishEntity]),
    forwardRef(() => WishesModule),
  ],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
