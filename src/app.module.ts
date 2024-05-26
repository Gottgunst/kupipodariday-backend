import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  UsersModule,
  WishesModule,
  WishlistsModule,
  OffersModule,
  AuthModule,
} from './modules';

@Module({
  imports: [
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
