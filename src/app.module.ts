import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  UsersModule,
  WishesModule,
  AuthModule,
  OffersModule,
  WishlistsModule,
} from './modules/modules.index';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfigFactory } from './config/db-config.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DbConfigFactory,
    }),
    AuthModule,
    UsersModule,
    WishesModule,
    OffersModule,
    WishlistsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
